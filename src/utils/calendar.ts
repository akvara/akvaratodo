import { DAYS, MONTHS } from '../locale/lt';

export const dayString = (date: Date) => `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} d.`;
