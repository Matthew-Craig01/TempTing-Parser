import type * as $bool from "../../../gleam_stdlib/gleam/bool.d.mts";
import type * as $io from "../../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../../gleam_stdlib/gleam/list.d.mts";
import type * as $result from "../../../gleam_stdlib/gleam/result.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $err from "../../parser/err.d.mts";
import type * as $invocation from "../../parser/internals/invocation.d.mts";
import type * as $label from "../../parser/internals/label.d.mts";
import type * as $template from "../../parser/template.d.mts";
import type * as $tok from "../../tok.d.mts";

export function parse_slot(toks: _.List<[$tok.Token$, $tok.Pos$]>): _.Result<
  [
    _.Result<$template.Element$, $err.Slot$>,
    _.List<[$tok.Token$, $tok.Pos$]>,
    $tok.Pos$
  ],
  $err.Slot$
>;
