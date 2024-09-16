# Parser
Similarly to [the backend](../../../backend/README.md), the parser is built with [Gleam](https://gleam.run/). However, the parser runs on Javascript, rather than Erlang. In order to run the parser, you do not need to install Gleam, however, building the project does require Gleam: [instructions](https://gleam.run/getting-started/installing/)

## Install Dependencies
```shell
gleam deps download
```


## Building the Parser
```shell
gleam build
```

## Using the Parser
For control, use the Gleam api([temp_ting.gleam](./src/temp_ting.gleam), [lexer.gleam](./src/lexer/lexer.gleam), [parser.gleam](./src/lexer/parser.gleam) ) directly. For general use, the [wrapper Javascript api](./api.ts) should suffice.

``` javascript
import * api

api.stringify(api.parse_template(template));
```


## Parser Evaluation
### Fail Cases
[Errs.org](./src/evaluator/errs.org) contains a formatted list of all possible parser fail cases. 

### Pass Cases

``` shell
gleam build; node src/evaluator/script.js
```
