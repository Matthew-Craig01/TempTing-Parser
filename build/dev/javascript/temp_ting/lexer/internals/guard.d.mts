import type * as $list from "../../../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../../../gleam_stdlib/gleam/option.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $types from "../../lexer/internals/types.d.mts";
import type * as $update from "../../lexer/internals/update.d.mts";
import type * as $tok from "../../tok.d.mts";

export function whitespace(
  l: $types.Lexer$,
  c: string,
  token_func: (x0: _.List<string>) => $tok.Token$,
  callback: () => $types.Lexer$
): $types.Lexer$;

export function whitespace_identifier(
  l: $types.Lexer$,
  c: string,
  callback: () => $types.Lexer$
): $types.Lexer$;

export function blacklist(
  l: $types.Lexer$,
  c: string,
  blacklist: _.List<string>,
  callback: () => $types.Lexer$
): $types.Lexer$;

export function whitelist(
  l: $types.Lexer$,
  c: string,
  blacklist: _.List<string>,
  callback: () => $types.Lexer$
): $types.Lexer$;
