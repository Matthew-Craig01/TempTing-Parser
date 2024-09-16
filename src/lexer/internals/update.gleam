import gleam/io.{debug}
import gleam/list.{Continue, Stop, contains, fold_until, reverse}
import gleam/option.{None, Some}
import gleam/string.{to_graphemes}
import lexer/internals/types.{type Context, type Lexer, Lexer}
import tok

pub fn increment(l: Lexer) -> Lexer {
  Lexer(..l, pos: tok.Pos(l.pos.ln, l.pos.col + 1, l.pos.char + 1))
}

pub fn increment_ln(l) -> Lexer {
  Lexer(..l, pos: tok.Pos(l.pos.ln + 1, -1, l.pos.char))
}

pub fn add_token_with_pos(l: Lexer, t: tok.Token, pos: tok.Pos) -> Lexer {
  let new_tokens = [#(t, pos), ..l.tokens]
  Lexer(..l, tokens: new_tokens)
}

pub fn add_token(l: Lexer, t: tok.Token) -> Lexer {
  add_token_with_pos(l, t, l.pos)
}

pub fn change_context(l: Lexer, context: Context) -> Lexer {
  Lexer(..l, context: context)
}

pub fn add_to_acc(l: Lexer, c: tok.Char) -> Lexer {
  let acc =
    case l.acc {
      None -> #([c], l.pos)
      Some(#(chars, pos)) -> #([c, ..chars], pos)
    }
    |> Some
  Lexer(..l, acc: acc)
}

pub fn tokenise_acc(l: Lexer, token_func: fn(tok.Chars) -> tok.Token) -> Lexer {
  case l.acc {
    Some(#(acc, pos)) -> l |> tokenise_acc_(acc, pos, token_func)
    None -> l
  }
}

pub fn tokenise_acc_identifier(l: Lexer) -> Lexer {
  case l.acc {
    None -> l
    Some(#(chars, pos)) -> {
      case check_identifier(chars) {
        Ok(Nil) -> l |> tokenise_acc_(chars, pos, tok.Identifier)
        Error(char) ->
          l
          |> tokenise_acc_(chars, pos, fn(chars) {
            tok.Invalid(Some(chars), char)
          })
      }
    }
  }
}

fn check_identifier(chars: tok.Chars) -> Result(Nil, tok.Char) {
  chars
  |> fold_until(Ok(Nil), fn(_, char) {
    case ["_", ",", "<", ":", "\""] |> contains(char) {
      True -> Stop(Error(char))
      False -> Continue(Ok(Nil))
    }
  })
}

fn tokenise_acc_(
  l: Lexer,
  acc: tok.Chars,
  pos: tok.Pos,
  token_func: fn(tok.Chars) -> tok.Token,
) -> Lexer {
  let t = acc |> reverse |> token_func
  Lexer(..l, acc: None) |> add_token_with_pos(t, pos)
}
