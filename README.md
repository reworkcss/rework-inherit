## Inherit

Inherit mixin for [rework](https://github.com/visionmedia/rework).
Like the extend mixin, but does so much more.
If you inherit a selector,
it will inherit __all__ rules associated with that selector.

### API

```js
var inherit = require('rework-inherit')

var css = rework(inputCSS)
  .use(inherit())
  .toString()
```

### Examples

#### Regular inherit

```css
.gray {
  color: gray;
}

.text {
  inherit: .gray;
}
```

yields:

```css
.gray,
.text {
  color: gray;
}
```

#### Multiple inherit

Inherit multiple selectors at the same time.

```css
.gray {
  color: gray;
}

.black {
  color: black;
}

.button {
  inherit: .gray, .black;
}
```

yields:

```css
.gray,
.button {
  color: gray;
}

.black,
.button {
  color: black;
}
```

#### Placeholders

Any selector that includes a `%` is considered a placeholder.
Placeholders will not be output in the final CSS.

```css
%gray {
  color: gray;
}

.text {
  inherit: %gray;
}
```

yields:

```css
.text {
  color: gray;
}
```

#### Partial selectors

If you inherit a selector,
all rules that include that selector will be included as well.

```css
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
```

yields:

```css
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
```

#### Chained inheritance

```css
.button {
  background-color: gray;
}

.button-large {
  inherit: .button;
  padding: 10px;
}

.button-large-red {
  inherit: .button-large;
  color: red;
}
```

yields:

```css
.button,
.button-large,
.button-large-red {
  background-color: gray;
}

.button-large,
.button-large-red {
  padding: 10px;
}

.button-large-red {
  color: red;
}
```

#### Media Queries

Inheriting from inside a media query will create a copy of the declarations.
It will act like a "mixin".
Thus, with `%`placeholders, you won't have to use mixins at all.
Each type of media query will need its own declaration,
so there will be some inevitable repetition.

```css
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
```

yields:

```css
.gray {
  color: gray;
}

@media (min-width: 320px) {
  .button,
  .link {
    color: gray;
  }
}
```

### Limitations

- You can not inherit a rule that is inside a media query;
  you can only inherit rules outside a media query.
  If you find yourself in this situation,
  just use placeholders instead.
- Currently, selectors must be surrounded by spaces or trailed by a `:`.
  This will not work if you write your selectors like `div>button`!

### License

WTFPL