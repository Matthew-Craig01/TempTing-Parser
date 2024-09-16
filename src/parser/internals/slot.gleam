//# Slot
import gleam/bool.{guard}
import gleam/io.{debug}
import gleam/list.{is_empty}
import gleam/result.{map_error, try}
import parser/err
import parser/internals/invocation.{parse_invocation}
import parser/internals/label.{parse_dependency_label}
import parser/template.{type Element, Slot}
import tok

pub fn parse_slot(
  toks: tok.Tokens,
) -> Result(#(Result(Element, err.Slot), tok.Tokens, tok.Pos), err.Slot) {
  case toks |> tok.split_once(tok.CloseSlot) {
    Error(Nil) -> err.MissingCloseBrace |> Error
    Ok(#(slot, after, to)) -> {
      let parsed = parse_slot_(slot, to)
      #(parsed, after, to) |> Ok
    }
  }
}

fn parse_slot_(toks: tok.Tokens, slot_to: tok.Pos) -> Result(Element, err.Slot) {
  use #(_, slot_from) <- try(
    toks
    |> list.first
    |> map_error(fn(_) { err.EmptySlot }),
  )
  use #(dependency_label, after_dl, invoc_from) <- try(
    toks
    |> parse_dependency_label(slot_from)
    |> map_error(fn(e) { e |> err.DependencyLabel }),
  )
  use <- guard(
    after_dl |> is_empty,
    err.EmptyInvocation
      |> err.Invocation(invoc_from, slot_to)
      |> Error,
  )
  use invocation <- try(
    after_dl
    |> parse_invocation
    |> map_error(fn(e) { e |> err.Invocation(invoc_from, slot_to) }),
  )
  Slot(dependency_label, invocation) |> Ok
}
