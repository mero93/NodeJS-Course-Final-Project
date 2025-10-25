export function parseJwtDurationToMilliseconds(durationStr: string) {
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * MS_PER_SECOND;
  const MS_PER_HOUR = 60 * MS_PER_MINUTE;
  const MS_IN_DAY = MS_PER_HOUR * 24;

  const regex = /(\d+)\s*([dhms])/g;
  let duration = 0;
  let matched = false;
  let currentMatch: RegExpExecArray | null;

  while ((currentMatch = regex.exec(durationStr)) !== null) {
    matched = true;
    const value = parseInt(currentMatch[1], 10);
    const unit = currentMatch[2];

    switch (unit) {
      case 'd':
        duration += value * MS_IN_DAY;
        break;
      case 'h':
        duration += value * MS_PER_HOUR;
        break;
      case 'm':
        duration += value * MS_PER_MINUTE;
        break;
      case 's':
        duration += value * MS_PER_SECOND;
        break;
    }
  }

  if (!matched) {
    return parseInt(durationStr, 10);
  }

  return duration;
}
