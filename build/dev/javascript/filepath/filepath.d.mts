import type * as $bool from "../gleam_stdlib/gleam/bool.d.mts";
import type * as $list from "../gleam_stdlib/gleam/list.d.mts";
import type * as $option from "../gleam_stdlib/gleam/option.d.mts";
import type * as $result from "../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "./gleam.d.mts";

export function join(left: string, right: string): string;

export function split_unix(path: string): _.List<string>;

export function split_windows(path: string): _.List<string>;

export function split(path: string): _.List<string>;

export function base_name(path: string): string;

export function extension(path: string): _.Result<string, undefined>;

export function strip_extension(path: string): string;

export function directory_name(path: string): string;

export function is_absolute(path: string): boolean;

export function expand(path: string): _.Result<string, undefined>;
