import gleam/list.{reverse}
import gleam/io.{debug}
import gleam/result.{all, map_error, try}
import gleam/string.{concat}
import parser/err
import parser/internals/slot.{parse_slot}
import parser/template.{
  type Element, type FreeText, type Template, FreeText, LexemeOrString,
  Punctuation,
}
import tok
import utils

// Slot = {[dependencyLabel]:invocation}
// DependencyLabel = role[_index][<sourceLabel]:
// Invocation = function invocation | interoplation | string

// Each Element is parsed indenpendently, allowing for multiple errors. Necessary for fault-tolerant/graceful linting
pub fn parse(toks: tok.Tokens) -> Template {
  case toks {
    [] -> [err.EmptyInput |> Error]
    _ -> parse_(toks, [])
  }
}

fn parse_(toks: tok.Tokens, acc: Template) -> Template {
  use #(#(t, from), rest) <- utils.result_guard(
    toks |> utils.get_first_rest,
    acc |> reverse,
  )
  case t {
    tok.Punctuation(c) ->
      rest |> parse_([Punctuation(c) |> FreeText |> Ok, ..acc])
    tok.Text(cs) ->
      rest |> parse_([LexemeOrString(cs |> concat) |> FreeText |> Ok, ..acc])
    tok.OpenSlot -> {
      case rest |> parse_slot {
        Error(e) -> [e |> err.Slot(from, from) |> Error, ..acc]
        Ok(#(slot, after, to)) -> {
          let slot = slot |> map_error(fn(e) { e |> err.Slot(from, to) })
          after |> parse_([slot, ..acc])
        }
      }
    }
    _ -> rest |> parse_([err.InvalidElement(t, from) |> Error, ..acc])
  }
}
