import gleam/io.{debug}
import gleam/list.{Continue, Stop, contains, reverse}
import gleam/option.{type Option}
import gleam/result.{map_error, try}
import gleam/string.{concat}
import utils

pub type Token {
  //{
  OpenSlot
  //}
  CloseSlot
  //:
  DependencyLabelSuffix
  Punctuation(Char)
  //_
  IndexPrefix
  //<
  SourceLabelPrefix
  Index(Chars)
  //role, function_name, interpolation
  Identifier(Chars)
  //free text: string, lexeme
  //string invocation
  Text(Chars)
  Invalid(Option(Chars), Char)
  //"
  OpenString
  //"
  CloseString
  //(
  OpenArgs
  //)
  CloseArgs
  //,
  ArgDelimiter
}

pub type Tokens =
  List(#(Token, Pos))

pub type Pos {
  Pos(ln: Int, col: Int, char: Int)
}

pub type Char =
  String

pub type Chars =
  List(Char)

pub fn split_once(
  toks: Tokens,
  delim: Token,
) -> Result(#(Tokens, Tokens, Pos), Nil) {
  use #(before, after, pos) <- try(split_once_([], toks, delim))
  #(before |> reverse, after, pos) |> Ok
}

fn split_once_(
  before: Tokens,
  after: Tokens,
  delim: Token,
) -> Result(#(Tokens, Tokens, Pos), Nil) {
  case after {
    [] -> Error(Nil)
    [#(t, pos) as first, ..rest] -> {
      case t == delim {
        True -> Ok(#(before, rest, pos))
        False -> split_once_([first, ..before], rest, delim)
      }
    }
  }
}

pub fn to_string(tok: Token) -> String {
  case tok {
    //{
    OpenSlot -> "{"
    //}
    CloseSlot -> "}"
    //:
    DependencyLabelSuffix -> ":"
    Punctuation(p) -> p
    //_
    IndexPrefix -> "_"
    //<
    SourceLabelPrefix -> "<"
    Index(i) -> i |> concat
    //role, function_name, interpolation
    Identifier(i) -> i |> concat
    //free text: string, lexeme
    //string invocation
    Text(s) -> s |> concat
    Invalid(_, c) -> c
    //"
    OpenString -> "\""
    //"
    CloseString -> "\""
    //(
    OpenArgs -> "("
    //)
    CloseArgs -> ")"
    //,
    ArgDelimiter -> ","
  }
}

pub fn prev_pos(pos: Pos) -> Pos{
  let Pos(ln, col, chars) = pos
  case ln, col{
    1, 0 -> Pos(1, 0, 0)
    _, 0 -> Pos(ln-1, 0, chars-1)
    _, _ -> Pos(ln, col-1, chars-1)
  }
}

pub fn next_pos(pos: Pos) -> Pos{
  let Pos(ln, col, chars) = pos
  Pos(ln, col+1, chars+1)
}
