export class ExpressionEvaluator {
    private static operators = {
      '+': { precedence: 1, associativity: 'Left' },
      '-': { precedence: 1, associativity: 'Left' },
      '*': { precedence: 2, associativity: 'Left' },
      '/': { precedence: 2, associativity: 'Left' },
    };
  
    // Method to evaluate the expression
    public static evaluate(expression: string): number {
      const outputQueue: (string | number)[] = [];
      const operatorStack: string[] = [];
      const tokens = this.tokenize(expression);
  
      tokens.forEach((token) => {
        if (this.isNumber(token)) {
          outputQueue.push(parseFloat(token));
        } else if (this.isOperator(token)) {
          while (
            operatorStack.length > 0 &&
            this.isOperator(operatorStack[operatorStack.length - 1]) &&
            (
              (this.operators[token].associativity === 'Left' &&
                this.operators[token].precedence <= this.operators[operatorStack[operatorStack.length - 1]].precedence) ||
              (this.operators[token].associativity === 'Right' &&
                this.operators[token].precedence < this.operators[operatorStack[operatorStack.length - 1]].precedence)
            )
          ) {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
        } else if (token === '(') {
          operatorStack.push(token);
        } else if (token === ')') {
          while (operatorStack[operatorStack.length - 1] !== '(') {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.pop();
        }
      });
  
      while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
      }
  
      return this.evaluateRPN(outputQueue);
    }
  
    // Tokenize the input string
    private static tokenize(expression: string): string[] {
      const regex = /\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g;
      return expression.match(regex) || [];
    }
  
    // Check if the token is a number
    private static isNumber(token: string): boolean {
      return !isNaN(parseFloat(token));
    }
  
    // Check if the token is an operator
    private static isOperator(token: string): boolean {
      return Object.keys(this.operators).includes(token);
    }
  
    // Evaluate the RPN expression
    private static evaluateRPN(rpn: (string | number)[]): number {
      const stack: number[] = [];
  
      rpn.forEach((token) => {
        if (typeof token === 'number') {
          stack.push(token);
        } else if (this.isOperator(token as string)) {
          const b = stack.pop();
          const a = stack.pop();
          switch (token) {
            case '+':
              stack.push((a as number) + (b as number));
              break;
            case '-':
              stack.push((a as number) - (b as number));
              break;
            case '*':
              stack.push((a as number) * (b as number));
              break;
            case '/':
              stack.push((a as number) / (b as number));
              break;
          }
        }
      });
  
      return stack.pop()!;
    }
  }
