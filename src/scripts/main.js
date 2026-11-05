import Calculation from './calculation.js';
import { addHistory, loadHistory, removeHistory } from './history.js';

let btn = document.querySelectorAll('button');
let cal = document.querySelector('.calculation');
let res = document.querySelector('.result');
let alertDialog = document.querySelector('.alertDialog');
let alertMessage = document.querySelector('#invalidOperationMessage');

let historyDialog = document.querySelector('.historyDialog');
let historyList = document.querySelector('.historyList');

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
            if (calculation.addDigit(a)) {
                doOperation();
                updateHtml();
            } else {
                showAlert("Can't add more than 10 decimal places.");
            }
            break;
        case '.':
            calculation.addDecimalPoint();
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
                showAlert('Enter a number before choosing an operator.');
            }
            break;
        case '=': {
            const entry = calculation.evaluate();
            if (entry) {
                addHistory(entry.expression, entry.result);
                updateHtml();
                doOperation();
            }
            break;
        }
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

function renderHistory(history) {
    historyList.replaceChildren(...history.map((item) => {
        const li = document.createElement('li');
        const text = document.createElement('span');
        text.textContent = `${item.expression} = ${item.result}`;
        const del = document.createElement('button');
        del.type = 'button';
        del.textContent = 'Delete';
        del.setAttribute('aria-label', `Delete ${text.textContent}`);
        del.dataset.historyId = String(item.id);
        li.append(text, del);
        return li;
    }));
}

document.querySelector('.historyBtn').addEventListener('click', () => {
    renderHistory(loadHistory());
    historyDialog.showModal();
});

historyList.addEventListener('click', (e) => {
    const id = e.target.dataset?.historyId;
    if (id !== undefined) renderHistory(removeHistory(Number(id)));
});

function showAlert(message) {
    alertMessage.textContent = message;
    alertDialog.showModal();
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
    if (historyDialog.open || alertDialog.open) return;
    const key = e.key === 'Enter' ? '=' : e.key;
    let value = document.querySelector(`button[data-value="${key}"]`);
    if (!value) return;
    e.preventDefault();
    value.classList.add('btnStyle');
    putVal(key);
});
window.addEventListener('keyup', (e) => {
    let value = document.querySelector(`button[data-value="${e.key === 'Enter' ? '=' : e.key}"]`);
    value?.classList.remove('btnStyle');
});
window.addEventListener('blur', () => {
    keys.forEach((key) => key.classList.remove('btnStyle'));
});
