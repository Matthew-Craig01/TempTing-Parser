import type * as $array from "../../../gleam_javascript/gleam/javascript/array.d.mts";
import type * as $bool from "../../../gleam_stdlib/gleam/bool.d.mts";
import type * as $io from "../../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../../../gleam_stdlib/gleam/option.d.mts";
import type * as $result from "../../../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $err from "../../parser/err.d.mts";
import type * as $template from "../../parser/template.d.mts";
import type * as $tok from "../../tok.d.mts";

export function parse_invocation(toks: _.List<[$tok.Token$, $tok.Pos$]>): _.Result<
  $template.Invocation$,
  $err.Invocation$
>;
