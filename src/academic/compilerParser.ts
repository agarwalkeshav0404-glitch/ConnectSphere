/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Academic Module: Compiler Design Showcase
 * Lexer, AST and Recursive-Descent Parser for Activity Filter Expressions.
 * Supports: Identifiers, Strings, Numbers, Binary Operators (==, !=, <, <=, >, >=, &&, ||), Parentheses.
 */

import { Activity } from '../types';

export type TokenType =
  | 'IDENTIFIER'
  | 'STRING'
  | 'NUMBER'
  | 'EQUALS' // ==
  | 'NOT_EQUALS' // !=
  | 'LESS' // <
  | 'LESS_EQUALS' // <=
  | 'GREATER' // >
  | 'GREATER_EQUALS' // >=
  | 'AND' // &&
  | 'OR' // ||
  | 'LPAREN' // (
  | 'RPAREN' // )
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string | number;
  position: number;
}

export class Lexer {
  private input: string;
  private cursor = 0;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.cursor < this.input.length) {
      const ch = this.input[this.cursor];

      // Whitespace
      if (/\s/.test(ch)) {
        this.cursor++;
        continue;
      }

      // Parentheses
      if (ch === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position: this.cursor });
        this.cursor++;
        continue;
      }
      if (ch === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position: this.cursor });
        this.cursor++;
        continue;
      }

      // Operators
      if (ch === '&' && this.input[this.cursor + 1] === '&') {
        tokens.push({ type: 'AND', value: '&&', position: this.cursor });
        this.cursor += 2;
        continue;
      }
      if (ch === '|' && this.input[this.cursor + 1] === '|') {
        tokens.push({ type: 'OR', value: '||', position: this.cursor });
        this.cursor += 2;
        continue;
      }
      if (ch === '=' && this.input[this.cursor + 1] === '=') {
        tokens.push({ type: 'EQUALS', value: '==', position: this.cursor });
        this.cursor += 2;
        continue;
      }
      if (ch === '!' && this.input[this.cursor + 1] === '=') {
        tokens.push({ type: 'NOT_EQUALS', value: '!=', position: this.cursor });
        this.cursor += 2;
        continue;
      }
      if (ch === '<') {
        if (this.input[this.cursor + 1] === '=') {
          tokens.push({ type: 'LESS_EQUALS', value: '<=', position: this.cursor });
          this.cursor += 2;
        } else {
          tokens.push({ type: 'LESS', value: '<', position: this.cursor });
          this.cursor++;
        }
        continue;
      }
      if (ch === '>') {
        if (this.input[this.cursor + 1] === '=') {
          tokens.push({ type: 'GREATER_EQUALS', value: '>=', position: this.cursor });
          this.cursor += 2;
        } else {
          tokens.push({ type: 'GREATER', value: '>', position: this.cursor });
          this.cursor++;
        }
        continue;
      }

      // Strings (single or double quote)
      if (ch === '"' || ch === "'") {
        const quote = ch;
        const start = this.cursor;
        this.cursor++;
        let strVal = '';
        while (this.cursor < this.input.length && this.input[this.cursor] !== quote) {
          strVal += this.input[this.cursor];
          this.cursor++;
        }
        if (this.cursor >= this.input.length) {
          throw new Error(`Unterminated string starting at index ${start}`);
        }
        this.cursor++; // consume closing quote
        tokens.push({ type: 'STRING', value: strVal, position: start });
        continue;
      }

      // Numbers
      if (/\d/.test(ch)) {
        const start = this.cursor;
        let numStr = '';
        while (this.cursor < this.input.length && /[\d.]/.test(this.input[this.cursor])) {
          numStr += this.input[this.cursor];
          this.cursor++;
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr), position: start });
        continue;
      }

      // Identifiers (e.g., city, category, costAmount, participantLimit)
      if (/[a-zA-Z_]/.test(ch)) {
        const start = this.cursor;
        let ident = '';
        while (this.cursor < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.cursor])) {
          ident += this.input[this.cursor];
          this.cursor++;
        }
        tokens.push({ type: 'IDENTIFIER', value: ident, position: start });
        continue;
      }

      throw new Error(`Unexpected character '${ch}' at index ${this.cursor}`);
    }

    tokens.push({ type: 'EOF', value: 'EOF', position: this.cursor });
    return tokens;
  }
}

// AST Nodes
export type ASTNode =
  | { type: 'BinaryExpr'; operator: '&&' | '||' | '==' | '!=' | '<' | '<=' | '>' | '>='; left: ASTNode; right: ASTNode }
  | { type: 'Identifier'; name: string }
  | { type: 'Literal'; value: string | number | boolean };

