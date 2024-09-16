import type * as $bool from "../../gleam_stdlib/gleam/bool.d.mts";
import type * as $list from "../../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../../gleam_stdlib/gleam/option.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $guard from "../lexer/internals/guard.d.mts";
import type * as $types from "../lexer/internals/types.d.mts";
import type * as $update from "../lexer/internals/update.d.mts";
import type * as $tok from "../tok.d.mts";

export const punctuation: _.List<string>;

export function lex(input: string): _.List<[$tok.Token$, $tok.Pos$]>;
