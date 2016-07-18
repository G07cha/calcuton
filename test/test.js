const assert = require('assert');
const listener = require('../js/listener');

describe('String replaceRange method', function() {
  it('should be presented in strings', function() {
    assert.equal(typeof ''.replaceRange, 'function');
  });

  it('should not be presented as static function', function() {
    assert.equal(typeof String.replaceRange, 'undefined');
  });

  const tests = [
    { string: 'test', start: 0, end: 1, replacement: 'a', expected: 'aest' }, // Replace at start of the string
    { string: 'test', start: 2, end: 3, replacement: 'test', expected: 'tetestt' }, // At middle
    { string: 'test', start: 3, end: 4, replacement: 'hey', expected: 'teshey' } // At the end
  ];

  tests.forEach(function(test) {
    it('Replaces ' + test.string + ' to ' + test.expected, function() {
      var result = test.string.replaceRange(test.start, test.end, test.replacement);

      assert.equal(result, test.expected);
    });
  });
});

describe('getNearestExpression', function() {
  const tests = [
    { string: '1+1', position: 5, expected: { value: '1+1', index: 0 }},
    { string: 'foo', position: 5, expected: null},
    { string: 'foo 2+3', position: 11, expected: { value: '2+3', index: 4 }}
  ];

  tests.forEach(function(test, index) {
    it('Generated test #' + index, function() {
      var result = listener.getNearestExpression(test.string, test.position);

      assert.deepEqual(result, test.expected);
    });
  });
});

describe('isReadyToReplace', function() {
  it('should return true for number', function() {
    assert.equal(listener.isReadyToReplace({ value: '1', selectionStart: 2}), true);
    assert.equal(listener.isReadyToReplace({ value: '1+2', selectionStart: 4}), true);
  });

  it('should return false for non-number', function() {
    assert.equal(listener.isReadyToReplace({ value: '+', selectionStart: 2}), false);
    assert.equal(listener.isReadyToReplace({ value: 'a', selectionStart: 2}), false);
  });

  it('should return false for undefined', function() {
    assert.equal(listener.isReadyToReplace({ value: '', selectionStart: 0}), false);
  });
});
