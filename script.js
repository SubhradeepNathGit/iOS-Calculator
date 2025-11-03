(() => {
  const expressionDisplay = document.getElementById('expression');
  const resultDisplay = document.getElementById('result');
  const clearBtn = document.getElementById('clear');
  
  let currentValue = '0';
  let previousValue = null;
  let operator = null;
  let waitingForOperand = false;
  let isError = false;

  // Maximum digits to allow during input (like iOS calculator)
  const MAX_INPUT_LENGTH = 9;

  /**
   * Format number for display - only format when not actively typing
   */
  const formatNumber = (num, isTyping = false) => {
    if (num === 'Error') return num;
    
    // If typing, show raw input
    if (isTyping) {
      return num;
    }
    
    const n = parseFloat(num);
    if (isNaN(n)) return '0';
    
    // Handle very large or very small numbers with scientific notation
    if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) {
      return n.toExponential(5);
    }
    
    // For normal numbers, limit precision
    const str = n.toString();
    if (str.length > MAX_INPUT_LENGTH) {
      // Try to fit within display by reducing precision
      const fixed = n.toFixed(Math.max(0, MAX_INPUT_LENGTH - Math.floor(Math.abs(n)).toString().length - 1));
      return parseFloat(fixed).toString();
    }
    
    return str;
  };

  /**
   * Update the calculator display
   */
  const updateDisplay = () => {
    // Show current value (preserve input format when typing)
    const isTyping = !waitingForOperand && !isError;
    resultDisplay.textContent = isError ? 'Error' : formatNumber(currentValue, isTyping);
    
    // Add error styling
    if (isError) {
      resultDisplay.classList.add('error');
    } else {
      resultDisplay.classList.remove('error');
    }
    
    // Dynamic font sizing based on number length
    const displayLength = resultDisplay.textContent.length;
    if (displayLength > 9) {
      resultDisplay.style.fontSize = '3rem';
    } else if (displayLength > 7) {
      resultDisplay.style.fontSize = '3.5rem';
    } else {
      resultDisplay.style.fontSize = '4rem';
    }
    
    // Show expression (previous value and operator)
    if (previousValue !== null && operator && !isError) {
      const opSymbol = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
      }[operator] || operator;
      expressionDisplay.textContent = `${formatNumber(previousValue)} ${opSymbol}`;
    } else {
      expressionDisplay.textContent = '';
    }
    
    // Update clear button - AC when calculator is clear, C when there's input
    clearBtn.textContent = (currentValue === '0' && previousValue === null) ? 'AC' : 'C';
  };

  /**
   * Clear all values and reset calculator
   */
  const clearAll = () => {
    currentValue = '0';
    previousValue = null;
    operator = null;
    waitingForOperand = false;
    isError = false;
    document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    updateDisplay();
  };

  /**
   * Input a single digit
   */
  const inputDigit = digit => {
    // Clear error state when new input starts
    if (isError) {
      clearAll();
    }
    
    if (waitingForOperand) {
      currentValue = String(digit);
      waitingForOperand = false;
    } else {
      // Handle leading zero replacement
      if (currentValue === '0') {
        currentValue = String(digit);
      } else {
        // Check length limit (excluding decimal point)
        const digitsOnly = currentValue.replace('.', '');
        if (digitsOnly.length < MAX_INPUT_LENGTH) {
          currentValue += String(digit);
        }
      }
    }
    updateDisplay();
  };

  /**
   * Input decimal point
   */
  const inputDot = () => {
    // Clear error state when new input starts
    if (isError) {
      clearAll();
    }
    
    if (waitingForOperand) {
      currentValue = '0.';
      waitingForOperand = false;
    } else if (currentValue.indexOf('.') === -1) {
      // Only add decimal if there isn't one already
      currentValue += '.';
    }
    updateDisplay();
  };

  /**
   * Perform calculation
   */
  const calculate = (first, second, op) => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        if (second === 0) {
          return null; // Return null for division by zero
        }
        return first / second;
      default:
        return second;
    }
  };

  /**
   * Handle operator button press
   */
  const performOperation = nextOp => {
    const inputValue = parseFloat(currentValue);
    
    // If in error state, only allow clear
    if (isError) {
      return;
    }

    if (previousValue === null) {
      // First operation - store the value
      previousValue = inputValue;
    } else if (operator && !waitingForOperand) {
      // Chain calculations - compute the previous operation
      const result = calculate(previousValue, inputValue, operator);
      
      if (result === null || !isFinite(result)) {
        // Handle error
        isError = true;
        currentValue = 'Error';
        previousValue = null;
        operator = null;
        updateDisplay();
        return;
      }
      
      currentValue = String(result);
      previousValue = result;
    }

    waitingForOperand = true;
    operator = nextOp;
    
    // Highlight active operator
    document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    if (nextOp !== '=') {
      const activeBtn = document.querySelector(`[data-action="${nextOp}"]`);
      if (activeBtn) activeBtn.classList.add('active');
    }
    
    updateDisplay();
  };

  /**
   * Compute the result when equals is pressed
   */
  const computeEquals = () => {
    const inputValue = parseFloat(currentValue);
    
    // If in error state, only allow clear
    if (isError) {
      return;
    }
    
    if (operator && previousValue !== null && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operator);
      
      if (result === null || !isFinite(result)) {
        // Handle error
        isError = true;
        currentValue = 'Error';
        previousValue = null;
        operator = null;
      } else {
        currentValue = String(result);
        previousValue = null;
        operator = null;
        waitingForOperand = true;
      }
      
      expressionDisplay.textContent = '';
      document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    }
    
    updateDisplay();
  };

  /**
   * Toggle the sign of current value
   */
  const toggleSign = () => {
    if (isError) return;
    
    const value = parseFloat(currentValue);
    if (value !== 0) {
      currentValue = String(value * -1);
      updateDisplay();
    }
  };

  /**
   * Apply percentage
   */
  const percent = () => {
    if (isError) return;
    
    const value = parseFloat(currentValue);
    
    if (previousValue !== null && operator && !waitingForOperand) {
      // Context-aware percentage (like iOS calculator)
      // For addition/subtraction: calculate percentage of previous value
      // For multiplication/division: just divide by 100
      if (operator === '+' || operator === '-') {
        currentValue = String((previousValue * value) / 100);
      } else {
        currentValue = String(value / 100);
      }
    } else {
      // Simple percentage
      currentValue = String(value / 100);
    }
    
    updateDisplay();
  };

  /**
   * Handle backspace - delete last digit
   */
  const backspace = () => {
    if (isError) {
      clearAll();
      return;
    }
    
    if (!waitingForOperand && currentValue !== '0') {
      if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
        // Handle negative sign left alone
        if (currentValue === '-') {
          currentValue = '0';
        }
      } else {
        currentValue = '0';
      }
      updateDisplay();
    }
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
    // Prevent default for keys we handle
    if ('0123456789.+-*/'.includes(e.key) || e.key === 'Enter' || e.key === '=' || e.key === 'Escape') {
      e.preventDefault();
    }
    
    // Number input
    if ('0123456789'.includes(e.key)) {
      inputDigit(e.key);
    }
    
    // Decimal point
    if (e.key === '.') {
      inputDot();
    }
    
    // Operators
    if ('+-*/'.includes(e.key)) {
      performOperation(e.key);
    }
    
    // Equals
    if (e.key === 'Enter' || e.key === '=') {
      computeEquals();
    }
    
    // Backspace
    if (e.key === 'Backspace') {
      backspace();
    }
    
    // Clear
    if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      clearAll();
    }
    
    // Percent
    if (e.key === '%') {
      percent();
    }
  });

  // Prevent text selection on double-click
  document.querySelector('.calculator').addEventListener('mousedown', e => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  });

  // Initialize display
  updateDisplay();
})();
