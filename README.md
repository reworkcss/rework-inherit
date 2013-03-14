## Inherit

Inherit mixin for [rework](https://github.com/visionmedia/rework).
Like the extend mixin, but does so much more.
If you inherit a selector,
it will inherit __all__ rules associated with that selector.

### API

    var inherit = require('rework-inherit')

    var css = rework(inputCSS)
      .use(inherit())
      .toString()

### Examples

#### Regular inherit

    .gray {
      color: gray;
    }

    .text {
      inherit: .gray;
    }

yields:

    .gray,
    .text {
      color: gray;
    }

#### Multiple inherit

Inherit multiple selectors at the same time.

    .gray {
      color: gray;
    }

    .black {
      color: black;
    }

    .button {
      inherit: .gray, .black;
    }

yields:

    .gray,
    .button {
      color: gray;
    }

    .black,
    .button {
      color: black;
    }

#### Placeholders

Any selector that includes a `%` is considered a placeholder.
Placeholders will not be output in the final CSS.

    %gray {
      color: gray;
    }

    .text {
      inherit: %gray;
    }

yields:

    .text {
      color: gray;
    }

#### Partial selectors

If you inherit a selector,
all rules that include that selector will be included as well.

    div button span {
      color: red;
    }

    div button {
      color: green;
    }

    button span {
      color: pink;
    }

    .button {
      inherit: button;
    }

    .link {
      inherit: div button;
    }

yields:

    div button span,
    div .button span,
    .link span {
      color: red;
    }

    div button,
    div .button,
    .link {
      color: green;
    }

    button span,
    .button span {
      color: pink;
    }

#### Media Queries

Inheriting from inside a media query will create a copy of the declarations.
It will act like a "mixin".
Thus, with `%`placeholders, you won't have to use mixins at all.
Each type of media query will need its own declaration,
so there will be some inevitable repetition.

    .gray {
      color: gray
    }

    @media (min-width: 320px) {
      .button {
        inherit: .gray;
      }
    }

    @media (min-width: 320px) {
      .link {
        inherit: .gray;
      }
    }

yields:

    .gray {
      color: gray;
    }

    @media (min-width: 320px) {
      .button,
      .link {
        color: gray;
      }
    }

### Limitations

- You can not inherit a rule that is inside a media query.
  In other words, rules must be defined outside media queries.
  This wouldn't make sense anyways; how would you type it?

### License

WTFPL