import gleam/int
import gleam/list.{Continue, Stop, fold_until, map}
import gleam/option.{type Option, None, Some}
import gleam/string.{concat}
import tok

pub type Syntax {
  EmptyInput
  Slot(Slot, tok.Pos, tok.Pos)
  InvalidElement(tok.Token, tok.Pos)
  //FreeText(FreeText, String)
}

pub type Slot {
  MissingCloseBrace
  EmptySlot
  DependencyLabel(Label)
  Invocation(Invocation, tok.Pos, tok.Pos)
}

pub type Label {
  EmptyLabel(tok.Pos)
  Role(Role)
  Index(Index)
  SourceLabel(Label, tok.Pos)
}

pub type Index {
  InvalidIndex(tok.Tokens, tok.Pos, tok.Pos)
  EmptyIndex(tok.Pos)
}

pub type Role {
  InvalidRole(tok.Tokens, tok.Pos, tok.Pos)
  EmptyRole(tok.Pos)
}

pub type Invocation {
  EmptyInvocation
  Function(Function, name: String)
  MissingCloseString
  InvalidInvocation(tok.Tokens)
}

pub type Function {
  MissingFunctionName(tok.Pos)
  InvalidFunctionName(#(tok.Token, tok.Pos), tok.Pos, tok.Pos)
  Arg(Arg)
}

pub type Arg {
  MissingCloseArgs
  ExtraCloseArgs(tok.Pos)
  ArgInvocation(Invocation, tok.Pos, tok.Pos)
}

pub type Msg {
  Msg(msg: String, from: tok.Pos, to: tok.Pos)
}

pub fn to_string(e: Syntax) -> String {
  let Msg(s, from, to) = e |> to_msg
  from |> pos_to_string <> " -> " <> to |> pos_to_string <> "\n" <> s
}

pub fn to_msg(e: Syntax) -> Msg {
  let format =
    "
{slot} lexeme {slot} punctuation
"
  let Msg(s, from, to) = case e {
    EmptyInput -> Msg("Empty input", tok.Pos(1, 0, 0), tok.Pos(1, 0, 0))
    InvalidElement(tok.Invalid(_, "}"), pos) ->
      Msg(
        "Additional `}` found. Slots must be enclosed between `{` and `}`. Did you forget to include an opening `{` ?",
        pos,
        pos,
      )
    InvalidElement(t, pos) ->
      invalid_err([#(t, pos)], "Element", format, pos, pos)
    Slot(e, from, to) -> e |> slot_to_msg(from, to)
  }
  Msg("Syntax Error:\n\n" <> s, from, to)
}

pub fn slot_to_msg(e: Slot, from: tok.Pos, to: tok.Pos) -> Msg {
  case e {
    MissingCloseBrace -> Msg("Slot is not closed. Missing `}`", from, to)
    EmptySlot -> Msg("Slot is empty", from, to)
    DependencyLabel(l) -> label_to_msg(l, from)
    Invocation(e, f, t) -> e |> invocation_to_msg(f, t)
  }
}

pub fn label_to_msg(e: Label, from: tok.Pos) -> Msg {
  case e {
    EmptyLabel(pos) -> Msg("Label is Empty.", from |> tok.next_pos, pos)
    Role(e) -> e |> role_to_msg
    Index(e) -> e |> index_to_msg
    SourceLabel(e, src_from) -> e |> label_to_msg(src_from)
  }
}

pub fn role_to_msg(e: Role) -> Msg {
  let format = "One word identifier. eg. `nummod` or `noun`"
  case e {
    InvalidRole(toks, from, to) -> invalid_err(toks, "Role", format, from, to)
    EmptyRole(pos) -> Msg("Role is empty.", pos, pos)
  }
}

pub fn index_to_msg(e: Index) -> Msg {
  let format = "Indexes can only contain digits from 0-9."
  let tip = " `_` must be followed by a number stating the role's index.
TIP: The index indicates precedance when multiple roles share the same identifier.
" <> multi_word
  case e {
    EmptyIndex(pos) -> Msg("Index is empty." <> tip <> format, pos, pos)
    InvalidIndex(toks, from, to) ->
      invalid_err(toks, "Index", format <> tip, from, to)
  }
}

pub fn invocation_to_msg(e: Invocation, from: tok.Pos, to: tok.Pos) -> Msg {
  let format =
    "Function (eg. sub-template)
  or
Interpolation of argument
  or
String"
  case e {
    EmptyInvocation ->
      Msg(
        "Invocation is empty.\nInvocation's are either:\n" <> format,
        from |> tok.next_pos,
        to |> tok.prev_pos,
      )
    Function(e, name) -> e |> function_to_msg(name, from, to)
    MissingCloseString -> Msg("String is missing closing `\"`", from, to)
    InvalidInvocation(toks) ->
      toks |> invalid_err("Invocation", format, from, to)
  }
}

pub fn function_to_msg(e: Function, name, from, to) -> Msg {
  let pre = "Error with function " <> name |> backticks <> ":\n"
  let format =
    "One word identifier. It can be the name of another template, which will invoke it as a sub-template"
  case e {
    MissingFunctionName(pos) ->
      Msg("Function (sub-template) is missing a name.", pos, pos)
    InvalidFunctionName(tok, fname_from, fname_to) ->
      invalid_err([tok], "Function name", format, fname_from, fname_to)
    Arg(e) -> {
      let Msg(s, _, _) as m = e |> arg_to_msg(from, to)
      Msg(..m, msg: pre <> s)
    }
  }
}

pub fn arg_to_msg(e: Arg, from, to) -> Msg {
  case e {
    MissingCloseArgs ->
      Msg("Function arguments are not closed. Missing `)`", from, to)
    ExtraCloseArgs(pos) ->
      Msg(
        "Extra `)` encountered. Perhaps you forgot to include `(` to open a nested function call?",
        pos,
        pos,
      )
    ArgInvocation(e, arg_from, arg_to) ->
      e |> invocation_to_msg(arg_from, arg_to)
  }
}

fn invalid_err(
  toks: tok.Tokens,
  type_string: String,
  format: String,
  from: tok.Pos,
  to: tok.Pos,
) -> Msg {
  let invalid_format =
    "Invalid "
    <> type_string
    <> " format:\nFormat must be in the form:\n"
    <> format
    <> "\n\n"
  case find_invalid(toks) {
    Ok(#(opt, c, _)) -> {
      let pre = case opt {
        Some(chars) -> type_string <> ": " <> chars |> concat <> "\n"
        None -> ""
      }
      let tip = invalid_tip(c, type_string)
      let err =
        c |> backticks
        <> " is not a valid character for "
        <> type_string
        <> ".\n\n"
      Msg(pre <> err <> invalid_format <> tip, from, to)
    }
    Error(_) -> Msg(invalid_format, from, to)
  }
}

const multi_word = "Separation of multi-word identifiers can be done with \ncamelCase (capitaliseEachWord) \nor kebab-case (put-a-hyphen-between-each-word)."

fn invalid_tip(c: tok.Char, type_string) {
  let args_tip =
    "TIP:
`(` and `)` are used to enclose function arguments.
Function arguments can be either:
One of the Template's arguments.
  or
A string (eg. \"this is a string.\").
  or
A nested function (eg. `my-template()`)."
  case c {
    "}" -> "TIP: Slots are not nestable."
    "<" -> "TIP: `<` is prefixed before source labels."
    "_" -> "TIP: `_` is prefixed before role indexes.\n" <> multi_word
    ":" ->
      "TIP: `:` is used to separate dependency labels (left) and invocations (right)."
    "\"" -> "TIP: `\"` must surround a string invocation."
    "," -> "TIP: `,` is used to separate arguments in a function call."
    "(" -> args_tip
    ")" -> args_tip
    " " | "\n" | "\t" ->
      "TIP: " <> type_string <> " cannot contain whitespace." <> multi_word
    _ -> ""
  }
}

fn find_invalid(
  toks: tok.Tokens,
) -> Result(#(Option(tok.Chars), tok.Char, tok.Pos), Nil) {
  toks
  |> fold_until(Error(Nil), fn(_, t) {
    case t {
      #(tok.Invalid(opt, c), pos) -> #(opt, c, pos) |> Ok |> Stop
      _ ->
        Error(Nil)
        |> Continue
    }
  })
}

fn pos_to_string(pos: tok.Pos) -> String {
  let tok.Pos(ln, col, _) = pos
  ln |> int.to_string <> ":" <> col |> int.to_string
}

fn backticks(s: String) {
  "`" <> s <> "'"
}
