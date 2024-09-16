import tok
import gleam/option.{type Option}

pub type Lexer {
  Lexer(
    tokens: tok.Tokens,
    // Represents current progress when lexing multi-character tokens
    acc: Option(#(tok.Chars, tok.Pos)),
    pos: tok.Pos,
    context: Context,
  )
}


pub type Context =
  fn(Lexer, tok.Char) -> Lexer
