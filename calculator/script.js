let display = document.getElementById('display');
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let memory = parseFloat(localStorage.getItem('calcMemory')) || 0;

// Update memory indicator
function updateMemoryIndicator() {
    const memoryStatus = document.getElementById('memoryStatus');
    if (memory !== 0) {
        memoryStatus.textContent = `M: ${memory.toFixed(2)}`;
    } else {
        memoryStatus.textContent = '';
    }
}

// Append to display
function appendToDisplay(value) {
    if (value === '√') {
        display.value += 'sqrt(';
    } else if (value === '^') {
        display.value += '**';
    } else if (value === 'π') {
        display.value += Math.PI.toString();
    } else if (value === 'e') {
        display.value += Math.E.toString();
    } else if (value === '!') {
        display.value += '!';
    } else {
        display.value += value;
    }
}

// Clear display
function clearDisplay() {
    display.value = '';
}

// Backspace
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Toggle sign
function toggleSign() {
    if (display.value) {
        if (display.value.startsWith('-')) {
            display.value = display.value.slice(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}

// Factorial function
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Calculate result
function calculateResult() {
    try {
        let expression = display.value;

        if (!expression) return;

        // Handle factorial
        expression = expression.replace(/(\d+)!/g, (match, num) => {
            return factorial(parseInt(num));
        });

        // Handle square root
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');

        // Handle trigonometric functions (convert to radians)
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');

        // Handle logarithm
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');

        // Evaluate
        let result = eval(expression);

        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;

        // Add to history
        const historyEntry = `${display.value} = ${result}`;
        history.unshift(historyEntry);
        if (history.length > 50) history.pop();
        localStorage.setItem('calcHistory', JSON.stringify(history));
        updateHistoryDisplay();

        display.value = result;
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => clearDisplay(), 1500);
    }
}

// Memory functions
function memoryClear() {
    memory = 0;
    localStorage.setItem('calcMemory', memory);
    updateMemoryIndicator();
    display.value = '0';
}

function memoryRecall() {
    if (memory !== 0) {
        display.value = memory;
    }
}

function memoryAdd() {
    try {
        if (display.value) {
            let result = eval(display.value);
            memory += result;
            localStorage.setItem('calcMemory', memory);
            updateMemoryIndicator();
            display.value = '';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

function memorySubtract() {
    try {
        if (display.value) {
            let result = eval(display.value);
            memory -= result;
            localStorage.setItem('calcMemory', memory);
            updateMemoryIndicator();
            display.value = '';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// History functions
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyItem.onclick = () => {
            const result = item.split(' = ')[1];
            display.value = result;
        };
        historyList.appendChild(historyItem);
    });
}

function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.classList.toggle('hidden');
    if (!historyPanel.classList.contains('hidden')) {
        updateHistoryDisplay();
    }
}

function clearHistory() {
    history = [];
    localStorage.setItem('calcHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        e.preventDefault();
        calculateResult();
    } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '(') {
        appendToDisplay('(');
    } else if (key === ')') {
        appendToDisplay(')');
    } else if (key === '%') {
        appendToDisplay('%');
    }
});

// Initialize
updateMemoryIndicator();
updateHistoryDisplay();