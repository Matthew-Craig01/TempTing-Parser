import gleam/io.{debug}
import gleam/bool.{guard, lazy_guard}
import gleam/list.{is_empty, reverse, try_map}
import gleam/option.{None, Some}
import gleam/result.{map_error, try}
import gleam/string.{concat}
import parser/err
import parser/template.{
  type Invocation, Function, Interpolation, StringInvocation,
}
import tok
import gleam/javascript/array.{from_list}

//## Invocation
pub fn parse_invocation(toks: tok.Tokens) -> Result(Invocation, err.Invocation) {
  // io.debug("--")
  // io.debug("Parsing Invocation")
  // io.debug(toks)
  // io.debug("--")
  use <- guard(toks |> is_empty, err.EmptyInvocation |> Error)
  case toks {
    //fname(..
    [#(tok.Identifier(fname), _), #(tok.OpenArgs, _), ..rest] ->
      rest
      |> parse_function(fname |> concat)
      |> map_error(fn(e) { e |> err.Function(fname |> concat) })
    //(
    [#(tok.OpenArgs, pos), ..] ->
      err.MissingFunctionName(pos)
      |> err.Function("")
      |> Error
    //invalidName(
    [#(tok.Invalid(Some(fname), _), from) as invalid, #(tok.OpenArgs, to), .._] ->
      err.InvalidFunctionName(invalid, from, to)
      |> err.Function(fname |> concat)
      |> Error
    //interpolation
    [#(tok.Identifier(interpolation), _)] ->
      Interpolation(interpolation |> concat)
      |> Ok
    //"s"
    [#(tok.OpenString, _), #(tok.Text(s), _), #(tok.CloseString, _)] ->
      StringInvocation(s |> concat)
      |> Ok
    //""
    [#(tok.OpenString, _), #(tok.CloseString, _)] ->
      StringInvocation("")
      |> Ok
    //"...
    [#(tok.OpenString, _), ..] -> err.MissingCloseString |> Error
    _ ->
      err.InvalidInvocation(toks)
      |> Error
  }
}

//### Function
fn parse_function(
  toks: tok.Tokens,
  name: String,
) -> Result(Invocation, err.Function) {
  use args <- try(toks |> parse_args)
  Function(name, args |> from_list) |> Ok
}

// #### Args
fn parse_args(toks: tok.Tokens) -> Result(List(Invocation), err.Function) {
  use <- guard(
    case toks {
      [#(tok.CloseArgs, _)] -> True
      _ -> False
    },
    Ok([]),
  )
  use arg_list <- try(toks |> get_args(0, []) |> map_error(err.Arg))
  arg_list
  |> reverse
  |> try_map(fn(arg) {
    let #(arg_toks, from, to) = arg
    case arg_toks |> reverse |> parse_invocation {
      Error(e) -> e |> err.ArgInvocation(from, to) |> err.Arg |> Error
      Ok(invocation) -> invocation |> Ok
    }
  })
}

fn get_args(
  toks: tok.Tokens,
  brackets: Int,
  acc: List(#(tok.Tokens, tok.Pos, tok.Pos)),
) -> Result(List(#(tok.Tokens, tok.Pos, tok.Pos)), err.Arg) {
  use <- lazy_guard(brackets < 0, fn() { panic as "Brackets < 0" })
  case toks, brackets {
    //(...
    [#(tok.OpenArgs, pos) as t, ..rest], _ ->
      get_args(rest, brackets + 1, acc |> add_to_arg(t, pos))
    //) with brackets == 0
    [#(tok.CloseArgs, _)], 0 -> acc |> Ok
    //)... with brackets == 0
    [#(tok.CloseArgs, pos), ..], 0 -> err.ExtraCloseArgs(pos) |> Error
    //) with brackets != 0
    [#(tok.CloseArgs, _)], _ -> err.MissingCloseArgs |> Error
    //)... with brackets != 0
    [#(tok.CloseArgs, pos) as t, ..rest], _ ->
      get_args(rest, brackets - 1, acc |> add_to_arg(t, pos))
    //,... with brackets == 0 (top level args)
    [#(tok.ArgDelimiter, pos), ..rest], 0 ->
      get_args(rest, 0, acc |> add_arg(pos))
    //Otherwise
    [#(_, pos) as t, ..rest], _ ->
      get_args(rest, brackets, acc |> add_to_arg(t, pos))
    //Missing close args
    [], _ -> err.MissingCloseArgs |> Error
  }
}

fn add_to_arg(
  acc: List(#(tok.Tokens, tok.Pos, tok.Pos)),
  t: #(tok.Token, tok.Pos),
  pos: tok.Pos,
) -> List(#(tok.Tokens, tok.Pos, tok.Pos)) {
  case acc {
    [] -> [#([t], pos, pos)]
    [#(first, from, _), ..rest] -> [#([t, ..first], from, pos), ..rest]
  }
}

fn add_arg(
  acc: List(#(tok.Tokens, tok.Pos, tok.Pos)),
  pos: tok.Pos,
) -> List(#(tok.Tokens, tok.Pos, tok.Pos)) {
  let tok.Pos(ln, col, char) = pos
  let from = tok.Pos(ln, col + 1, char+1)
  let new = #([], from, from)
  case acc {
    [] -> [new]
    [first, ..rest] -> [new, first, ..rest]
  }
}
