import type * as $array from "../../gleam_javascript/gleam/javascript/array.d.mts";
import type * as $int from "../../gleam_stdlib/gleam/int.d.mts";
import type * as $io from "../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../gleam_stdlib/gleam/list.d.mts";
import type * as $result from "../../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $template from "../parser/template.d.mts";

export function whitespace(): string;

export function index(i: number): string;

export function label(l: $template.Label$): string;

export function root(): string;

export function src_root(): string;

export function source(s: $template.SourceLabel$): string;

export function dependency_label(d: $template.DependencyLabel$): string;

export function delim(): string;

export function free_text(f: $template.FreeText$): string;

export function function$(
  name: string,
  args: $array.Array$<$template.Invocation$>
): string;

export function invocation(i: $template.Invocation$): string;

export function slot(d: $template.DependencyLabel$, i: $template.Invocation$): string;

export function element(e: $template.Element$): string;

export function deparse(t: _.List<_.Result<$template.Element$, $err.Syntax$>>): _.Result<
  string,
  undefined
>;
