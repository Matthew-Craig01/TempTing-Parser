import type * as $array from "../gleam_javascript/gleam/javascript/array.d.mts";
import type * as $option from "../gleam_stdlib/gleam/option.d.mts";
import type * as _ from "./gleam.d.mts";
import type * as $template from "./parser/template.d.mts";

export function get_roles(t: $array.Array$<$template.Element$>): _.List<string>;

export function get_args(t: $array.Array$<$template.Element$>): _.List<string>;
