import type * as $io from "../../../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../../../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../../../gleam_stdlib/gleam/option.d.mts";
import type * as $string from "../../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $types from "../../lexer/internals/types.d.mts";
import type * as $tok from "../../tok.d.mts";

export function increment(l: $types.Lexer$): $types.Lexer$;

export function increment_ln(l: $types.Lexer$): $types.Lexer$;

export function add_token_with_pos(
  l: $types.Lexer$,
  t: $tok.Token$,
  pos: $tok.Pos$
): $types.Lexer$;

export function add_token(l: $types.Lexer$, t: $tok.Token$): $types.Lexer$;

export function change_context(
  l: $types.Lexer$,
  context: (x0: $types.Lexer$, x1: string) => $types.Lexer$
): $types.Lexer$;

export function add_to_acc(l: $types.Lexer$, c: string): $types.Lexer$;

export function tokenise_acc(
  l: $types.Lexer$,
  token_func: (x0: _.List<string>) => $tok.Token$
): $types.Lexer$;

export function tokenise_acc_identifier(l: $types.Lexer$): $types.Lexer$;
