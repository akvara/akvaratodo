import { DAYS, MONTHS } from '../locale/lt';

export const dayString = (date: Date) => `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} d.`;
export const dayWeekName = (date: Date) => DAYS[date.getDay()].toLowerCase();
export const dayMonthName = (date: Date) => MONTHS[date.getMonth()];
export const dayNumber = (date: Date) => date.getDate();
