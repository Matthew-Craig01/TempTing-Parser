import evaluator/deparser
import evaluator/gen_tree.{gen_n}
import gleam/bool
import gleam/int
import gleam/io.{println}
import gleam/javascript/array
import gleam/list.{filter, map}
import gleam/pair
import gleam/result.{all, map_error, try}
import lexer/lexer
import parser/parser
import parser/template.{
  type DependencyLabel, type Element, type FreeText, type Invocation, type Label,
  type SourceLabel, type Template, DependencyLabel, FreeText, Function,
  Interpolation, Label, LexemeOrString, Punctuation, Root, Slot, SourceLabel,
  SourceRoot, StringInvocation,
}
import temp_ting.{parse_template}

pub fn evaluate(n: Int) -> Result(Nil, Nil) {
  println("Starting evaluation")
  println("Generating " <> n |> int.to_string <> " templates...")
  let genned = gen_n(n)
  println("Done generating")

  println("Deparsing templates to plain text...")
  use strs <- try(genned |> deparse)
  println("Done deparsing")

  // println("Plaintext\n")
  // strs |> list.each(fn(s){s |> println})

  println("Reparsing plain text into templates...")
  let reparsed = strs |> map(fn(s) { s |> lexer.lex |> parser.parse })

  println("Comparing with originally generated templates")
  compare(reparsed, genned)
}

pub fn deparse(genned) {
  genned
  |> map(fn(t) { deparser.deparse(t) })
  |> all
  |> map_error(fn(e) {
    println("UNEXPECTED err.Syntax ENCOUNTERED IN genned TEMPLATES")
    io.debug(e)
    Nil
  })
}

pub fn compare(reparsed, genned) {
  use <- bool.lazy_guard(list.length(genned) != list.length(reparsed), fn(){
    println("ERROR: genned and reparsed lengths do not match")
    Error(Nil)
  })

  let res =
    list.zip(genned, reparsed)
    |> list.zip(list.range(0, list.length(genned)), _)
    |> map(fn(x) {
      let #(i, #(g, r)) = x
      case g == r {
        True -> {
          println(i |> int.to_string <> ": success")
          Ok(Nil)
        }
        False -> {
          println(i |> int.to_string <> ": FAILURE")
          Error(#(g, r))
        }
      }
    })

  println("-------------------------------")

  case res |> all {
    Ok(_) -> {
      println("Success!")
      Ok(Nil)
    }
    Error(_) -> {
      println("Failures:")
      show_failures(res)
      Error(Nil)
    }
  }
}

pub fn show_failures(res) {
  res
  |> result.partition
  |> pair.second
  |> list.each(fn(e) {
    let #(g, r) = e
    println("Failure case:")

    println("Genned:\n")
    g |> io.debug

    println("\nreparsed:\n")
    r |> io.debug
  })
}

pub fn test_deparser() -> Nil {
let my_temp =
    [
      Slot(Root, StringInvocation("test")),
      FreeText(LexemeOrString("hello")),
      FreeText(Punctuation(",")),
      Slot(
        DependencyLabel(Label("very-complex-role", 5), SourceRoot),
        Function(
          "my-func",
          [
            Function(
              "nested",
              [Interpolation("interp-nested")] |> array.from_list,
            ),
            StringInvocation("string invocattion"),
            Interpolation("not-nested-interpolation"),
          ]
            |> array.from_list,
        ),
      ),
    ]
  let strs = my_temp
    |> map(Ok)
    |> deparser.deparse
    |> result.unwrap("Deparser failed")
  strs |> parse_template |> io.debug
  strs |> println
}
