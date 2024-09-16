import gleam/javascript/array
import gleam/int.{random}
import gleam/list
import gleam/result
import gleam/string
import parser/template.{
  type DependencyLabel, type Element, type FreeText, type Invocation, type Label,
  type SourceLabel, type Template, DependencyLabel, FreeText, Function,
  Interpolation, Label, LexemeOrString, Punctuation, Root, Slot, SourceLabel,
  SourceRoot, StringInvocation,
}
import gleam/io.{debug}

pub fn deparse(t: Template) -> Result(String, Nil) {
  use elems <- result.try(t |> result.all |> result.map_error(fn(_) { Nil }))
  elems |> list.map(element) |> string.join(whitespace()) |> Ok
}

pub fn whitespace() -> String {
  let n = random(5)
  list.range(0, n)
  |> list.map(fn(_) {
    case random(4) {
      0 -> ""
      1 -> " "
      2 -> "\n"
      3 -> "\t"
      _ -> panic
    }
  })
  |> string.concat
}

pub fn element(e: Element) -> String {
  case e {
    Slot(d, i) -> slot(d, i)
    FreeText(ft) -> free_text(ft)
  }
}

pub fn slot(d: DependencyLabel, i: Invocation) -> String {
  "{"
  <> whitespace()
  <> dependency_label(d)
  <> whitespace()
  <> invocation(i)
  <> whitespace()
  <> "}"
}

pub fn dependency_label(d: DependencyLabel) -> String {
  case d{
    DependencyLabel(l, s) -> label(l) <> whitespace() <> source(s) <> whitespace() <> ":"
    Root -> root()
  }
}

pub fn label(l) -> String {
  let Label(r, i) = l
  r <> whitespace() <> index(i)
}

pub fn index(i) -> String {
  case i{
    0 -> ""
    _ -> "_" <> i |> int.to_string
  }
}

pub fn source(s) -> String{
  case s{
    SourceLabel(l) -> "<" <> whitespace() <> label(l)
    SourceRoot -> src_root()
  }
}

pub fn root() -> String{
  case random(2){
    0 -> ""
    1 -> "root" <> whitespace() <> ":"
    _ -> panic
  }
}


pub fn src_root() -> String{
  case random(2){
    0 -> ""
    1 ->  "<" <> whitespace() <> "root"
    _ -> panic
  }
}

pub fn invocation(i) -> String{
  case i{
  Function(name, args) -> function(name, args)
  Interpolation(i) -> i
  StringInvocation(s) -> "\"" <> s <> "\""
}
}

pub fn function(name, args) -> String{
  let arg_str = args |> array.to_list |> list.map(invocation) |> string.join(delim())
  name <> whitespace() <> "(" <> whitespace() <> arg_str <> whitespace() <> ")"
}

pub fn delim() -> String{
  case random(4){
    0 ->  ","
    1 ->  whitespace() <> ","
    2 ->  whitespace() <> "," <> whitespace()
    3 ->  "," <> whitespace()
    _ -> panic
  }
}

pub fn free_text(f){
  case f{
  LexemeOrString(s) -> " " <> s
  Punctuation(s) -> s
  }
}
