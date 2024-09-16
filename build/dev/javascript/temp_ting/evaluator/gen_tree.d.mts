import type * as $crypto from "../../gleam_crypto/gleam/crypto.d.mts";
import type * as $array from "../../gleam_javascript/gleam/javascript/array.d.mts";
import type * as $bit_array from "../../gleam_stdlib/gleam/bit_array.d.mts";
import type * as $bool from "../../gleam_stdlib/gleam/bool.d.mts";
import type * as $dict from "../../gleam_stdlib/gleam/dict.d.mts";
import type * as $int from "../../gleam_stdlib/gleam/int.d.mts";
import type * as $io from "../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../gleam_stdlib/gleam/list.d.mts";
import type * as $result from "../../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $lexer from "../lexer/lexer.d.mts";
import type * as $template from "../parser/template.d.mts";

export function gen_list(min: number, max: number): _.List<number>;

export function random_string(min: number, max: number): string;

export function punctuation(): string;

export function identifier(): string;

export function label(): $template.Label$;

export function source(): $template.SourceLabel$;

export function d_label(): $template.DependencyLabel$;

export function free_string(): string;

export function free_text(): $template.FreeText$;

export function function$(depth: number): $template.Invocation$;

export function invocation(depth: number): $template.Invocation$;

export function slot(): $template.Element$;

export function element(): $template.Element$;

export function gen1(): _.List<_.Result<$template.Element$, $err.Syntax$>>;

export function gen_n(n: number): _.List<
  _.List<_.Result<$template.Element$, $err.Syntax$>>
>;

export function gen_n_array(n: number): $array.Array$<
  _.List<_.Result<$template.Element$, $err.Syntax$>>
>;
