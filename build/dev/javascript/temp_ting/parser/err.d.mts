import type * as $int from "../../gleam_stdlib/gleam/int.d.mts";
import type * as $list from "../../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../../gleam_stdlib/gleam/option.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";
import type * as $tok from "../tok.d.mts";

export class EmptyInput extends _.CustomType {}

export class Slot extends _.CustomType {
  constructor(argument$0: Slot$, argument$1: $tok.Pos$, argument$2: $tok.Pos$);
  
  0: Slot$;
  1: $tok.Pos$;
  2: $tok.Pos$;
}

export class InvalidElement extends _.CustomType {
  constructor(argument$0: $tok.Token$, argument$1: $tok.Pos$);
  
  0: $tok.Token$;
  1: $tok.Pos$;
}

export type Syntax$ = EmptyInput | Slot | InvalidElement;

export class MissingCloseBrace extends _.CustomType {}

export class EmptySlot extends _.CustomType {}

export class DependencyLabel extends _.CustomType {
  constructor(argument$0: Label$);
  
  0: Label$;
}

export class Invocation extends _.CustomType {
  constructor(
    argument$0: Invocation$,
    argument$1: $tok.Pos$,
    argument$2: $tok.Pos$
  );
  
  0: Invocation$;
  1: $tok.Pos$;
  2: $tok.Pos$;
}

export type Slot$ = MissingCloseBrace | EmptySlot | DependencyLabel | Invocation;

export class EmptyLabel extends _.CustomType {
  constructor(argument$0: $tok.Pos$);
  
  0: $tok.Pos$;
}

export class Role extends _.CustomType {
  constructor(argument$0: Role$);
  
  0: Role$;
}

export class Index extends _.CustomType {
  constructor(argument$0: Index$);
  
  0: Index$;
}

export class SourceLabel extends _.CustomType {
  constructor(argument$0: Label$, argument$1: $tok.Pos$);
  
  0: Label$;
  1: $tok.Pos$;
}

export type Label$ = EmptyLabel | Role | Index | SourceLabel;

export class InvalidIndex extends _.CustomType {
  constructor(
    argument$0: _.List<[$tok.Token$, $tok.Pos$]>,
    argument$1: $tok.Pos$,
    argument$2: $tok.Pos$
  );
  
  0: _.List<[$tok.Token$, $tok.Pos$]>;
  1: $tok.Pos$;
  2: $tok.Pos$;
}

export class EmptyIndex extends _.CustomType {
  constructor(argument$0: $tok.Pos$);
  
  0: $tok.Pos$;
}

export type Index$ = InvalidIndex | EmptyIndex;

export class InvalidRole extends _.CustomType {
  constructor(
    argument$0: _.List<[$tok.Token$, $tok.Pos$]>,
    argument$1: $tok.Pos$,
    argument$2: $tok.Pos$
  );
  
  0: _.List<[$tok.Token$, $tok.Pos$]>;
  1: $tok.Pos$;
  2: $tok.Pos$;
}

export class EmptyRole extends _.CustomType {
  constructor(argument$0: $tok.Pos$);
  
  0: $tok.Pos$;
}

export type Role$ = InvalidRole | EmptyRole;

export class EmptyInvocation extends _.CustomType {}

export class Function extends _.CustomType {
  constructor(argument$0: Function$, name: string);
  
  0: Function$;
  name: string;
}

export class MissingCloseString extends _.CustomType {}

export class InvalidInvocation extends _.CustomType {
  constructor(argument$0: _.List<[$tok.Token$, $tok.Pos$]>);
  
  0: _.List<[$tok.Token$, $tok.Pos$]>;
}

export type Invocation$ = EmptyInvocation | Function | MissingCloseString | InvalidInvocation;

export class MissingFunctionName extends _.CustomType {
  constructor(argument$0: $tok.Pos$);
  
  0: $tok.Pos$;
}

export class InvalidFunctionName extends _.CustomType {
  constructor(
    argument$0: [$tok.Token$, $tok.Pos$],
    argument$1: $tok.Pos$,
    argument$2: $tok.Pos$
  );
  
  0: [$tok.Token$, $tok.Pos$];
  1: $tok.Pos$;
  2: $tok.Pos$;
}

export class Arg extends _.CustomType {
  constructor(argument$0: Arg$);
  
  0: Arg$;
}

export type Function$ = MissingFunctionName | InvalidFunctionName | Arg;

export class MissingCloseArgs extends _.CustomType {}

export class ExtraCloseArgs extends _.CustomType {
  constructor(argument$0: $tok.Pos$);
  
  0: $tok.Pos$;
}

export class ArgInvocation extends _.CustomType {
  constructor(
    argument$0: Invocation$,
    argument$1: $tok.Pos$,
    argument$2: $tok.Pos$
  );
  
  0: Invocation$;
  1: $tok.Pos$;
  2: $tok.Pos$;
}

export type Arg$ = MissingCloseArgs | ExtraCloseArgs | ArgInvocation;

export class Msg extends _.CustomType {
  constructor(msg: string, from: $tok.Pos$, to: $tok.Pos$);
  
  msg: string;
  from: $tok.Pos$;
  to: $tok.Pos$;
}

export type Msg$ = Msg;

export function role_to_msg(e: Role$): Msg$;

export function index_to_msg(e: Index$): Msg$;

export function label_to_msg(e: Label$, from: $tok.Pos$): Msg$;

export function arg_to_msg(e: Arg$, from: $tok.Pos$, to: $tok.Pos$): Msg$;

export function invocation_to_msg(
  e: Invocation$,
  from: $tok.Pos$,
  to: $tok.Pos$
): Msg$;

export function function_to_msg(
  e: Function$,
  name: string,
  from: $tok.Pos$,
  to: $tok.Pos$
): Msg$;

export function slot_to_msg(e: Slot$, from: $tok.Pos$, to: $tok.Pos$): Msg$;

export function to_msg(e: Syntax$): Msg$;

export function to_string(e: Syntax$): string;
