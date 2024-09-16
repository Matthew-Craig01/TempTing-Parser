import type * as $io from "../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../gleam_stdlib/gleam/list.d.mts";
import type * as $result from "../../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $err from "../parser/err.d.mts";
import type * as $slot from "../parser/internals/slot.d.mts";
import type * as $template from "../parser/template.d.mts";
import type * as $tok from "../tok.d.mts";
import type * as $utils from "../utils.d.mts";

export function parse(toks: _.List<[$tok.Token$, $tok.Pos$]>): _.List<
  _.Result<$template.Element$, $err.Syntax$>
>;
