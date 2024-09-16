import gleam/bit_array
import gleam/bool.{negate}
import gleam/crypto
import gleam/dict
import gleam/int.{random}
import gleam/io.{debug}
import gleam/javascript/array.{from_list, type Array}
import gleam/list.{filter, map, range}
import gleam/result
import gleam/string
import lexer/lexer
import parser/template.{
  type DependencyLabel, type Element, type FreeText, type Invocation, type Label,
  type SourceLabel, type Template, DependencyLabel, FreeText, Function,
  Interpolation, Label, LexemeOrString, Punctuation, Root, Slot, SourceLabel,
  SourceRoot, StringInvocation,
}

pub fn gen_n_array(n) -> Array(Template){
  gen_n(n) |> array.from_list
}

pub fn gen_n(n) -> List(Template) {
  range(1, n) |> map(fn(_) { gen1() })
}

pub fn gen1() -> Template {
  gen_list(1, 100) |> map(fn(_) { element() }) |> map(Ok)
}

pub fn gen_list(min, max) -> List(Int) {
  let elem_count = random(max-min) + min
  range(0, elem_count)
}

pub fn element() -> Element {
  case random(2) {
    0 -> slot()
    1 -> free_text() |> FreeText
    _ -> panic
  }
}

pub fn slot() -> Element {
  Slot(d_label(), invocation(0))
}

pub fn d_label() -> DependencyLabel {
  case random(2) {
    0 -> DependencyLabel(label(), source())
    1 -> Root
    _ -> panic
  }
}

pub fn label() -> Label {
  Label(identifier(), random(10))
}

pub fn source() -> SourceLabel {
  case random(2) {
    0 -> SourceLabel(label())
    1 -> SourceRoot
    _ -> panic
  }
}

const banned = ["_", ",", "<", ":", "\"", "{", "}", "(", ")", " ", "\n", "\t"]

pub fn identifier() -> String {
  let str = random_string(1, 100)
  let nobanned = str
  |> string.to_graphemes
  |> filter(fn(c) { banned |> list.contains(c) |> negate })
  |> string.concat
  case nobanned {
    "" -> "x"
    _ -> nobanned
  }
}

pub fn random_string(min, max) -> String {
  let len = random(max-min) + min
  let str = crypto.strong_random_bytes(len)
  |> bit_array.base64_url_encode(False)
  |> string.slice(0, len)
}

pub fn invocation(depth) -> Invocation {
  let r = case depth > 5 {
    True -> 2
    False -> 3
  }
  case random(r) {
    0 -> identifier() |> Interpolation
    1 -> random_string(0, 100) |> StringInvocation
    2 -> function(depth)
    _ -> panic
  }
}

pub fn function(depth) -> Invocation {
  Function(
    identifier(),
    gen_list(0, 5) |> map(fn(_) { invocation(depth + 1) }) |> array.from_list,
  )
}

pub fn free_text() -> FreeText {
  case random(2) {
    0 -> free_string() |> LexemeOrString
    1 -> punctuation() |> Punctuation
    _ -> panic
  }
}

pub fn free_string() -> String {
  let str = random_string(1, 100)
  let no_punc = str
  |> string.to_graphemes
  |> filter(fn(c) {
    !{ banned |> list.contains(c) || lexer.punctuation |> list.contains(c) }
  })
  |> string.concat
  case no_punc {
    "" -> "x"
    _ -> no_punc
  }
}

pub fn punctuation() -> String {
  let len = list.length(lexer.punctuation)
  let i = random(len)
  let d = lexer.punctuation |> list.zip(range(0, len), _) |> dict.from_list
  d |> dict.get(i) |> result.lazy_unwrap(fn() { panic })
}
