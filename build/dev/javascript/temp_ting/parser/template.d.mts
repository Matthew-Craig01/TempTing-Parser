import type * as $array from "../../gleam_javascript/gleam/javascript/array.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $err from "../parser/err.d.mts";

export class Slot extends _.CustomType {
  constructor(dependency_label: DependencyLabel$, invocation: Invocation$);
  
  dependency_label: DependencyLabel$;
  invocation: Invocation$;
}

export class FreeText extends _.CustomType {
  constructor(text: FreeText$);
  
  text: FreeText$;
}

export type Element$ = Slot | FreeText;

export class LexemeOrString extends _.CustomType {
  constructor(lexeme_or_string: string);
  
  lexeme_or_string: string;
}

export class Punctuation extends _.CustomType {
  constructor(punctuation: string);
  
  punctuation: string;
}

export type FreeText$ = LexemeOrString | Punctuation;

export class DependencyLabel extends _.CustomType {
  constructor(label: Label$, source: SourceLabel$);
  
  label: Label$;
  source: SourceLabel$;
}

export class Root extends _.CustomType {}

export type DependencyLabel$ = DependencyLabel | Root;

export class SourceLabel extends _.CustomType {
  constructor(label: Label$);
  
  label: Label$;
}

export class SourceRoot extends _.CustomType {}

export type SourceLabel$ = SourceLabel | SourceRoot;

export class Label extends _.CustomType {
  constructor(role: string, index: number);
  
  role: string;
  index: number;
}

export type Label$ = Label;

export class Function extends _.CustomType {
  constructor(name: string, args: $array.Array$<Invocation$>);
  
  name: string;
  args: $array.Array$<Invocation$>;
}

export class Interpolation extends _.CustomType {
  constructor(interpolation: string);
  
  interpolation: string;
}

export class StringInvocation extends _.CustomType {
  constructor(string: string);
  
  string: string;
}

export type Invocation$ = Function | Interpolation | StringInvocation;

export type Template = _.List<_.Result<Element$, $err.Syntax$>>;
