import { Check, CheckComment } from "./check.ts";

const checkMessages: Record<Check, string> = {
  [Check.FormIsValid]: "Form is valid",
  [Check.ModNameIsString]: "Mod name is a string",
  [Check.ModNameIsTrimmed]:
    "Mod name is trimmed (does not container whitespace before or after)",
  [Check.ModNameIsAboveMinLength]: "Mod name is at least 3 characters long",
  [Check.ModNameIsBelowMaxLength]: "Mod name is at most 32 characters long",
  [Check.IdIsString]: "ID is a string",
  [Check.IdIsTrimmed]:
    "ID is trimmed (does not container whitespace before or after)",
  [Check.IdIsAboveMinLength]: "ID is at least 3 characters long",
  [Check.IdIsBelowMaxLength]: "ID is at most 32 characters long",
  [Check.IdOnlyContainsAlphanumericsAndDashes]:
    "ID only contains alphanumerics and dashes",
  [Check.IdStartsWithAlphanumeric]: "ID starts with an alphanumeric",
  [Check.IdEndsWithAlphanumeric]: "ID ends with an alphanumeric",
  [Check.IdHasNoRepeatedDashes]: "ID has no repeated dashes",
};

export function report(passed: Check[], failed: CheckComment[]) {
  const skipped = Object.values(Check).filter(
    (check) =>
      typeof check === "number" &&
      !passed.includes(check) &&
      failed.every((fail) => fail.check !== check)
  ) as Check[];

  const body = [
    `## Passed ${passed.length} Checks`,
    ...passed.map((check) => `✅ ${checkMessages[check]}`),

    `## Failed ${failed.length} Checks`,
    ...failed.map(
      (check) =>
        `❌ ${checkMessages[check.check]}${
          check.comment ? `: ${check.comment}` : ""
        }`
    ),

    `## Skipped ${skipped.length} Checks`,
    ...skipped.map((check) => `⚠️ ${checkMessages[check]}`),
  ].join("\n\n");

  return body;
}
