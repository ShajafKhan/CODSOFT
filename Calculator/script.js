var display = document.getElementById('display');
var buttons = document.querySelectorAll('.buttons button');

if (!display) {
  console.error('Calculator display not found!');
  alert('Error: Calculator display not found!');
}

if (buttons.length === 0) {
  console.error('No calculator buttons found!');
  alert('Error: No calculator buttons found!');
}

var operators = ['+', '-', '*', '/'];
var displaySymbols = { '*': '×', '/': '÷', '-': '−', '+': '+' };

var currentExpression = '';
var displayValue = '';

console.log('Advanced calculator loaded!');
console.log('Found buttons:', buttons.length);

function updateDisplay() {
  console.log('Updating display with:', displayValue);
  if (display) {
    display.value = displayValue;
  }
}

function addValue(value) {
  console.log('Adding value:', value);

  var lastCharacter = '';
  if (currentExpression.length > 0) {
    lastCharacter = currentExpression[currentExpression.length - 1];
  }

  console.log('Last character:', lastCharacter);

  var isOperator = false;
  for (var i = 0; i < operators.length; i++) {
    if (value === operators[i]) {
      isOperator = true;
      break;
    }
  }

  if (isOperator) {
    console.log('Value is an operator');

    var lastIsOperator = false;
    for (var j = 0; j < operators.length; j++) {
      if (lastCharacter === operators[j]) {
        lastIsOperator = true;
        break;
      }
    }

    if (lastIsOperator) {
      console.log('Cannot add two operators in a row');
      return;
    }
  } else if (value === '.') {
    console.log('Adding decimal point');

    var parts = currentExpression.split(/[\+\-\*\/]/);
    var currentNumber = parts[parts.length - 1];

    console.log('Current number part:', currentNumber);

    if (currentNumber.indexOf('.') !== -1) {
      console.log('Number already has decimal');
      return;
    }

    if (currentNumber === '') {
      console.log('Adding 0 before decimal');
      currentExpression += '0';
      displayValue += '0';
    }
  } else {
    console.log('Adding digit:', value);
  }

  currentExpression += value;

  var symbolToShow = value;
  if (displaySymbols[value]) {
    symbolToShow = displaySymbols[value];
  }

  displayValue += symbolToShow;

  console.log('Current expression:', currentExpression);
  console.log('Display value:', displayValue);

  updateDisplay();
}

function clearCalculator() {
  console.log('Clearing calculator');
  currentExpression = '';
  displayValue = '';
  updateDisplay();
}

function deleteLastCharacter() {
  console.log('Deleting last character');

  if (currentExpression.length === 0) {
    console.log('Nothing to delete');
    return;
  }

  var newExpression = '';
  for (var i = 0; i < currentExpression.length - 1; i++) {
    newExpression += currentExpression[i];
  }
  currentExpression = newExpression;

  var newDisplay = '';
  for (var j = 0; j < displayValue.length - 1; j++) {
    newDisplay += displayValue[j];
  }
  displayValue = newDisplay;

  console.log('New expression:', currentExpression);
  console.log('New display:', displayValue);

  updateDisplay();
}

function calculateResult() {
  console.log('Calculating result');

  if (currentExpression.length === 0) {
    console.log('Nothing to calculate');
    return;
  }

  var lastChar = currentExpression[currentExpression.length - 1];
  var endsWithOperator = false;

  for (var i = 0; i < operators.length; i++) {
    if (lastChar === operators[i]) {
      endsWithOperator = true;
      break;
    }
  }

  if (endsWithOperator) {
    console.log('Removing trailing operator');
    var cleanExpression = '';
    for (var j = 0; j < currentExpression.length - 1; j++) {
      cleanExpression += currentExpression[j];
    }
    currentExpression = cleanExpression;

    var cleanDisplay = '';
    for (var k = 0; k < displayValue.length - 1; k++) {
      cleanDisplay += displayValue[k];
    }
    displayValue = cleanDisplay;
  }

  console.log('Expression to calculate:', currentExpression);

  try {
    var result = eval(currentExpression);
    console.log('Calculation result:', result);

    if (isFinite(result) && !isNaN(result)) {
      currentExpression = result.toString();
      displayValue = currentExpression;
      console.log('Calculation successful');
    } else {
      console.log('Invalid result');
      currentExpression = '';
      displayValue = 'Error';
    }
  } catch (error) {
    console.log('Calculation error:', error);
    currentExpression = '';
    displayValue = 'Error';
  }

  updateDisplay();
}

for (var i = 0; i < buttons.length; i++) {
  var button = buttons[i];
  console.log('Adding listener to button:', button.textContent);

  var buttonType = button.getAttribute('data-type');

  if (buttonType === 'digit') {
    console.log('Digit button found:', button.getAttribute('data-value'));
    button.addEventListener('click', function () {
      var digitValue = this.getAttribute('data-value');
      console.log('Digit button clicked:', digitValue);
      addValue(digitValue);
    });
  } else if (buttonType === 'operator') {
    console.log('Operator button found:', button.getAttribute('data-value'));
    button.addEventListener('click', function () {
      var operatorValue = this.getAttribute('data-value');
      console.log('Operator button clicked:', operatorValue);
      addValue(operatorValue);
    });
  } else if (buttonType === 'action') {
    var actionType = button.getAttribute('data-action');
    console.log('Action button found:', actionType);

    if (actionType === 'clear') {
      button.addEventListener('click', function () {
        console.log('Clear button clicked');
        clearCalculator();
      });
    } else if (actionType === 'del') {
      button.addEventListener('click', function () {
        console.log('Delete button clicked');
        deleteLastCharacter();
      });
    } else if (actionType === 'equals') {
      button.addEventListener('click', function () {
        console.log('Equals button clicked');
        calculateResult();
      });
    }
  }
}

document.addEventListener('keydown', function (event) {
  var key = event.key;
  console.log('Key pressed:', key);

  if (key >= '0' && key <= '9') {
    console.log('Number key pressed');
    addValue(key);
    event.preventDefault();
  } else if (key === '+') {
    console.log('Plus key pressed');
    addValue('+');
    event.preventDefault();
  } else if (key === '-') {
    console.log('Minus key pressed');
    addValue('-');
    event.preventDefault();
  } else if (key === '*') {
    console.log('Multiply key pressed');
    addValue('*');
    event.preventDefault();
  } else if (key === '/') {
    console.log('Divide key pressed');
    addValue('/');
    event.preventDefault();
  } else if (key === '.') {
    console.log('Decimal key pressed');
    addValue('.');
    event.preventDefault();
  } else if (key === 'Enter' || key === '=') {
    console.log('Enter/Equals key pressed');
    calculateResult();
    event.preventDefault();
  } else if (key === 'Backspace') {
    console.log('Backspace key pressed');
    deleteLastCharacter();
    event.preventDefault();
  } else if (key === 'Escape') {
    console.log('Escape key pressed');
    clearCalculator();
    event.preventDefault();
  } else {
    console.log('Unhandled key:', key);
  }
});

console.log('All event listeners added successfully!');
console.log('Advanced calculator is ready to use!'); 