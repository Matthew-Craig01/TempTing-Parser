import parser/err
import gleam/javascript/array.{type Array}

pub type Template =
  List(Result(Element, err.Syntax))

pub type Element {
  Slot(dependency_label: DependencyLabel, invocation: Invocation)
  FreeText(text: FreeText)
}

pub type FreeText {
  LexemeOrString(lexeme_or_string: String)
  Punctuation(punctuation: String)
}

pub type DependencyLabel {
  DependencyLabel(label: Label, source: SourceLabel)
  Root
}

pub type SourceLabel {
  SourceLabel(label: Label)
  SourceRoot
}

pub type Label {
  Label(role: String, index: Int)
}


pub type Invocation {
  Function(name: String, args: Array(Invocation))
  Interpolation(interpolation: String)
  StringInvocation(string: String)
}
