import type * as $option from "../../../gleam_stdlib/gleam/option.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $tok from "../../tok.d.mts";

export class Lexer extends _.CustomType {
  constructor(
    tokens: _.List<[$tok.Token$, $tok.Pos$]>,
    acc: $option.Option$<[_.List<string>, $tok.Pos$]>,
    pos: $tok.Pos$,
    context: (x0: Lexer$, x1: string) => Lexer$
  );
  
  tokens: _.List<[$tok.Token$, $tok.Pos$]>;
  acc: $option.Option$<[_.List<string>, $tok.Pos$]>;
  pos: $tok.Pos$;
  context: (x0: Lexer$, x1: string) => Lexer$;
}

export type Lexer$ = Lexer;

export type Context = (x0: Lexer$, x1: string) => Lexer$;
