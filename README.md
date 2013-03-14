## Inherit

Inherit mixin for [rework](https://github.com/visionmedia/rework).
Like the extend mixin, but does more.

### API

    var inherit = require('rework-inherit')

    var css = rework(inputCSS)
      .use(inherit())
      .toString()

### Limitations

- You can not inherit something from inside a media query

### License

WTFPL