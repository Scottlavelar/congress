export function weekday(ts: Date) {
  const day = ts.getDay();
  if (day == 0) day = 7;
  return day;
}
