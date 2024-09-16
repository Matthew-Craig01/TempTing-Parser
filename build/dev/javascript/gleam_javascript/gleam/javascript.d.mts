import type * as _ from "../gleam.d.mts";

export class UndefinedType extends _.CustomType {}

export class ObjectType extends _.CustomType {}

export class BooleanType extends _.CustomType {}

export class NumberType extends _.CustomType {}

export class BigIntType extends _.CustomType {}

export class StringType extends _.CustomType {}

export class SymbolType extends _.CustomType {}

export class FunctionType extends _.CustomType {}

export type TypeOf$ = UndefinedType | ObjectType | BooleanType | NumberType | BigIntType | StringType | SymbolType | FunctionType;

export type Symbol$ = any;

export function type_of(a: any): TypeOf$;

export function get_symbol(a: string): Symbol$;
