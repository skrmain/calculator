export default class Calculation {
    constructor() {
        this.operands = [''];
        this.operators = [];
        this.partialResults = [];
    }

    addDigit(digit) {
        const lastOperand = this.operands.length - 1;
        const decimalPoint = this.operands[lastOperand].indexOf('.');
        if (decimalPoint !== -1 && this.operands[lastOperand].length - decimalPoint - 1 >= 10) return false;

        this.operands[lastOperand] += digit;
        return true;
    }

    addDecimalPoint() {
        const lastOperand = this.operands.length - 1;
        if (this.operands[lastOperand].includes('.')) return;

        this.operands[lastOperand] += this.operands[lastOperand] ? '.' : '0.';
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
                index < this.operators.length
                    ? `${this.formatOperand(operand)} ${this.operators[index]}`
                    : this.formatOperand(operand)
            ))
            .join(' ');
    }

    getResult() {
        if (!this.operands[0] || !this.operands[this.operands.length - 1]) return '';

        const result = this.calculateCurrentResult();

        if (typeof result === 'bigint') return result.toLocaleString('en-IN');

        return Number.isFinite(result)
            ? result.toLocaleString('en-IN', { useGrouping: true, maximumFractionDigits: 10 })
            : String(result);
    }

    evaluate() {
        if (!this.operators.length || !this.operands[this.operands.length - 1]) return null;

        const expression = this.getExpression();
        let result;
        try {
            result = this.calculateCurrentResult();
        } catch {
            return null;
        }
        if (typeof result !== 'bigint' && !Number.isFinite(result)) return null;

        const entry = { expression, result: this.getResult() };
        const raw = typeof result === 'bigint'
            ? result.toString()
            : result.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 10 });
        this.operands = [raw];
        this.operators = [];
        this.partialResults = [];
        return entry;
    }

    formatOperand(operand) {
        const decimalPoint = operand.indexOf('.');
        const integer = decimalPoint === -1 ? operand : operand.slice(0, decimalPoint);
        const fraction = decimalPoint === -1 ? '' : operand.slice(decimalPoint);

        if (integer.length <= 3) return operand;

        const prefix = integer.slice(0, -3).replace(/\B(?=(\d{2})+$)/g, ',');
        return `${prefix},${integer.slice(-3)}${fraction}`;
    }

    calculateCurrentResult() {
        if (this.operators.includes('/') || this.operands.some((operand) => operand.includes('.'))) {
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
