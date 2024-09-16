import type * as $array from "../gleam_javascript/gleam/javascript/array.d.mts";
import type * as $list from "../gleam_stdlib/gleam/list.d.mts";
import type * as $pair from "../gleam_stdlib/gleam/pair.d.mts";
import type * as $result from "../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "./gleam.d.mts";
import type * as $lexer from "./lexer/lexer.d.mts";
import type * as $err from "./parser/err.d.mts";
import type * as $parser from "./parser/parser.d.mts";
import type * as $template from "./parser/template.d.mts";

export function parse_template(input: string): _.Result<
  $array.Array$<$template.Element$>,
  $array.Array$<$err.Msg$>
>;
