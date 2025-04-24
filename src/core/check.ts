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

  IconHasOneAttachment,
  IconIsPNG,
  IconIsBelowMaxFileSize,
  IconIsAboveMinResolution,
}

export interface CheckComment {
  check: Check;
  comment?: string;
}
