import * as gleam from "./build/dev/javascript/temp_ting/temp_ting.mjs";
import * as gleam_get from "./build/dev/javascript/temp_ting/get.mjs";
import { unwrap, unwrap_error, } from "./build/dev/javascript/gleam_stdlib/gleam/result.mjs";
import { from_list } from "./build/dev/javascript/gleam_javascript/gleam/javascript/array.mjs";
export var parse_template = function (input) {
    var result = gleam.parse_template(input);
    if (result.isOk()) {
        var parsed = unwrap(result, "ERROR unwrapping parsed result.");
        return { ok: true, value: parsed };
    }
    else {
        var errors = unwrap_error(result, [
            {
                msg: "ERROR unwrapping parsed result.",
                from: { ln: 0, col: 0, char: 0 },
                to: { ln: 0, col: 0, char: 0 },
            },
        ]);
        return { ok: false, value: errors };
    }
};
export var get_args = function (t) {
    return from_list(gleam_get.get_args(t));
};
export var get_roles = function (t) {
    return from_list(gleam_get.get_roles(t));
};
export var stringify = function (template) {
    var replaceRoot = function (k, v) {
        var isRoot = typeof v === "object" &&
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
