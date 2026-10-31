export default class Calculation {
    constructor() {
        this.operands = [''];
        this.operators = [];
        this.partialResults = [];
    }

    addDigit(digit) {
        const lastOperand = this.operands.length - 1;
        this.operands[lastOperand] += digit;
    }

    addOperator(operator) {
        const lastOperand = this.operands.length - 1;
        if (!this.operands[lastOperand]) return false;

        this.partialResults.push(this.calculateCurrentResult());
        this.operators.push(operator);
        this.operands.push('');
        return true;
    }

    backspace() {
        const lastOperand = this.operands.length - 1;
        if (this.operands[lastOperand]) {
            this.operands[lastOperand] = this.operands[lastOperand].slice(0, -1);
        } else if (this.operators.length) {
            this.operators.pop();
            this.operands.pop();
            this.partialResults.pop();
        }
    }

    clear() {
        this.operands = [''];
        this.operators = [];
        this.partialResults = [];
    }

    getExpression() {
        return this.operands
            .map((operand, index) => (
                index < this.operators.length ? `${operand} ${this.operators[index]}` : operand
            ))
            .join(' ');
    }

    getResult() {
        if (!this.operands[0] || !this.operands[this.operands.length - 1]) return '';

        const result = this.calculateCurrentResult();

        return Number.isFinite(result)
            ? result.toLocaleString('en-US', { useGrouping: false, maximumSignificantDigits: 21 })
            : String(result);
    }

    calculateCurrentResult() {
        if (this.operators.includes('/')) {
            let result = Number(this.operands[0]);
            for (let i = 0; i < this.operators.length; i++) {
                const operand = Number(this.operands[i + 1]);
                switch (this.operators[i]) {
                    case '+':
                        result += operand;
                        break;
                    case '-':
                        result -= operand;
                        break;
                    case '*':
                        result *= operand;
                        break;
                    case '/':
                        result /= operand;
                        break;
                }
            }

            return result;
        }

        const lastOperator = this.operators.length - 1;
        if (lastOperator < 0) return BigInt(this.operands[0]);

        const result = this.partialResults[lastOperator];
        const operand = BigInt(this.operands[lastOperator + 1]);
        switch (this.operators[lastOperator]) {
            case '+':
                return result + operand;
            case '-':
                return result - operand;
            case '*':
                return result * operand;
            case '/':
                return result / operand;
        }
    }
}
