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
  [Check.IconHasOneAttachment]: "Icon has one attachment",
  [Check.IconIsPNG]: "Icon is a PNG",
  [Check.IconIsBelowMaxFileSize]: "Icon is below 1MB",
  [Check.IconIsAboveMinResolution]: "Icon is at least 256x256 pixels",
};

export function report(passed: Check[], failed: CheckComment[]) {
  const skipped = Object.values(Check).filter(
    (check) =>
      typeof check === "number" &&
      !passed.includes(check) &&
      failed.every((fail) => fail.check !== check)
  ) as Check[];

  const body = [
    `## Failed ${failed.length} Checks`,
    ...failed.map(
      (check) =>
        `❌ ${checkMessages[check.check]}${
          check.comment ? `: ${check.comment}` : ""
        }`
    ),

    `## Passed ${passed.length} Checks`,
    ...passed.map((check) => `✅ ${checkMessages[check]}`),

    `## Skipped ${skipped.length} Checks`,
    "These checks were skipped because they either don't apply to you or other checks failed before them.",
    ...skipped.map((check) => `~~${checkMessages[check]}~~`),
  ].join("\n\n");

  return body;
}
