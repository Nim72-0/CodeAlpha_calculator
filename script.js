// ============================================================
// CALCPRO - CALCULATOR APPLICATION
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // DOM REFERENCES
    // ============================================================
    const display = document.getElementById('display');
    const historyDisplay = document.getElementById('history');
    let shouldResetDisplay = false;

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================
    function adjustFontSize() {
        const length = display.value.length;
        if (length > 12) {
            display.classList.add('long-text');
        } else {
            display.classList.remove('long-text');
        }
    }

    function updateDisplay(value) {
        display.value = value;
        adjustFontSize();
        
        // Subtle animation
        display.style.transform = 'scale(1.02)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
        }, 150);
    }

    function animateBorder(color, duration = 400) {
        const wrapper = document.querySelector('.display-wrapper');
        wrapper.style.borderColor = color;
        setTimeout(() => {
            wrapper.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }, duration);
    }

    // ============================================================
    // CORE FUNCTIONS
    // ============================================================
    function appendValue(value) {
        // Handle initial zero state
        if (display.value === "0" && value !== '.' && !isNaN(value)) {
            display.value = value;
            adjustFontSize();
            return;
        }

        // Reset after calculation
        if (shouldResetDisplay) {
            if (!isNaN(value) || value === '.') {
                display.value = value;
                shouldResetDisplay = false;
                adjustFontSize();
                return;
            }
            shouldResetDisplay = false;
        }

        // Prevent multiple operators
        const lastChar = display.value.slice(-1);
        const operators = ['+', '-', '*', '/', '%', '.'];
        
        if (operators.includes(value) && operators.includes(lastChar)) {
            display.value = display.value.slice(0, -1) + value;
        } else {
            // Limit input length to prevent overflow
            if (display.value.length < 20 || isNaN(value)) {
                display.value += value;
            }
        }
        
        adjustFontSize();
    }

    function clearDisplay() {
        display.value = "0";
        historyDisplay.textContent = "";
        shouldResetDisplay = false;
        adjustFontSize();
        animateBorder('rgba(255, 149, 0, 0.5)', 300);
    }

    function deleteLast() {
        if (display.value.length === 1 || display.value === "Error" || display.value === "Infinity") {
            display.value = "0";
        } else {
            display.value = display.value.slice(0, -1);
        }
        adjustFontSize();
    }

    function calculate() {
        try {
            let expression = display.value;
            
            // Show calculation in history
            historyDisplay.textContent = expression + " =";
            
            // Replace display symbols with actual operators for evaluation
            let formattedExpr = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/%/g, '/100');
            
            // Safe evaluation using Function constructor
            let result = Function(`'use strict'; return (${formattedExpr})`)();
            
            // Handle invalid results
            if (!isFinite(result)) {
                display.value = "Error";
                shouldResetDisplay = true;
                adjustFontSize();
                animateBorder('rgba(220, 53, 69, 0.5)', 600);
                return;
            }
            
            // Format result
            if (Number.isInteger(result)) {
                display.value = result.toString();
            } else {
                // Remove trailing zeros and limit decimal places
                display.value = parseFloat(result.toFixed(10)).toString();
            }
            
            shouldResetDisplay = true;
            adjustFontSize();
            animateBorder('rgba(40, 167, 69, 0.5)', 400);

        } catch (err) {
            display.value = "Error";
            shouldResetDisplay = true;
            adjustFontSize();
            animateBorder('rgba(220, 53, 69, 0.5)', 600);
        }
    }

    // ============================================================
    // KEYBOARD SUPPORT
    // ============================================================
    document.addEventListener("keydown", function(event) {
        const key = event.key;
        
        // Map keyboard operators to display operators
        const keyMap = {
            '*': '×',
            '/': '÷',
            '-': '−'
        };

        // Prevent default for calculator keys
        const calculatorKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%','Enter','=','Backspace','Escape','Delete'];
        
        if (!calculatorKeys.includes(key) && !key.startsWith('Arrow')) {
            return;
        }

        if (!isNaN(key) || key === '.') {
            event.preventDefault();
            appendValue(key);
        } else if (key in keyMap) {
            event.preventDefault();
            appendValue(keyMap[key]);
        } else if (key === '+' || key === '%') {
            event.preventDefault();
            appendValue(key);
        } else if (key === "Enter" || key === "=") {
            event.preventDefault();
            calculate();
        } else if (key === "Backspace") {
            event.preventDefault();
            deleteLast();
        } else if (key === "Escape" || key === "Delete") {
            event.preventDefault();
            clearDisplay();
        }
    });

    // ============================================================
    // BUTTON ANIMATIONS
    // ============================================================
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.94)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });

        // Touch support
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.94)';
        }, { passive: true });

        button.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });

    // ============================================================
    // EXPOSE FUNCTIONS TO WINDOW
    // ============================================================
    window.appendValue = appendValue;
    window.clearDisplay = clearDisplay;
    window.deleteLast = deleteLast;
    window.calculate = calculate;

    // ============================================================
    // INITIALIZE
    // ============================================================
    console.log('🧮 CalcPro Calculator Loaded!');
    console.log('⌨️ Keyboard shortcuts:');
    console.log('  Numbers (0-9), . (decimal)');
    console.log('  + - * / % (operators)');
    console.log('  Enter/= (calculate)');
    console.log('  Backspace (delete last)');
    console.log('  Escape/Delete (clear all)');

})();