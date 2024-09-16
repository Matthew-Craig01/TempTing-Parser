import gleam/javascript/array.{type Array, fold}
import gleam/list.{intersperse, map}
import gleam/pair.{second}
import gleam/result.{all, partition}
import gleam/string.{concat}
import lexer/lexer
import parser/err
import parser/parser
import parser/template.{type Element, Slot, FreeText}

pub fn parse_template(input: String) -> Result(Array(Element), Array(err.Msg)) {
  let parsed = input |> lexer.lex |> parser.parse
  case parsed |> all {
    Ok(temp) -> temp |> array.from_list |> Ok
    Error(_) ->
      parsed
      |> partition
      |> second
      |> map(err.to_msg)
      |> array.from_list
      |> Error
  }
}

@external(javascript, "./stringify.mjs", "stringify")
fn stringify(_: Array(Element)) -> String
