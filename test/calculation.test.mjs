import assert from 'node:assert/strict';
import test from 'node:test';
import Calculation from '../src/scripts/calculation.js';

function calculate(expression) {
    const calculation = new Calculation();
    for (const character of expression) {
        if ('0123456789'.includes(character)) {
            calculation.addDigit(character);
        } else if (character === '.') {
            calculation.addDecimalPoint();
        } else {
            calculation.addOperator(character);
        }
    }
    return calculation.getResult();
}

test('formats a large entered integer exactly', () => {
    assert.equal(calculate('9999999999999999999999'), '9,99,99,99,99,99,99,99,99,99,999');
});

test('formats results using the Indian numbering system', () => {
    assert.equal(calculate('100000'), '1,00,000');
    assert.equal(calculate('12345678'), '1,23,45,678');
    assert.equal(calculate('0-100000'), '-1,00,000');
});

test('formats entered operands using the Indian numbering system', () => {
    const calculation = new Calculation();
    for (const character of '100000+12345678.90') {
        if ('0123456789'.includes(character)) calculation.addDigit(character);
        else if (character === '.') calculation.addDecimalPoint();
        else calculation.addOperator(character);
    }

    assert.equal(calculation.getExpression(), '1,00,000 + 1,23,45,678.90');
});

test('calculates large integer addition, subtraction, and multiplication exactly', () => {
    assert.equal(calculate('9999999999999999999999+1'), '10,00,00,00,00,00,00,00,00,00,000');
    assert.equal(calculate('10000000000000000000000-1'), '9,99,99,99,99,99,99,99,99,99,999');
    assert.equal(calculate('9999999999999999999999*2'), '19,99,99,99,99,99,99,99,99,99,998');
});

test('retains ordinary integer and division behavior', () => {
    assert.equal(calculate('12+3*4'), '60');
    assert.equal(calculate('1/3'), '0.3333333333');
});

test('calculates decimal expressions and ignores duplicate decimal points', () => {
    assert.equal(calculate('1.5+2.25'), '3.75');
    assert.equal(calculate('1.23456789016+0'), '1.2345678901');
    assert.equal(calculate('.5*2'), '1');
    assert.equal(calculate('1.2.3+1'), '2.23');
});

test('limits entered operands to ten decimal places', () => {
    const calculation = new Calculation();
    for (const digit of '1.1234567890') {
        if (digit === '.') calculation.addDecimalPoint();
        else calculation.addDigit(digit);
    }

    assert.equal(calculation.addDigit('1'), false);
    assert.equal(calculation.getExpression(), '1.1234567890');
    assert.equal(calculation.getResult(), '1.123456789');
});

test('evaluate returns history entry and keeps result as operand', () => {
    const calculation = new Calculation();
    '12+30'.split('').forEach((c) => (/\d/.test(c) ? calculation.addDigit(c) : calculation.addOperator(c)));
    assert.deepEqual(calculation.evaluate(), { expression: '12 + 30', result: '42' });
    assert.equal(calculation.getExpression(), '42');
    assert.equal(calculation.evaluate(), null);
});
