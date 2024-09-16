import gleam/bool.{guard}
import gleam/list.{contains, fold, reverse}
import gleam/option.{None, Some}
import gleam/string.{to_graphemes}
import lexer/internals/guard
import lexer/internals/types.{type Context, type Lexer, Lexer}
import lexer/internals/update
import tok

//# Main lexer functions
pub fn lex(input: String) -> tok.Tokens {
  let l =
    input
    |> to_graphemes
    |> lex_with_lexer(Lexer([], None, tok.Pos(1, 0, 0), element))
  // Necessary for cleanup, in the event that final freetext hasn't been lexed yet
  let l = l |> l.context(" ")
  l.tokens |> reverse
}

fn lex_acc(l: Lexer, context: Context) -> Lexer {
  case l.acc {
    None -> l
    Some(#(acc, pos)) -> {
      let lexed =
        acc
        |> reverse
        |> lex_with_lexer(Lexer(l.tokens, None, pos, context))
      lexed
    }
  }
}

fn lex_with_lexer(input: tok.Chars, lexer: Lexer) {
  input
  |> fold(lexer, fn(l, char) { l |> l.context(char) |> update.increment })
}

//# Context
pub const punctuation: tok.Chars = [
  ".", ",", "?", "!", ":", ";", "–", "—", "-", "(", ")", "[", "]", "'",
  "‚", "„", "「", "」", "『", "』", "′", "″", "`", "@", "|", "~",
  "«", "»", "¿", "¡", "\"",
]

//.?!:;–—()[\]'/\,|~@#%&*^_<>«»·¿¡‚„「」『』′″`-

fn element(l: Lexer, c: tok.Char) -> Lexer {
  use <- guard.whitespace(l, c, tok.Text)
  use <- guard.blacklist(l, c, ["}"])
  case c {
    "{" ->
      l
      |> update.tokenise_acc(tok.Text)
      |> update.add_token(tok.OpenSlot)
      |> update.change_context(slot)
    _ ->
      case punctuation |> contains(c) {
        True ->
          l
          |> update.tokenise_acc(tok.Text)
          |> update.add_token(tok.Punctuation(c))
        False -> l |> update.add_to_acc(c)
      }
  }
}

fn slot(l: Lexer, c: tok.Char) -> Lexer {
  use <- guard.blacklist(l, c, ["{"])
  case c {
    ":" -> {
      let l = l |> lex_acc(label)
      case l.context == index {
        True -> l |> update.tokenise_acc(tok.Index)
        False -> l |> update.tokenise_acc_identifier
      }
      |> update.add_token(tok.DependencyLabelSuffix)
      |> update.change_context(slot)
    }
    "}" -> {
      l
      |> lex_acc(invocation)
      |> update.tokenise_acc_identifier
      |> update.add_token(tok.CloseSlot)
      |> update.change_context(element)
    }
    _ -> l |> update.add_to_acc(c)
  }
}

fn label(l: Lexer, c: tok.Char) -> Lexer {
  use <- guard.blacklist(l, c, [":", "(", ")", ","])
  use <- guard.whitespace_identifier(l, c)
  case c {
    "_" ->
      l
      |> update.tokenise_acc_identifier
      |> update.add_token(tok.IndexPrefix)
      |> update.change_context(index)
    //Identifier is tokenised because role is the only possible dangling acc when <
    "<" ->
      l
      |> update.tokenise_acc_identifier
      |> update.add_token(tok.SourceLabelPrefix)
    _ -> l |> update.add_to_acc(c)
  }
}

fn index(l: Lexer, c: tok.Char) -> Lexer {
  // io.debug("Lexing index")
  // io.debug(l.acc)
  use <- guard.whitespace(l, c, tok.Index)
  use <- guard.whitelist(l, c, [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "<",
  ])
  case c {
    "<" ->
      l
      |> update.tokenise_acc(tok.Index)
      |> update.add_token(tok.SourceLabelPrefix)
      |> update.change_context(label)
    _ -> l |> update.add_to_acc(c)
  }
}

fn invocation(l: Lexer, c: tok.Char) -> Lexer {
  use <- guard.whitespace_identifier(l, c)
  case c {
    "(" ->
      l
      |> update.tokenise_acc_identifier
      |> update.add_token(tok.OpenArgs)
    ")" -> {
      l
      |> update.tokenise_acc_identifier
      |> update.add_token(tok.CloseArgs)
    }
    "," -> {
      l
      |> update.tokenise_acc_identifier
      |> update.add_token(tok.ArgDelimiter)
    }
    "\"" -> {
      case l.acc {
        None -> l
        Some(_) -> {
          l
          |> update.add_to_acc(c)
          |> update.tokenise_acc_identifier
        }
      }
      |> update.add_token(tok.OpenString)
      |> update.change_context(string)
    }
    _ -> l |> update.add_to_acc(c)
  }
}

fn string(l: Lexer, c: tok.Char) {
  case c {
    "\"" ->
      l
      |> update.tokenise_acc(tok.Text)
      |> update.add_token(tok.CloseString)
      |> update.change_context(invocation)
    _ -> l |> update.add_to_acc(c)
  }
}
