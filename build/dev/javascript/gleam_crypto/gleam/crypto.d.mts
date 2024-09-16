import type * as $bit_array from "../../gleam_stdlib/gleam/bit_array.d.mts";
import type * as $int from "../../gleam_stdlib/gleam/int.d.mts";
import type * as $result from "../../gleam_stdlib/gleam/result.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";

export class Sha224 extends _.CustomType {}

export class Sha256 extends _.CustomType {}

export class Sha384 extends _.CustomType {}

export class Sha512 extends _.CustomType {}

export class Md5 extends _.CustomType {}

export class Sha1 extends _.CustomType {}

export type HashAlgorithm$ = Sha224 | Sha256 | Sha384 | Sha512 | Md5 | Sha1;

export function strong_random_bytes(a: number): _.BitArray;

export function hash(a: HashAlgorithm$, b: _.BitArray): _.BitArray;

export function hmac(
  data: _.BitArray,
  algorithm: HashAlgorithm$,
  key: _.BitArray
): _.BitArray;

export function secure_compare(left: _.BitArray, right: _.BitArray): boolean;

export function sign_message(
  message: _.BitArray,
  secret: _.BitArray,
  digest_type: HashAlgorithm$
): string;

export function verify_signed_message(message: string, secret: _.BitArray): _.Result<
  _.BitArray,
  undefined
>;
