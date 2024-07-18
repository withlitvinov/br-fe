import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customFormat);
dayjs.extend(utc);

/**
 * Use when date comes without year
 */
const DUMMY_LEAP_YEAR = 1600;

/**
 * Date formats that come from backend
 */
enum DateFormatEnum {
  Full = 'YYYY-MM-DD',
  WithoutYear = 'MM-DD',
}

enum DisplayDateFormatEnum {
  System = 'YYYY-MM-DD',
  Dot = 'DD.MM.YYYY',
  DotWithoutYear = 'DD.MM',
  DayWithShortMonth = 'D MMM',
}

/**
 * Returns local date without timezone
 */
const getLocalWithoutTz = () => {
  return dayjs().utc(true);
};

const resetTime = (date: dayjs.Dayjs) => {
  let _date = date.clone().utc(true);

  _date = _date.hour(0);
  _date = _date.minute(0);
  _date = _date.second(0);
  _date = _date.millisecond(0);

  return _date;
};

const getFormat = (isDateFull: boolean): DateFormatEnum => {
  return isDateFull ? DateFormatEnum.Full : DateFormatEnum.WithoutYear;
};

const getWithFormat = (
  date: string,
  format: DateFormatEnum,
  local = true,
): dayjs.Dayjs => {
  let _date = local ? dayjs(date, format).utc(true) : dayjs(date, format);

  if (format === DateFormatEnum.WithoutYear) {
    _date = _date.year(DUMMY_LEAP_YEAR);
  }

  return _date;
};

const isBeforeWithoutYear = (now: dayjs.Dayjs, dateToCheck: dayjs.Dayjs) => {
  if (now.month() > dateToCheck.month()) {
    return true;
  }

  return now.month() === dateToCheck.month() && now.date() > dateToCheck.date();
};

const daysBeforeWithoutYear = (
  end: dayjs.Dayjs,
  start: dayjs.Dayjs = getLocalWithoutTz(),
) => {
  const _start = resetTime(start);
  let _end = resetTime(end);

  _end = _end.year(
    isBeforeWithoutYear(_start, _end) ? _start.year() + 1 : _start.year(),
  );

  return _end.diff(_start, 'd');
};

export {
  DUMMY_LEAP_YEAR,
  DateFormatEnum,
  DisplayDateFormatEnum,
  getFormat,
  getWithFormat,
  daysBeforeWithoutYear,
  isBeforeWithoutYear,
};
