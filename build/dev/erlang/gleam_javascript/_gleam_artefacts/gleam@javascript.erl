-module(gleam@javascript).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([type_of/0, symbol/0]).

-type type_of() :: undefined_type |
    object_type |
    boolean_type |
    number_type |
    big_int_type |
    string_type |
    symbol_type |
    function_type.

-type symbol() :: any().


