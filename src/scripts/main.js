import Calculation from './calculation.js';

let btn = document.querySelectorAll('button');
let cal = document.querySelector('.calculation');
let res = document.querySelector('.result');
let alertDialog = document.querySelector('.alertDialog');

let calculation = new Calculation();

for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', (e) => {
        if (e.target.getAttribute('data-value') !== '')
            putVal(e.target.getAttribute('data-value'))
    })
}

function putVal(a) {
    switch (a) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            calculation.addDigit(a);
            doOperation();
            updateHtml();
            break;
        case '+':
        case '*':
        case '/':
        case '-':
            if (calculation.addOperator(a)) {
                res.textContent = '';
                updateHtml();
            } else {
                alertDialog.showModal();
            }
            break;
        case 'Backspace':
            calculation.backspace();
            doOperation();
            updateHtml();
            break;
        case 'clearAll':
            calculation.clear();
            doOperation();
            updateHtml();
            break;
    }
}

function updateHtml() {
    cal.textContent = calculation.getExpression();
    cal.scrollLeft = cal.scrollWidth;
}

function doOperation() {
    res.textContent = calculation.getResult();
    res.scrollLeft = res.scrollWidth;
}

const keys = Array.from(document.querySelectorAll('button'));
window.addEventListener('keydown', (e) => {
    let value = document.querySelector(`button[data-value="${e.key}"]`);
    if (!value) return;
    value.classList.add('btnStyle');
    putVal(e.key);
});
window.addEventListener('keyup', (e) => {
    let value = document.querySelector(`button[data-value="${e.key}"]`);
    value?.classList.remove('btnStyle');
});
window.addEventListener('blur', () => {
    keys.forEach((key) => key.classList.remove('btnStyle'));
});
