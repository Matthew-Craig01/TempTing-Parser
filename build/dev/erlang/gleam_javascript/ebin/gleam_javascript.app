{application, gleam_javascript, [
    {vsn, "0.12.0"},
    {applications, [gleam_stdlib]},
    {description, "Work with JavaScript types and values in Gleam"},
    {modules, [gleam@javascript,
               gleam@javascript@array,
               gleam@javascript@map,
               gleam@javascript@promise]},
    {registered, []}
]}.
