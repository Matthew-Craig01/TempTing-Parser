import type * as $bool from "../../../gleam_stdlib/gleam/bool.d.mts";
import type * as $int from "../../../gleam_stdlib/gleam/int.d.mts";
import type * as $list from "../../../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../../../gleam_stdlib/gleam/option.d.mts";
import type * as $pair from "../../../gleam_stdlib/gleam/pair.d.mts";
import type * as $result from "../../../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $err from "../../parser/err.d.mts";
import type * as $template from "../../parser/template.d.mts";
import type * as $tok from "../../tok.d.mts";

export function parse_dependency_label(
  toks: _.List<[$tok.Token$, $tok.Pos$]>,
  slot_from: $tok.Pos$
): _.Result<
  [$template.DependencyLabel$, _.List<[$tok.Token$, $tok.Pos$]>, $tok.Pos$],
  $err.Label$
>;
