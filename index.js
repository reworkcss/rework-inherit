module.exports = function () {
  return function (style) {
    var rules = style.rules

    findRules(rules)
    removePlaceholders(rules)
  }
}

function findRules(rules) {
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i]
    var selectors = rule.selectors
    if (!selectors) continue;

    var declarations = rule.declarations

    for (var j = 0; j < declarations.length; j++) {
      var decl = declarations[j]
      var key = decl.property
      var val = decl.value
      if (!/^inherits?$/.test(key)) continue;

      inheritRules(rules, val, selectors)
      declarations.splice(j--, 1)
    }

    if (!declarations.length) rules.splice(i--, 1);
  }
}

function inheritRules(rules, val, selectors) {
  rules.forEach(function (rule) {
    if (!rule.selectors) return;

    var matchedSelectors = rule.selectors.filter(function (selector) {
      return ~selector.indexOf(val)
    })

    if (!matchedSelectors.length) return;

    selectors.forEach(function (selector) {
      matchedSelectors.forEach(function (matchedSelector) {
        rule.selectors.push(replaceSelector(matchedSelector, val, selector))
      })
    })
  })
}

function removePlaceholders(rules) {
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i]
    var selectors = rule.selectors
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