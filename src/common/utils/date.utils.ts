import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customFormat);

/**
 * Use when date comes without year
 */
export const DUMMY_LEAP_YEAR = 1600;

/**
 * Date formats that come from backend
 */
export enum DateFormatEnum {
  Full = 'YYYY-MM-DD',
  WithoutYear = 'MM-DD',
}

export enum DisplayDateFormatEnum {
  System = 'YYYY-MM-DD',
  Dot = 'DD.MM.YYYY',
  DotWithoutYear = 'DD.MM',
  DayWithShortMonth = 'D MMM',
}

export const getFormat = (isDateFull: boolean): DateFormatEnum =>
  isDateFull ? DateFormatEnum.Full : DateFormatEnum.WithoutYear;

export const getWithFormat = (
  date: string,
  format: DateFormatEnum,
): dayjs.Dayjs => {
  let _date = dayjs(date, format);

  if (format === DateFormatEnum.WithoutYear) {
    _date = _date.year(DUMMY_LEAP_YEAR);
  }

  return _date;
};

export const isBeforeWithoutYear = (
  now: dayjs.Dayjs,
  dateToCheck: dayjs.Dayjs,
) => {
  if (now.month() > dateToCheck.month()) {
    return true;
  }

  return now.month() === dateToCheck.month() && now.date() > dateToCheck.date();
};

export const daysBeforeWithoutYear = (
  end: dayjs.Dayjs,
  start: dayjs.Dayjs = dayjs(),
) => {
  const now = start.clone();

  let _date = end.clone();

  _date = _date.year(
    isBeforeWithoutYear(now, _date) ? now.year() + 1 : now.year(),
  );

  return _date.diff(now, 'd');
};
