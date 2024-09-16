import gleam/javascript/array.{type Array, fold, from_list}
import parser/template.{
  type DependencyLabel, type Element, type Invocation, DependencyLabel, FreeText,
  Function, Interpolation, Root, Slot, Label, SourceLabel, SourceRoot
}
import gleam/option.{Some, None}

pub fn get_args(t: Array(Element)) {
  use acc, elem <- fold(t, [])
  case elem {
    FreeText(_) -> acc
    Slot(_, invocation) -> get_args_invocation(invocation, acc)
  }
}

fn get_args_invocation(i: Invocation, acc) {
  case i {
    Function(_, args) -> get_args_function(args, acc)
    Interpolation(interpolation) -> [interpolation, ..acc]
    _ -> acc
  }
}

fn get_args_function(args: Array(Invocation), acc) {
  args
  |> fold(acc, fn(acc, i) { get_args_invocation(i, acc) })
}

pub fn get_roles(t: Array(Element)) {
  use acc, elem <- fold(t, [])
  case elem {
    FreeText(_) -> acc
    Slot(d_lbl, _) ->
       get_roles_d_lbl(d_lbl, acc)
  }
}

fn get_roles_d_lbl(d_lbl: DependencyLabel, acc) {
  case d_lbl {
    DependencyLabel(Label(rolea, _), src) -> case src{
      SourceLabel(Label(roleb, _)) -> [rolea, roleb, ..acc]
      SourceRoot -> [rolea, ..acc]
    }
    Root -> acc
  }
}
