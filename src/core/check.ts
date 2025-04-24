export enum Check {
  FormIsValid,

  ModNameIsString,
  ModNameIsTrimmed,
  ModNameIsAboveMinLength,
  ModNameIsBelowMaxLength,

  IdIsString,
  IdIsTrimmed,
  IdIsAboveMinLength,
  IdIsBelowMaxLength,
  IdOnlyContainsAlphanumericsAndDashes,
  IdStartsWithAlphanumeric,
  IdEndsWithAlphanumeric,
  IdHasNoRepeatedDashes,
}

export interface CheckComment {
  check: Check;
  comment?: string;
}
