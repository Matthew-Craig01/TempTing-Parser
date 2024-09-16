/// <reference types="./eval.d.mts" />
import * as $array from "../../gleam_javascript/gleam/javascript/array.mjs";
import * as $bool from "../../gleam_stdlib/gleam/bool.mjs";
import * as $int from "../../gleam_stdlib/gleam/int.mjs";
import * as $io from "../../gleam_stdlib/gleam/io.mjs";
import { println } from "../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { filter, map } from "../../gleam_stdlib/gleam/list.mjs";
import * as $pair from "../../gleam_stdlib/gleam/pair.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import { all, map_error, try$ } from "../../gleam_stdlib/gleam/result.mjs";
import * as $deparser from "../evaluator/deparser.mjs";
import * as $gen_tree from "../evaluator/gen_tree.mjs";
import { gen_n } from "../evaluator/gen_tree.mjs";
import { Ok, Error, toList, isEqual } from "../gleam.mjs";
import * as $lexer from "../lexer/lexer.mjs";
import * as $parser from "../parser/parser.mjs";
import * as $template from "../parser/template.mjs";
import {
  DependencyLabel,
  FreeText,
  Function,
  Interpolation,
  Label,
  LexemeOrString,
  Punctuation,
  Root,
  Slot,
  SourceLabel,
  SourceRoot,
  StringInvocation,
} from "../parser/template.mjs";
import * as $temp_ting from "../temp_ting.mjs";
import { parse_template } from "../temp_ting.mjs";

export function deparse(genned) {
  let _pipe = genned;
  let _pipe$1 = map(_pipe, (t) => { return $deparser.deparse(t); });
  let _pipe$2 = all(_pipe$1);
  return map_error(
    _pipe$2,
    (e) => {
      println("UNEXPECTED err.Syntax ENCOUNTERED IN genned TEMPLATES");
      $io.debug(e);
      return undefined;
    },
  );
}

export function show_failures(res) {
  let _pipe = res;
  let _pipe$1 = $result.partition(_pipe);
  let _pipe$2 = $pair.second(_pipe$1);
  return $list.each(
    _pipe$2,
    (e) => {
      let g = e[0];
      let r = e[1];
      println("Failure case:");
      println("Genned:\n");
      let _pipe$3 = g;
      $io.debug(_pipe$3)
      println("\nreparsed:\n");
      let _pipe$4 = r;
      return $io.debug(_pipe$4);
    },
  );
}

export function compare(reparsed, genned) {
  return $bool.lazy_guard(
    $list.length(genned) !== $list.length(reparsed),
    () => {
      println("ERROR: genned and reparsed lengths do not match");
      return new Error(undefined);
    },
    () => {
      let res = (() => {
        let _pipe = $list.zip(genned, reparsed);
        let _pipe$1 = ((_capture) => {
          return $list.zip($list.range(0, $list.length(genned)), _capture);
        })(_pipe);
        return map(
          _pipe$1,
          (x) => {
            let i = x[0];
            let g = x[1][0];
            let r = x[1][1];
            let $ = isEqual(g, r);
            if ($) {
              println(
                (() => {
                  let _pipe$2 = i;
                  return $int.to_string(_pipe$2);
                })() + ": success",
              );
              return new Ok(undefined);
            } else {
              println(
                (() => {
                  let _pipe$2 = i;
                  return $int.to_string(_pipe$2);
                })() + ": FAILURE",
              );
              return new Error([g, r]);
            }
          },
        );
      })();
      println("-------------------------------");
      let $ = (() => {
        let _pipe = res;
        return all(_pipe);
      })();
      if ($.isOk()) {
        println("Success!");
        return new Ok(undefined);
      } else {
        println("Failures:");
        show_failures(res);
        return new Error(undefined);
      }
    },
  );
}

export function evaluate(n) {
  println("Starting evaluation");
  println(
    ("Generating " + (() => {
      let _pipe = n;
      return $int.to_string(_pipe);
    })()) + " templates...",
  );
  let genned = gen_n(n);
  println("Done generating");
  println("Deparsing templates to plain text...");
  return try$(
    (() => {
      let _pipe = genned;
      return deparse(_pipe);
    })(),
    (strs) => {
      println("Done deparsing");
      println("Reparsing plain text into templates...");
      let reparsed = (() => {
        let _pipe = strs;
        return map(
          _pipe,
          (s) => {
            let _pipe$1 = s;
            let _pipe$2 = $lexer.lex(_pipe$1);
            return $parser.parse(_pipe$2);
          },
        );
      })();
      println("Comparing with originally generated templates");
      return compare(reparsed, genned);
    },
  );
}

export function test_deparser() {
  let my_temp = toList([
    new Slot(new Root(), new StringInvocation("test")),
    new FreeText(new LexemeOrString("hello")),
    new FreeText(new Punctuation(",")),
    new Slot(
      new DependencyLabel(new Label("very-complex-role", 5), new SourceRoot()),
      new Function(
        "my-func",
        (() => {
          let _pipe = toList([
            new Function(
              "nested",
              (() => {
                let _pipe = toList([new Interpolation("interp-nested")]);
                return $array.from_list(_pipe);
              })(),
            ),
            new StringInvocation("string invocattion"),
            new Interpolation("not-nested-interpolation"),
          ]);
          return $array.from_list(_pipe);
        })(),
      ),
    ),
  ]);
  let strs = (() => {
    let _pipe = my_temp;
    let _pipe$1 = map(_pipe, (var0) => { return new Ok(var0); });
    let _pipe$2 = $deparser.deparse(_pipe$1);
    return $result.unwrap(_pipe$2, "Deparser failed");
  })();
  let _pipe = strs;
  let _pipe$1 = parse_template(_pipe);
  $io.debug(_pipe$1)
  let _pipe$2 = strs;
  return println(_pipe$2);
}
