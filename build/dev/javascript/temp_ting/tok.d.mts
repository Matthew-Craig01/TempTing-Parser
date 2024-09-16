import type * as $io from "../gleam_stdlib/gleam/io.d.mts";
import type * as $list from "../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../gleam_stdlib/gleam/option.d.mts";
import type * as $result from "../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "./gleam.d.mts";
import type * as $utils from "./utils.d.mts";

export class OpenSlot extends _.CustomType {}

export class CloseSlot extends _.CustomType {}

export class DependencyLabelSuffix extends _.CustomType {}

export class Punctuation extends _.CustomType {
  constructor(argument$0: string);
  
  0: string;
}

export class IndexPrefix extends _.CustomType {}

export class SourceLabelPrefix extends _.CustomType {}

export class Index extends _.CustomType {
  constructor(argument$0: _.List<string>);
  
  0: _.List<string>;
}

export class Identifier extends _.CustomType {
  constructor(argument$0: _.List<string>);
  
  0: _.List<string>;
}

export class Text extends _.CustomType {
  constructor(argument$0: _.List<string>);
  
  0: _.List<string>;
}

export class Invalid extends _.CustomType {
  constructor(argument$0: $option.Option$<_.List<string>>, argument$1: string);
  
  0: $option.Option$<_.List<string>>;
  1: string;
}

export class OpenString extends _.CustomType {}

export class CloseString extends _.CustomType {}

export class OpenArgs extends _.CustomType {}

export class CloseArgs extends _.CustomType {}

export class ArgDelimiter extends _.CustomType {}

export type Token$ = OpenSlot | CloseSlot | DependencyLabelSuffix | Punctuation | IndexPrefix | SourceLabelPrefix | Index | Identifier | Text | Invalid | OpenString | CloseString | OpenArgs | CloseArgs | ArgDelimiter;

export class Pos extends _.CustomType {
  constructor(ln: number, col: number, char: number);
  
  ln: number;
  col: number;
  char: number;
}

export type Pos$ = Pos;

export type Tokens = _.List<[Token$, Pos$]>;

export type Char = string;

export type Chars = _.List<string>;

export function split_once(toks: _.List<[Token$, Pos$]>, delim: Token$): _.Result<
  [_.List<[Token$, Pos$]>, _.List<[Token$, Pos$]>, Pos$],
  undefined
>;

export function to_string(tok: Token$): string;

export function prev_pos(pos: Pos$): Pos$;

export function next_pos(pos: Pos$): Pos$;