export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (!this.isAtEnd() && this.peek().type === type) {
        this.current++;
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, errorMessage: string): Token {
    if (!this.isAtEnd() && this.peek().type === type) {
      return this.tokens[this.current++];
    }
    throw new Error(`${errorMessage}. Found '${this.peek().value}' at position ${this.peek().position}`);
  }

  parse(): ASTNode {
    if (this.tokens.length <= 1 || this.peek().type === 'EOF') {
      throw new Error('Empty expression');
    }
    const expr = this.orExpression();
    if (!this.isAtEnd()) {
      throw new Error(`Unexpected token '${this.peek().value}' at position ${this.peek().position}`);
    }
    return expr;
  }

  // Grammar: OR -> AND ('||' AND)*
  private orExpression(): ASTNode {
    let expr = this.andExpression();
    while (this.match('OR')) {
      const right = this.andExpression();
      expr = { type: 'BinaryExpr', operator: '||', left: expr, right };
    }
    return expr;
  }

  // Grammar: AND -> EQUALITY ('&&' EQUALITY)*
  private andExpression(): ASTNode {
    let expr = this.equalityExpression();
    while (this.match('AND')) {
      const right = this.equalityExpression();
      expr = { type: 'BinaryExpr', operator: '&&', left: expr, right };
    }
    return expr;
  }

  // Grammar: EQUALITY -> COMPARISON (('==' | '!=') COMPARISON)*
  private equalityExpression(): ASTNode {
    let expr = this.comparisonExpression();
    while (this.match('EQUALS', 'NOT_EQUALS')) {
      const op = this.previous().value as '==' | '!=';
      const right = this.comparisonExpression();
      expr = { type: 'BinaryExpr', operator: op, left: expr, right };
    }
    return expr;
  }

  // Grammar: COMPARISON -> PRIMARY (('<' | '<=' | '>' | '>=') PRIMARY)*
  private comparisonExpression(): ASTNode {
    let expr = this.primary();
    while (this.match('LESS', 'LESS_EQUALS', 'GREATER', 'GREATER_EQUALS')) {
      const op = this.previous().value as '<' | '<=' | '>' | '>=';
      const right = this.primary();
      expr = { type: 'BinaryExpr', operator: op, left: expr, right };
    }
    return expr;
  }

  // Grammar: PRIMARY -> IDENTIFIER | LITERAL | '(' EXPRESSION ')'
  private primary(): ASTNode {
    if (this.match('IDENTIFIER')) {
      return { type: 'Identifier', name: String(this.previous().value) };
    }
    if (this.match('STRING', 'NUMBER')) {
      return { type: 'Literal', value: this.previous().value };
    }
    if (this.match('LPAREN')) {
      const expr = this.orExpression();
      this.consume('RPAREN', "Expected ')' after grouping expression");
      return expr;
    }
    throw new Error(`Unexpected syntax near '${this.peek().value}' at position ${this.peek().position}`);
  }
}

/**
 * Evaluates an AST Node against a given Activity item.
 */
export function evaluateAST(node: ASTNode, activity: Activity): any {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier': {
      const prop = node.name;
      // Supported activity properties
      if (prop === 'city') return activity.city.toLowerCase();
      if (prop === 'category') return activity.category.toLowerCase();
      if (prop === 'costAmount' || prop === 'cost') return activity.costAmount;
      if (prop === 'participantLimit' || prop === 'limit') return activity.participantLimit;
      if (prop === 'costMode') return activity.costMode;
      if (prop === 'spots' || prop === 'openSpots') {
        return Math.max(0, activity.participantLimit - activity.approvedParticipantIds.length);
      }
      return undefined;
    }

    case 'BinaryExpr': {
      const leftVal = evaluateAST(node.left, activity);
      const rightVal = evaluateAST(node.right, activity);

      // Normalize string comparisons to case-insensitive
      const normL = typeof leftVal === 'string' ? leftVal.toLowerCase() : leftVal;
      const normR = typeof rightVal === 'string' ? rightVal.toLowerCase() : rightVal;

      switch (node.operator) {
        case '==':
          return normL === normR;
        case '!=':
          return normL !== normR;
        case '<':
          return normL < normR;
        case '<=':
          return normL <= normR;
        case '>':
          return normL > normR;
        case '>=':
          return normL >= normR;
        case '&&':
          return Boolean(leftVal && rightVal);
        case '||':
          return Boolean(leftVal || rightVal);
        default:
          return false;
      }
    }
  }
}

/**
 * Compiles a query expression into a filter function for activities.
 */
export function compileQueryFilter(expression: string): {
  filterFn: ((activity: Activity) => boolean) | null;
  ast: ASTNode | null;
  tokens: Token[] | null;
  error: string | null;
} {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { filterFn: null, ast: null, tokens: null, error: null };
  }

  try {
    const lexer = new Lexer(trimmed);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    return {
      filterFn: (act: Activity) => Boolean(evaluateAST(ast, act)),
      ast,
      tokens,
      error: null,
    };
  } catch (err: any) {
    return {
      filterFn: null,
      ast: null,
      tokens: null,
      error: err.message || 'Syntax error in query expression',
    };
  }
}
