var buffer = '';
const mathRegexp = /([0-9]|[%-^]){3,}/g;

/**
 * Check if provided HTML element is valid input element
 * @param  {HTML element}  element
 * @return {Boolean}
 *
 * @example
 *   document.addEventListener('keypress', event => console.log(isInputElement(event.target)));
 */
function isInputElement(element) {
  const inputTags = ['INPUT', 'TEXTAREA'];

  if(inputTags.indexOf(element.tagName) !== -1) {
    return true;
  } else if(element.getAttribute('contenteditable')) {
    return true;
  }

  return false;
}


function findClosest(string, regexp, position) {
  let match, lastMatch;

  while ((match = regexp.exec(string)) !== null && match.index < position) {
    if (match.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }
    lastMatch = match;
  }

  return lastMatch;
}

/**
 * Matches regex occurrences in string
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
function findOccurrences(string, regexp) {
  let occurrences = {};
  let match;

  while ((match = regexp.exec(string)) !== null) {
    if (match.index === regexp.lastIndex) {
      regexp.lastIndex++;
    }

    occurrences[match.index] = match[0];
  }

  return occurrences;
}

function isNumberOrOperator(char) {
  return /[0-9]|[%-^]/.test(char);
}

function isReadyToReplace(string) {
  return string.length > 2; // TODO: Just dummy check for something like 2+2 should be replaced with something more complicated
}

function checkEvent(event) {
  let target = event.target;

  if(isInputElement(target) === false) {
    console.log('Not a input element, aborting');
    return;
  }

  if(isNumberOrOperator(event.key)) {
    buffer += event.key;
  } else {
    if(event.code === 'Space' && isReadyToReplace(buffer)) {
      let value = target.value + event.key;
      let closestItem = findClosest(value, mathRegexp, target.selectionStart);

      console.log(closestItem);
      if(closestItem) {
        let result = eval(closestItem[0]);
        target.value = value.substring(0, closestItem.index).concat(result).concat(value.substring(closestItem.index + closestItem[0].length + 1));
      }
    }
    buffer = '';
  }
}

document.addEventListener('keypress', checkEvent);
