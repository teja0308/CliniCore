import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { set as dfSet, isBefore, addMinutes, isEqual } from 'date-fns';

const IST = 'Asia/Kolkata';

export function toIST(date) {
  return utcToZonedTime(date, IST);
}

export function fromIST(date) {
  return zonedTimeToUtc(date, IST);
}

export function startOfDayIST(date) {
  const ist = toIST(date);
  const start = dfSet(ist, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  return fromIST(start);
}

export function clampToCampusHours(date) {
  // Clamp a Date (UTC) into campus hours in IST (09:00 - 20:00)
  const ist = toIST(date);
  const h = ist.getHours();
  const m = ist.getMinutes();
  let clamped = ist;
  if (h < 9 || (h === 9 && m < 0)) {
    clamped = dfSet(ist, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
  }
  if (h > 20 || (h === 20 && m > 0)) {
    clamped = dfSet(ist, { hours: 20, minutes: 0, seconds: 0, milliseconds: 0 });
  }
  return fromIST(clamped);
}

export function alignToTwentyMinutesCeil(date) {
  const ist = toIST(date);
  const minutes = ist.getMinutes();
  const mod = minutes % 20;
  if (mod === 0) return date;
  const alignedIST = addMinutes(dfSet(ist, { seconds: 0, milliseconds: 0 }), 20 - mod);
  return fromIST(alignedIST);
}

export function generateSlotsISTRange(istDate, istStart, istEnd) {
  // istDate is a Date object in IST zone representing the date
  // istStart / istEnd are {hours, minutes}
  const startIST = dfSet(istDate, { hours: Math.max(9, istStart.hours), minutes: Math.max(0, istStart.minutes), seconds: 0, milliseconds: 0 });
  const endIST = dfSet(istDate, { hours: Math.min(20, istEnd.hours), minutes: Math.min(59, istEnd.minutes), seconds: 0, milliseconds: 0 });
  let currentIST = startIST;
  const slots = [];
  // align to 00/20/40
  const mod = currentIST.getMinutes() % 20;
  if (mod !== 0) currentIST = addMinutes(currentIST, 20 - mod);
  while (isBefore(currentIST, endIST) || isEqual(currentIST, endIST)) {
    const end = addMinutes(currentIST, 20);
    if (end > endIST) break;
    slots.push({ start: fromIST(currentIST), end: fromIST(end) });
    currentIST = addMinutes(currentIST, 20);
  }
  return slots;
}


