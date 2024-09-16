import gleam/list.{type ContinueOrStop, Continue, Stop}

// Like list.fold but exposes the rest of the list to the function
pub fn fold_with_rest(ls: List(a), acc: b, f: fn(b, a, List(a)) -> b) -> b {
  case ls {
    [] -> acc
    [first, ..rest] -> rest |> fold_with_rest(f(acc, first, rest), f)
  }
}

// Like list.fold_until but exposes the rest of the list and index to the function
pub fn fold_until_with_rest(
  ls: List(a),
  acc: b,
  i: Int,
  f: fn(b, a, List(a)) -> ContinueOrStop(b),
) -> #(b, Int) {
  case ls {
    [] -> #(acc, i)
    [first, ..rest] ->
      case f(acc, first, rest) {
        Continue(next) -> rest |> fold_until_with_rest(next, i + 1, f)
        Stop(done) -> #(done, i)
      }
  }
}

pub fn get_first_rest(ls: List(a)) -> Result(#(a, List(a)), Nil) {
  case ls {
    [first, ..rest] -> #(first, rest) |> Ok
    [] -> Error(Nil)
  }
}

// Same a result.try, except returns default value if Error
pub fn result_guard(r: Result(a, Nil), default, callback: fn(a) -> b) -> b {
  case r {
    Ok(x) -> callback(x)
    Error(_) -> default
  }
}
