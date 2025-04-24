import { marked, Token } from "npm:marked";
import { Check, CheckComment } from "./core/check.ts";
import { BreakError } from "./core/error.ts";
import { Form } from "./core/form.ts";
import { report } from "./core/report.ts";

const markdown = await Deno.readTextFile("test.md");
const tokens = marked.lexer(markdown).filter((token) => token.type !== "space");

const passed: Check[] = [];
const failed: CheckComment[] = [];

const form: Partial<Form> = {};

try {
  for (let index = 0; index < tokens.length; index += 2) {
    const key = tokens[index];

    if (key.type !== "heading") {
      failed.push({
        check: Check.FormIsValid,
        comment: `Expected a heading at index ${index} but got ${key.type}. Did you tamper with the issue form?`,
      });
      throw new BreakError();
    }

    const value = tokens[index + 1];

    const expect = <T extends string>(type: T) => {
      if (value.type !== type) {
        failed.push({
          check: Check.FormIsValid,
          comment: `Expected a ${type} after heading "${key.text}" but got ${value.type}. Did you tamper with the issue form?`,
        });
      }

      return value as Token & { type: T };
    };

    const test = (result: boolean, check: Check | CheckComment) => {
      if (result) {
        passed.push(typeof check === "number" ? check : check.check);
      } else {
        failed.push(typeof check === "number" ? { check } : check);
        throw new BreakError();
      }
    };

    switch (key.text) {
      case "Mod Name": {
        const paragraph = expect("paragraph");

        if (typeof paragraph.text === "string") {
          passed.push(Check.ModNameIsString);
        } else {
          failed.push({ check: Check.ModNameIsString });
          throw new BreakError();
        }

        test(paragraph.text.trim() === paragraph.text, Check.ModNameIsTrimmed);

        test(paragraph.text.length >= 3, Check.ModNameIsAboveMinLength);

        test(paragraph.text.length <= 32, Check.ModNameIsBelowMaxLength);

        form.name = paragraph.text;

        break;
      }

      case "ID": {
        const paragraph = expect("paragraph");

        if (typeof paragraph.text === "string") {
          passed.push(Check.IdIsString);
        } else {
          failed.push({ check: Check.IdIsString });
          throw new BreakError();
        }

        test(paragraph.text.trim() === paragraph.text, Check.IdIsTrimmed);

        test(paragraph.text.length >= 3, Check.IdIsAboveMinLength);

        test(paragraph.text.length <= 32, Check.IdIsBelowMaxLength);

        test(
          /^[a-z0-9-]+$/.test(paragraph.text),
          Check.IdOnlyContainsAlphanumericsAndDashes
        );

        test(!paragraph.text.startsWith("-"), Check.IdStartsWithAlphanumeric);

        test(!paragraph.text.endsWith("-"), Check.IdEndsWithAlphanumeric);

        test(!paragraph.text.includes("--"), Check.IdHasNoRepeatedDashes);

        break;
      }

      default: {
        failed.push({
          check: Check.FormIsValid,
          comment: `Unexpected heading "${key.text}". Did you tamper with the issue form?`,
        });
        throw new BreakError();
      }
    }
  }
} catch (error) {
  if (!(error instanceof BreakError)) {
    // TODO: apologize
  }
}

if (failed.length === 0) passed.push(Check.FormIsValid);

const body = report(passed, failed);
console.log(body);
