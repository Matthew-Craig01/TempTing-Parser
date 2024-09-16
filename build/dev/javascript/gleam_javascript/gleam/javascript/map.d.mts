import type * as _ from "../../gleam.d.mts";

export type Map$<FXS, FXR> = any;

export function new$(): Map$<any, any>;

export function set<FXX, FXY>(a: Map$<FXX, FXY>, b: FXX, c: FXY): Map$<FXX, FXY>;

export function get<FYD, FYE>(a: Map$<FYD, FYE>, b: FYD): _.Result<
  FYE,
  undefined
>;

export function size(a: Map$<any, any>): number;
