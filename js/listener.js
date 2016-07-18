/* jslint evil: true */

var lastItem;
var mathRegexp = /^([0-9]|\*|\/|\+|-|\.|\(|\)){3,}$/;

/**
 * Replaces with provided value in specified range of indexes and returns new string
 * @param  {Number} start       Replacement start index
 * @param  {Number} end         Replacement end index
 * @param  {String} replacement
 * @return {String}             New string with replacement
 */
String.prototype.replaceRange = function(start, end, replacement) {
  return this.substring(0, start)
    .concat(replacement)
    .concat(this.substring(end));
};

/**
 * Check if provided HTML element is valid input element
 * @param  {HTML element}  element
 * @return {Boolean}
 *
 * @example
 *   document.addEventListener('keypress', event => console.log(isInputElement(event.target)));
 */
function isInputElement(element) {
  var inputTags = ['INPUT', 'TEXTAREA'];

  if(inputTags.indexOf(element.tagName) !== -1) {
    return true;
  } else if(element.getAttribute('contenteditable')) {
    return true;
  }

  return false;
}

function getNearestExpression(string, position) {
  var expressionStart = string.lastIndexOf(' ', position - 2) + 1;
  var expression = string.substring(expressionStart, position - 1);

  if(mathRegexp.test(expression)) {
    return {
      value: expression,
      index: expressionStart
    };
  } else {
    return '';
  }
}

/**
 * @param  {HTML element}  element
 * @return {Boolean}
 */
function isReadyToReplace(element) {
  if(element && element.value) {
    var lastSymbol = element.value[element.selectionStart - 2];

    return /[0-9]/.test(lastSymbol);
  } else {
    return false;
  }
}

function checkEvent(event) {
  var target = event.target;

  if(event.key === 'Shift') {
    return;
  }

  if(event.code === 'Space' && isReadyToReplace(target)) {
    var value = target.value + event.key;
    var closestItem = getNearestExpression(value, target.selectionStart);

    if(closestItem) {
      try {
        var result = eval(closestItem.value);

        lastItem = closestItem;
        lastItem.target = target;
        lastItem.result = result;

        target.value = value.replaceRange(closestItem.index,
          closestItem.index + closestItem.value.length + 1,
          result);
      } catch(err) { }
    }
  } else if(event.code === 'Escape' && lastItem) { // Last action was canceled
    lastItem.target.value = lastItem.target.value.replaceRange(lastItem.index,
      lastItem.index + lastItem.result.toString().length + 1,
      lastItem.value);

    // Set focus back to the field because Esc reset focus to body page
    lastItem.target.focus();
    lastItem = null;
  } else {
    lastItem = null;
  }
}

chrome.storage.sync.get('disabled_sites', function(data) {
  if(data.disabled_sites.indexOf(window.location.hostname) === -1) {
    document.addEventListener('keyup', checkEvent);
  }
});

// Updating subscribtion status for `keyup` event
// if domain disabled or enabled for extension
chrome.storage.onChanged.addListener(function(changes) {
  if(changes.disabled_sites.newValue.indexOf(window.location.hostname) > -1) {
    document.removeEventListener('keyup', checkEvent);
  } else {
    document.addEventListener('keyup', checkEvent);
  }
});

var module = module || {};
module.exports = {
};
