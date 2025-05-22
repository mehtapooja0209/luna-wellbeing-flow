
import { parseISO } from 'date-fns';

/**
 * Safely converts a string date to a Date object
 * @param dateStr - Date string in ISO format
 * @returns Date object
 */
export const stringToDate = (dateStr: string): Date => {
  return parseISO(dateStr);
};
