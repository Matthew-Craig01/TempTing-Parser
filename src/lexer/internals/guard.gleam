import gleam/list.{contains, reverse}
import gleam/option.{None, Some}
import lexer/internals/types.{
  type Lexer, Lexer,
}
import lexer/internals/update
import tok

pub fn whitespace(
  l: Lexer,
  c: tok.Char,
  token_func: fn(tok.Chars) -> tok.Token,
  callback: fn() -> Lexer,
) -> Lexer {
  case c {
    " " | "\t" -> l |> update.tokenise_acc(token_func)
    "\n" -> l |> update.tokenise_acc(token_func) |> update.increment_ln
    _ -> callback()
  }
}

pub fn whitespace_identifier(
  l: Lexer,
  c: tok.Char,
  callback: fn() -> Lexer,
) -> Lexer {
  case c {
    " " | "\t" -> l |> update.tokenise_acc_identifier
    "\n" -> l |> update.tokenise_acc_identifier |> update.increment_ln
    _ -> callback()
  }
}

pub fn blacklist(
  l: Lexer,
  c: tok.Char,
  blacklist: tok.Chars,
  callback: fn() -> Lexer,
) -> Lexer {
  l |> invalid(c, blacklist, False, callback)
}

pub fn whitelist(
  l: Lexer,
  c: tok.Char,
  blacklist: tok.Chars,
  callback: fn() -> Lexer,
) -> Lexer {
  l |> invalid(c, blacklist, True, callback)
}

fn invalid(
  l: Lexer,
  c: tok.Char,
  char_list: tok.Chars,
  is_whitelist: Bool,
  callback: fn() -> Lexer,
) -> Lexer {
  case char_list |> contains(c), is_whitelist {
    True, True | False, False -> callback()
    False, True | True, False -> {
      case l.acc {
        Some(#(acc, _)) -> {
          let t = acc |> reverse |> Some |> tok.Invalid(c)
          Lexer(..l, acc: None) |> update.add_token(t)
        }
        None -> {
          let t = tok.Invalid(None, c)
          Lexer(..l, acc: None) |> update.add_token(t)
        }
      }
    }
  }
}
