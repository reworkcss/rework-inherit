exports = module.exports = function () {
  return Inherit
}

exports.Inherit = Inherit

function Inherit(style) {
  if (!(this instanceof Inherit)) return new Inherit(style);

  var rules = this.rules = style.rules
  this.matches = {}

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i]
    if (rule.media) {
      this.inheritMedia(rule)
      if (!rule.rules.length) rules.splice(i--, 1);
    } else if (rule.selectors) {
      this.inheritRules(rule)
      if (!rule.declarations.length) rules.splice(i--, 1);
    }
  }

  this.removePlaceholders()
}

Inherit.prototype.inheritMedia = function (mediaRule) {
  var rules = mediaRule.rules
  var query = mediaRule.media

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i]
    if (!rule.selectors) continue;

    var additionalRules = this.inheritMediaRules(rule, query)

    if (!rule.declarations.length) rules.splice(i--, 1);

    var len = additionalRules.length
    if (len) {
      ;[].splice.apply(rules, [i, 0].concat(additionalRules))
      i += len
    }
  }
}

Inherit.prototype.inheritMediaRules = function (rule, query) {
  var declarations = rule.declarations
  var appendRules = []

  for (var i = 0; i < declarations.length; i++) {
    var decl = declarations[i]
    var key = decl.property
    if (!/^inherits?$/.test(key)) continue;

    decl.value.split(',').map(trim).forEach(function (val) {
      var rules = this.inheritMediaRule(val, rule.selectors, query)
      if (rules) [].push.apply(appendRules, rules);
    }, this)

    declarations.splice(i--, 1)
  }

  return appendRules
}

Inherit.prototype.inheritMediaRule = function (val, selectors, query) {
  var matchedRules = this.matches[val] || this.matchRules(val)
  var alreadyMatched = matchedRules.media[query]
  var matchedQueryRules = alreadyMatched || this.matchQueryRule(val, query)

  if (!matchedQueryRules.rules.length) {
    throw new Error('Failed to extend as media query from ' + val + '.')
  }

  this.appendSelectors(matchedQueryRules, val, selectors)

  if (!alreadyMatched) {
    // If not already matched, return rules to insert
    return matchedQueryRules.rules.map(function (rule) {
      return rule.rule
    })
  }
}

Inherit.prototype.inheritRules = function (rule) {
  var declarations = rule.declarations

  for (var i = 0; i < declarations.length; i++) {
    var decl = declarations[i]
    var key = decl.property
    if (!/^inherits?$/.test(key)) continue;

    decl.value.split(',').map(trim).forEach(function (val) {
      this.inheritRule(val, rule.selectors)
    }, this)

    declarations.splice(i--, 1)
  }
}

Inherit.prototype.inheritRule = function (val, selectors) {
  var matchedRules = this.matches[val] || this.matchRules(val)

  if (!matchedRules.rules.length) {
    throw new Error('Failed to extend from ' + val + '.')
  }

  this.appendSelectors(matchedRules, val, selectors)
}

Inherit.prototype.matchQueryRule = function (val, query) {
  var matchedRules = this.matches[val] || this.matchRules(val)

  return matchedRules.media[query] = {
    media: query,
    rules: matchedRules.rules.map(function (rule) {
      return {
        selectors: rule.selectors,
        declarations: rule.declarations,
        rule: {
          selectors: [],
          declarations: rule.declarations
        }
      }
    })
  }
}

Inherit.prototype.matchRules = function (val) {
  var matchedRules = this.matches[val] = {
    rules: [],
    media: {}
  }

  this.rules.forEach(function (rule) {
    if (!rule.selectors) return;

    var matchedSelectors = rule.selectors.filter(function (selector) {
      return ~selector.indexOf(val)
    })

    if (!matchedSelectors.length) return;

    matchedRules.rules.push({
      selectors: matchedSelectors,
      declarations: rule.declarations,
      rule: rule
    })
  })

  return matchedRules
}

Inherit.prototype.appendSelectors = function (matchedRules, val, selectors) {
  matchedRules.rules.forEach(function (matchedRule) {
    // Selector to actually inherit
    var selectorReference = matchedRule.rule.selectors

    matchedRule.selectors.forEach(function (matchedSelector) {
      ;[].push.apply(selectorReference, selectors.map(function (selector) {
        return replaceSelector(matchedSelector, val, selector)
      }))
    })
  })
}

// Placeholders are not allowed in media queries
Inherit.prototype.removePlaceholders = function () {
  var rules = this.rules

  for (var i = 0; i < rules.length; i++) {
    var selectors = rules[i].selectors
    if (!selectors) continue;

    for (var j = 0; j < selectors.length; j++) {
      var selector = selectors[j]
      if (~selector.indexOf('%')) selectors.splice(j--, 1);
    }

    if (!selectors.length) rules.splice(i--, 1);
  }
}

function replaceSelector(matchedSelector, val, selector) {
  return matchedSelector.replace(new RegExp(escapeRegExp(val), 'g'), selector)
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
}

function trim(x) {
  return x.trim()
}
