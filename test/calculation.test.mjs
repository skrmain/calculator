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

test('preserves a large entered integer exactly', () => {
    assert.equal(calculate('9999999999999999999999'), '9999999999999999999999');
});

test('calculates large integer addition, subtraction, and multiplication exactly', () => {
    assert.equal(calculate('9999999999999999999999+1'), '10000000000000000000000');
    assert.equal(calculate('10000000000000000000000-1'), '9999999999999999999999');
    assert.equal(calculate('9999999999999999999999*2'), '19999999999999999999998');
});

test('retains ordinary integer and division behavior', () => {
    assert.equal(calculate('12+3*4'), '60');
    assert.equal(calculate('1/3'), '0.3333333333');
});

test('calculates decimal expressions and ignores duplicate decimal points', () => {
    assert.equal(calculate('1.5+2.25'), '3.75');
    assert.equal(calculate('1.23456789016+0'), '1.2345678902');
    assert.equal(calculate('.5*2'), '1');
    assert.equal(calculate('1.2.3+1'), '2.23');
});
