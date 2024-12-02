// src/shared/utils/error-messages.util.ts

/**
 * The pipeValidationErrorMessage function takes a property as input and returns a string indicating that the property added is either invalid or not a string.
 * Is used to add a custom messages for Pipes Validations
 */
export const pipeValidationErrorMessage = (property: string): string =>
  `The ${property} added is either invalid or not a string`;

export const notFound = (id: string, item: string = 'Item'): string =>
  `${item} with UUID: ${id} is not found`;

export const alreadyExist = (property: string, item: string = 'Item'): string =>
  `${item} ${property} already exists`;