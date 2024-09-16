import type * as $array from "../../gleam_javascript/gleam/javascript/array.d.mts";
import type * as $bool from "../../gleam_stdlib/gleam/bool.d.mts";
import type * as $int from "../../gleam_stdlib/gleam/int.d.mts";
import type * as $io from "../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../gleam_stdlib/gleam/list.d.mts";
import type * as $pair from "../../gleam_stdlib/gleam/pair.d.mts";
import type * as $result from "../../gleam_stdlib/gleam/result.d.mts";
import type * as $deparser from "../evaluator/deparser.d.mts";
import type * as $gen_tree from "../evaluator/gen_tree.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $lexer from "../lexer/lexer.d.mts";
import type * as $parser from "../parser/parser.d.mts";
import type * as $template from "../parser/template.d.mts";
import type * as $temp_ting from "../temp_ting.d.mts";

export function deparse(
  genned: _.List<_.List<_.Result<$template.Element$, $err.Syntax$>>>
): _.Result<_.List<string>, undefined>;

export function show_failures(res: _.List<_.Result<any, [any, any]>>): undefined;

export function compare<APB>(reparsed: _.List<APB>, genned: _.List<APB>): _.Result<
  undefined,
  undefined
>;

export function evaluate(n: number): _.Result<undefined, undefined>;

export function test_deparser(): undefined;
