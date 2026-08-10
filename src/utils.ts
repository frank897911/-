/**
 * Utility function to parse various time string formats into minutes from midnight.
 * Used to ensure itinerary items are always sorted chronologically from morning to night.
 *
 * Supported formats:
 * - "08:30", "8:30", "14:15"
 * - "08:30 - 10:00"
 * - "上午 08:30", "上午 8:30", "上午08:30"
 * - "下午 02:30", "下午 2:30", "下午02:30", "下午 12:30"
 * - "8:30 AM", "2:30 PM", "12:30 PM"
 */
export const parseTimeToMinutes = (timeStr?: string): number => {
  if (!timeStr) return 99999;

  const cleanStr = timeStr.trim();
  if (!cleanStr) return 99999;

  const isPm = /下午|pm/i.test(cleanStr);
  const isAm = /上午|am/i.test(cleanStr);

  const match = cleanStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    const singleDigitMatch = cleanStr.match(/(\d{1,2})/);
    if (singleDigitMatch) {
      let hours = parseInt(singleDigitMatch[1], 10);
      if (isPm && hours < 12) hours += 12;
      if (isAm && hours === 12) hours = 0;
      return hours * 60;
    }
    return 99999;
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (isPm && hours < 12) {
    hours += 12;
  } else if (isAm && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

/**
 * Sorts array of objects with a `time` field in chronological order.
 */
export const sortItineraryItems = <T extends { time: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
};
