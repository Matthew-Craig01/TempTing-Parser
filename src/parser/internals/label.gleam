import gleam/bool.{guard}
import gleam/int
import gleam/list.{is_empty}
import gleam/option.{type Option, None, Some}
import gleam/pair
import gleam/result.{map_error, try}
import gleam/string.{concat}
import parser/err
import parser/template.{
  type DependencyLabel, type Label, type SourceLabel, DependencyLabel, Label,
  Root, SourceLabel, SourceRoot,
}
import tok

//## Dependency Label
pub fn parse_dependency_label(
  toks: tok.Tokens,
  slot_from: tok.Pos,
) -> Result(#(DependencyLabel, tok.Tokens, tok.Pos), err.Label) {
  case toks |> tok.split_once(tok.DependencyLabelSuffix) {
    Error(Nil) -> #(Root, toks, slot_from) |> Ok
    Ok(#(dl, after, to)) -> {
      use parsed <- try(parse_dependency_label_(dl, to))
      #(parsed, after, to) |> Ok
    }
  }
}

fn parse_dependency_label_(
  toks: tok.Tokens,
  to: tok.Pos,
) -> Result(DependencyLabel, err.Label) {
  use <- guard(toks |> is_empty, err.EmptyLabel(to) |> Error)
  use #(before, source_label, label_to) <- try(
    toks
    |> parse_source_label(to)
    |> map_error(fn(e) { err.SourceLabel(e |> pair.first, e |> pair.second) }),
  )
  use label <- try(before |> parse_label(label_to))
  case label {
    Label("root", _) -> Root
    _ -> DependencyLabel(label, source_label)
  }
  |> Ok
}

fn parse_label(toks: tok.Tokens, to: tok.Pos) -> Result(Label, err.Label) {
  use <- guard(toks |> is_empty, err.EmptyLabel(to) |> Error)
  use #(before, index, to_role) <- try(
    toks
    |> parse_index(to)
    |> map_error(err.Index),
  )
  use role <- try(
    before
    |> parse_role(to_role)
    |> map_error(err.Role),
  )
  Label(role |> concat, index) |> Ok
}

//### Source Label
fn parse_source_label(
  toks: tok.Tokens,
  to: tok.Pos,
) -> Result(#(tok.Tokens, SourceLabel, tok.Pos), #(err.Label, tok.Pos)) {
  case toks |> tok.split_once(tok.SourceLabelPrefix) {
    Error(Nil) -> #(toks, SourceRoot, to) |> Ok
    Ok(#(before, l_toks, from)) -> {
      use label <- try(
        l_toks |> parse_label(to) |> map_error(fn(e) { #(e, from) }),
      )
      let src_lbl = case label {
        Label("root", _) -> SourceRoot
        _ -> SourceLabel(label)
      }
      #(before, src_lbl, from) |> Ok
    }
  }
}

//### Index
fn parse_index(
  toks: tok.Tokens,
  to: tok.Pos,
) -> Result(#(tok.Tokens, Int, tok.Pos), err.Index) {
  case toks |> tok.split_once(tok.IndexPrefix) {
    Error(Nil) -> #(toks, 0, to) |> Ok
    Ok(#(before, i_toks, role_to)) -> {
      case i_toks {
        [#(tok.Index(i), from)] -> {
          use as_int <- try(
            i
            |> concat
            |> int.parse
            |> map_error(fn(_) { err.InvalidIndex(i_toks, from, to) }),
          )
          #(before, as_int, role_to) |> Ok
        }
        [#(_, from), ..] -> err.InvalidIndex(i_toks, from, to) |> Error
        [] -> err.EmptyIndex(to) |> Error
      }
    }
  }
}

//### Role
fn parse_role(toks: tok.Tokens, to: tok.Pos) -> Result(tok.Chars, err.Role) {
  case toks {
    [#(tok.Identifier(role), _)] -> role |> Ok
    [] -> err.EmptyRole(to) |> Error
    [#(_, from), ..] -> err.InvalidRole(toks, from, to) |> Error
  }
}
