/* jslint evil: true */

var lastItem;

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

/**
 * Find math expression right next to position in string
 * @param  {String} string
 * @param  {Number} position
 * @return {Object}           If expression valid will return object with `value`
 * and `index` properties where value is expression itself and `index` is start
 * position of expression elsewise will return `null`
 */
function getNearestExpression(string, position) {
  var mathRegexp = /^([0-9]|\*|\/|\+|-|\.|\(|\)){3,}$/;
  var expressionStart = string.lastIndexOf(' ', position - 2) + 1;
  var expression = string.substring(expressionStart, position - 1);

  if(mathRegexp.test(expression)) {
    return {
      value: expression,
      index: expressionStart
    };
  } else {
    return null;
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

var module = module || {};
module.exports = {
  getNearestExpression: getNearestExpression,
  isReadyToReplace: isReadyToReplace
};
