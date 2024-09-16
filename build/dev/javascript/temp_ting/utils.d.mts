import type * as $list from "../gleam_stdlib/gleam/list.d.mts";
import type * as _ from "./gleam.d.mts";

export function fold_with_rest<AGF, AGH>(
  ls: _.List<AGF>,
  acc: AGH,
  f: (x0: AGH, x1: AGF, x2: _.List<AGF>) => AGH
): AGH;

export function fold_until_with_rest<AGJ, AGL>(
  ls: _.List<AGJ>,
  acc: AGL,
  i: number,
  f: (x0: AGL, x1: AGJ, x2: _.List<AGJ>) => $list.ContinueOrStop$<AGL>
): [AGL, number];

export function get_first_rest<AGO>(ls: _.List<AGO>): _.Result<
  [AGO, _.List<AGO>],
  undefined
>;

export function result_guard<AGT, AGX>(
  r: _.Result<AGT, undefined>,
  default$: AGX,
  callback: (x0: AGT) => AGX
): AGX;
