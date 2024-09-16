import type * as $array from "./build/dev/javascript/gleam_javascript/gleam/javascript/array.mjs";
import * as $tok from "./build/dev/javascript/temp_ting/tok.mjs";
import * as gleam from "./build/dev/javascript/temp_ting/temp_ting.mjs";
import * as gleam_get from "./build/dev/javascript/temp_ting/get.mjs";
import {
  unwrap,
  unwrap_error,
} from "./build/dev/javascript/gleam_stdlib/gleam/result.mjs";
import { from_list } from "./build/dev/javascript/gleam_javascript/gleam/javascript/array.mjs";
import { Element$ } from "./build/dev/javascript/temp_ting/parser/template.mjs";

export type Pos = {
  ln: number;
  col: number;
  char: number;
};

export type ErrMsg = {
  msg: string;
  from: Pos;
  to: Pos;
};

export type Result<T> = {
  ok: boolean;
  value: T;
};

export const parse_template = (
  input: string,
): Result<Element$[] | ErrMsg[]> => {
  const result = gleam.parse_template(input);
  if (result.isOk()) {
    const parsed: Element$[] = unwrap(
      result,
      "ERROR unwrapping parsed result.",
    );
    return { ok: true, value: parsed };
  } else {
    const errors: ErrMsg[] = unwrap_error(result, [
      {
        msg: "ERROR unwrapping parsed result.",
        from: { ln: 0, col: 0, char: 0 },
        to: { ln: 0, col: 0, char: 0 },
      },
    ]);
    return { ok: false, value: errors };
  }
};

export const get_args = (t: Element$[]): string[] => {
  return from_list(gleam_get.get_args(t));
};

export const get_roles = (t: Element$[]): string[] => {
  return from_list(gleam_get.get_roles(t));
};

export const stringify = (template: Element$[] | ErrMsg[]) => {
  const replaceRoot = (k: string, v: any) => {
    const isRoot =
      typeof v === "object" &&
      (v.constructor.name === "Root" || v.constructor.name === "SourceRoot");
    if (isRoot) {
      return {
        Root: true,
      };
    }
    return v;
  };
  return JSON.stringify(template, replaceRoot, 2);
};
