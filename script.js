(() => {
  const expressionDisplay = document.getElementById('expression');
  const resultDisplay = document.getElementById('result');
  const clearBtn = document.getElementById('clear');
  
  let currentValue = '0';
  let previousValue = null;
  let operator = null;
  let waitingForOperand = false;
  let lastAction = null;

  const formatNumber = num => {
    if (num === 'Error') return num;
    const n = parseFloat(num);
    if (isNaN(n)) return '0';
    
    // Handle scientific notation for very large or small numbers
    const str = n.toString();
    if (str.length > 9) {
      if (Math.abs(n) < 1e-6 || Math.abs(n) > 1e9) {
        return n.toExponential(5);
      }
      return parseFloat(n.toPrecision(9)).toString();
    }
    return str;
  };

  const updateDisplay = () => {
    resultDisplay.textContent = formatNumber(currentValue);
    
    // Show expression
    if (previousValue !== null && operator) {
      const opSymbol = {'+': '+', '-': '−', '*': '×', '/': '÷'}[operator] || operator;
      expressionDisplay.textContent = `${formatNumber(previousValue)} ${opSymbol}`;
    } else {
      expressionDisplay.textContent = '';
    }
    
    // Update clear button - AC when starting fresh, C when there's input
    clearBtn.textContent = (currentValue === '0' && previousValue === null) ? 'AC' : 'C';
  };

  const clearAll = () => {
    currentValue = '0';
    previousValue = null;
    operator = null;
    waitingForOperand = false;
    document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    updateDisplay();
  };

  const inputDigit = digit => {
    if (waitingForOperand) {
      currentValue = String(digit);
      waitingForOperand = false;
    } else {
      if (currentValue === '0') {
        currentValue = String(digit);
      } else {
        if (currentValue.length < 9) {
          currentValue += String(digit);
        }
      }
    }
    lastAction = 'digit';
    updateDisplay();
  };

  const inputDot = () => {
    if (waitingForOperand) {
      currentValue = '0.';
      waitingForOperand = false;
    } else if (currentValue.indexOf('.') === -1) {
      currentValue += '.';
    }
    lastAction = 'digit';
    updateDisplay();
  };

  const performOperation = nextOp => {
    const inputValue = parseFloat(currentValue);

    if (previousValue === null) {
      previousValue = inputValue;
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      currentValue = String(result);
      previousValue = result;
    }

    waitingForOperand = true;
    operator = nextOp;
    lastAction = 'operator';
    
    // Highlight active operator
    document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    if (nextOp !== '=') {
      const activeBtn = document.querySelector(`[data-action="${nextOp}"]`);
      if (activeBtn) activeBtn.classList.add('active');
    }
    
    updateDisplay();
  };

  const calculate = (first, second, op) => {
    let result;
    switch (op) {
      case '+': result = first + second; break;
      case '-': result = first - second; break;
      case '*': result = first * second; break;
      case '/': 
        if (second === 0) return 'Error';
        result = first / second; 
        break;
      default: return second;
    }
    
    if (!isFinite(result)) return 'Error';
    return result;
  };

  const computeEquals = () => {
    const inputValue = parseFloat(currentValue);
    
    if (operator && previousValue !== null) {
      currentValue = String(calculate(previousValue, inputValue, operator));
      expressionDisplay.textContent = '';
      previousValue = null;
      operator = null;
      waitingForOperand = true;
      
      document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    }
    
    lastAction = 'equals';
    updateDisplay();
  };

  const toggleSign = () => {
    currentValue = String(parseFloat(currentValue) * -1);
    updateDisplay();
  };

  const percent = () => {
    const value = parseFloat(currentValue);
    if (previousValue !== null && operator) {
      // Context-aware percentage (like iOS calculator)
      if (operator === '+' || operator === '-') {
        currentValue = String((previousValue * value) / 100);
      } else {
        currentValue = String(value / 100);
      }
    } else {
      currentValue = String(value / 100);
    }
    updateDisplay();
  };

  // Event listeners for number buttons
  document.querySelectorAll('.number').forEach(btn => {
    btn.addEventListener('click', e => {
      const num = e.target.dataset.number;
      if (num === '.') {
        inputDot();
      } else {
        inputDigit(num);
      }
    });
  });

  // Event listeners for operator buttons
  document.querySelectorAll('.operator').forEach(btn => {
    btn.addEventListener('click', e => {
      performOperation(e.target.dataset.action);
    });
  });

  // Event listeners for special buttons
  document.querySelector('.equals').addEventListener('click', computeEquals);
  clearBtn.addEventListener('click', clearAll);
  document.querySelector('[data-action="sign"]').addEventListener('click', toggleSign);
  document.querySelector('[data-action="percent"]').addEventListener('click', percent);

  // Keyboard support
  window.addEventListener('keydown', e => {
    if ('0123456789'.includes(e.key)) {
      inputDigit(e.key);
    }
    if (e.key === '.') {
      inputDot();
    }
    if ('+-*/'.includes(e.key)) {
      e.preventDefault();
      performOperation(e.key);
    }
    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      computeEquals();
    }
    if (e.key === 'Backspace') {
      if (currentValue.length > 1 && currentValue !== '0') {
        currentValue = currentValue.slice(0, -1);
      } else {
        currentValue = '0';
      }
      updateDisplay();
    }
    if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      clearAll();
    }
    if (e.key === '%') {
      percent();
    }
  });

  // Initialize display
  updateDisplay();
})();


