import { SetMetadata } from '@nestjs/common';

export const SUCCESS_MESSAGE_KEY = 'success_message';

/**
 * The decorator accepts either a static string or a function that takes the data and returns a string.
 */
export type SuccessMessageType<T> = string | ((data: T) => string);

export const SuccessMessage = <T>(message: SuccessMessageType<T>) =>
  SetMetadata(SUCCESS_MESSAGE_KEY, message);
