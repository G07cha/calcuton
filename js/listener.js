var buffer = '';
var lastItem;
var mathRegexp = /([0-9]|\*|\/|\+|-|\.|\(|\)){3,}/g;

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

function findClosest(string, regexp, position) {
  var match, lastMatch;

  while ((match = regexp.exec(string)) !== null && match.index < position) {
    if (match.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }
    lastMatch = match;
  }

  return lastMatch;
}

function isNumberOrOperator(char) {
  return '0123456789-+*/.()'.indexOf(char) > -1;
}

function isReadyToReplace(string) {
  return string.length > 2; // TODO: Just dummy check for something like 2+2 should be replaced with something more complicated
}

function checkEvent(event) {
  var target = event.target;

  if(event.key === 'Shift') {
    return;
  }

  if(isNumberOrOperator(event.key)) {
    buffer += event.key;
  } else {
    if(event.code === 'Space' && isReadyToReplace(buffer)) {
      var value = target.value + event.key;
      var closestItem = findClosest(value, mathRegexp, target.selectionStart);

      if(closestItem) {
        try {
          var result = eval(closestItem[0]);

          lastItem = closestItem;
          lastItem.target = target;
          lastItem.result = result;

          target.value = value.replaceRange(closestItem.index,
            closestItem.index + closestItem[0].length + 1,
            result);
        } catch(err) { }
      }
    } else if(event.code === 'Escape' && lastItem.length) { // Last action was canceled
      lastItem.target.value = lastItem.target.value.replaceRange(lastItem.index,
        lastItem.index + lastItem.result.toString().length + 1,
        lastItem[0]);

      // Set focus back to the field because Esc reset focus to body page
      lastItem.target.focus();
      lastItem = null;
    } else {
      lastItem = null;
    }

    buffer = '';
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
  findClosest: findClosest
};
