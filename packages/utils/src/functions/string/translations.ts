/**
 * Translates error messages into user-friendly strings using a translation function
 * Supports string errors, structured error objects, and default fallback messages
 *
 * @param params - The parameters for translation
 * @param params.error - The error to translate; accepts string or structured error object
 * @param params.t - Translation function (e.g., `useTranslations`) to resolve keys
 * @param params.file - Translation namespace or file prefix (default: `"errors"`)
 * @returns A translated, user-friendly message string
 *
 * @example
 * ```ts
 * import { getTranslations } from '@pelatform/utils';
 * import { useTranslations } from 'next-intl';
 *
 * const t = useTranslations('errors');
 *
 * // Translate a string error key
 * const message1 = getTranslations({ error: 'REQUEST_FAILED', t });
 *
 * // Translate structured error with code
 * const message2 = getTranslations({
 *   error: { error: { code: 'NOT_FOUND' } },
 *   t,
 * });
 *
 * // Fallback to error.message when translation key not found
 * const message3 = getTranslations({
 *   error: { message: 'Something went wrong' },
 *   t,
 * });
 *
 * // Custom namespace/file
 * const message4 = getTranslations({
 *   error: 'INVALID_TOKEN',
 *   t,
 *   file: 'auth',
 * });
 * ```
 */
export function getTranslations({
  error,
  t,
  file = "errors",
}: {
  // biome-ignore lint/suspicious/noExplicitAny: <>
  error: any;
  t: (key: string) => string;
  file?: string;
}) {
  if (typeof error === "string") {
    // Try to translate the error key if it exists
    const translated = t(`${file}.${error}`);
    if (translated && translated !== `${file}.${error}`) {
      return translated;
    }
    return error;
  }

  if (error?.error) {
    if (error.error.code) {
      const errorCode = error.error.code;
      // Try to translate error code
      const translated = t(`${file}.${errorCode}`);
      if (translated && translated !== `${file}.${errorCode}`) {
        return translated;
      }
      return errorCode;
    }

    return (
      error.error.message ||
      error.error.code ||
      error.error.statusText ||
      t(`${file}.REQUEST_FAILED`)
    );
  }

  return error?.message || t(`${file}.REQUEST_FAILED`) || "Request failed";
}
