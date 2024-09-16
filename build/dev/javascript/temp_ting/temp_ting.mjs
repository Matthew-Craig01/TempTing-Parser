/// <reference types="./temp_ting.d.mts" />
import * as $array from "../gleam_javascript/gleam/javascript/array.mjs";
import { fold } from "../gleam_javascript/gleam/javascript/array.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import { intersperse, map } from "../gleam_stdlib/gleam/list.mjs";
import * as $pair from "../gleam_stdlib/gleam/pair.mjs";
import { second } from "../gleam_stdlib/gleam/pair.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import { all, partition } from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import { concat } from "../gleam_stdlib/gleam/string.mjs";
import { Ok, Error } from "./gleam.mjs";
import * as $lexer from "./lexer/lexer.mjs";
import * as $err from "./parser/err.mjs";
import * as $parser from "./parser/parser.mjs";
import * as $template from "./parser/template.mjs";
import { Slot, FreeText } from "./parser/template.mjs";
import { stringify } from "./stringify.mjs";

export function parse_template(input) {
  let parsed = (() => {
    let _pipe = input;
    let _pipe$1 = $lexer.lex(_pipe);
    return $parser.parse(_pipe$1);
  })();
  let $ = (() => {
    let _pipe = parsed;
    return all(_pipe);
  })();
  if ($.isOk()) {
    let temp = $[0];
    let _pipe = temp;
    let _pipe$1 = $array.from_list(_pipe);
    return new Ok(_pipe$1);
  } else {
    let _pipe = parsed;
    let _pipe$1 = partition(_pipe);
    let _pipe$2 = second(_pipe$1);
    let _pipe$3 = map(_pipe$2, $err.to_msg);
    let _pipe$4 = $array.from_list(_pipe$3);
    return new Error(_pipe$4);
  }
}
