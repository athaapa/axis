import { parseMath } from "latex-math";
import {
  ConstantNode,
  SymbolNode,
  OperatorNode,
  FunctionNode,
  MathNode,
} from "mathjs";

type AstNodeList = ReturnType<typeof parseMath>;
type AstNode = AstNodeList[number];
type NormalMathNode = {
  type: "symbol" | "func";
  name: string;
  args?: NormalMathTree;
};

type NormalMathTree = NormalMathNode[];

/*
    Given a valid LaTeX string, returns a valid math.js expression tree.
    @param expr the LaTeX expression to parse
    @returns exprTree the expression tree that represents expr
*/
export function parseLatexToExpressionTree(expr: string) {
  const ast = parseMath(expr);

  //console.log(JSON.stringify(ast, null, 2));

  const normalizedAst = ast.map(normalizeLatexAst).filter(Boolean);

  return JSON.stringify(normalizedAst, null, 2);
}

function normalizeLatexAst(node: AstNode): NormalMathNode | undefined {
  switch (node.type) {
    case "string":
      return { type: "symbol", name: node.content };
    case "macro":
      if (node.content === "sqrt") {
        const radicand = node.args?.[1]?.content?.[0];
        const arg = normalizeLatexAst(radicand);
        return {
          type: "func",
          name: "sqrt",
          args: arg ? [arg] : [],
        };
      }
      if (node.content === "frac") {
        const numerator = node.args?.[0]?.content ?? [];
        const denominator = node.args?.[1]?.content ?? [];

        const parsedNumerator = numerator
          .map(normalizeLatexAst)
          .filter(Boolean);
        const parsedDenominator = denominator
          .map(normalizeLatexAst)
          .filter(Boolean);
        return {
          type: "func",
          name: "frac",
          args: [
            parsedNumerator, // Numerator tree
            parsedDenominator, // Denominator tree
          ],
        };
      }
  }
}

function operatorToFn(op: string): string {
  switch (op) {
    case "+":
      return "add";
    case "-":
      return "subtract";
    case "*":
      return "multiply";
    case "/":
      return "divide";
    default:
      return op;
  }
}

function toMathJsTree(node: NormalMathNode): MathNode {
  switch (node.type) {
    case "symbol":
      const number = Number(node.name);
      if (!isNaN(number)) {
        return new ConstantNode(number);
      }

      if (["+", "-", "*"].includes(node.name)) {
        return new OperatorNode(node.name, operatorToFn(node.name), []);
      }

      return new SymbolNode(node.name);
    case "func": {
      const args = (node.args || []).map(toMathJsTree);
      return new FunctionNode(node.name, args);
    }
  }
}

//parseLatexToExpressionTree("5+\\frac{2}{3+6}");
console.log(parseLatexToExpressionTree("5+\\frac{2}{3+6}"));
//console.log(parseLatexToExpressionTree("5+\\sqrt{x}"));
