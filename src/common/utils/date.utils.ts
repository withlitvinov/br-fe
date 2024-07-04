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
  const _date = dayjs(date, format);

  if (format === DateFormatEnum.Full) {
    return _date;
  }

  return _date.year(DUMMY_LEAP_YEAR);
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

export const daysBeforeWithoutYear = (date: dayjs.Dayjs) => {
  const now = dayjs();
  let _date = date.clone();

  _date = _date.year(
    isBeforeWithoutYear(now, _date) ? now.year() + 1 : now.year(),
  );

  return _date.diff(now, 'd');
};
