// Test targets
import {
  DUMMY_LEAP_YEAR,
  DateFormatEnum,
  DisplayDateFormatEnum,
  daysBeforeWithoutYear,
  getFormat,
  getWithFormat,
  isBeforeWithoutYear,
} from './date.utils.ts';

// Support utilities
import { numberUtils } from '.';

describe('Check constants', () => {
  it('DUMMY_LEAP_YEAR', () => {
    expect(DUMMY_LEAP_YEAR).toMatchSnapshot();
  });

  it('DateFormatEnum', () => {
    expect(DateFormatEnum).toMatchSnapshot();
  });

  it('DisplayDateFormatEnum', () => {
    expect(DisplayDateFormatEnum).toMatchSnapshot();
  });
});

describe('getFormat()', () => {
  it(`should return '${DateFormatEnum.Full}'`, () => {
    expect(getFormat(true)).toEqual(DateFormatEnum.Full);
  });

  it(`should return ${DateFormatEnum.WithoutYear}`, () => {
    expect(getFormat(false)).toEqual(DateFormatEnum.WithoutYear);
  });
});

describe('getWithFormat()', () => {
  it('should get date with year', () => {
    const dateOptions = {
      year: 2024,
      month: 7,
      day: 4,
    };

    const date = getWithFormat(
      `${dateOptions.year}-${numberUtils.padStart(dateOptions.month)}-${numberUtils.padStart(dateOptions.day)}`,
      DateFormatEnum.Full,
    );

    expect(date.year()).toEqual(dateOptions.year);
    expect(date.month()).toEqual(dateOptions.month - 1);
    expect(date.date()).toEqual(dateOptions.day);
  });

  it('should get date with dummy year', () => {
    const dateOptions = {
      month: 7,
      day: 4,
    };

    const date = getWithFormat(
      `${numberUtils.padStart(dateOptions.month)}-${numberUtils.padStart(dateOptions.day)}`,
      DateFormatEnum.WithoutYear,
    );

    expect(date.year()).toEqual(DUMMY_LEAP_YEAR);
    expect(date.month()).toEqual(dateOptions.month - 1);
    expect(date.date()).toEqual(dateOptions.day);
  });
});

describe('isBeforeWithoutYear()', () => {
  const createCase = (now: string, dateToCheck: string, expected: boolean) => {
    return {
      now: getWithFormat(now, DateFormatEnum.Full),
      _now: getWithFormat(now, DateFormatEnum.Full).format(
        DisplayDateFormatEnum.System,
      ),
      dateToCheck: getWithFormat(dateToCheck, DateFormatEnum.Full),
      _dateToCheck: getWithFormat(dateToCheck, DateFormatEnum.Full).format(
        DisplayDateFormatEnum.System,
      ),
      expected,
    };
  };

  test.each([
    createCase('2024-07-04', '2024-06-15', true),
    createCase('2024-07-04', '2024-07-03', true),
    createCase('2024-07-04', '2024-07-04', false),
    createCase('2024-07-04', '2024-07-12', false),
  ])(
    '($_now, $_dateToCheck) -> $expected',
    ({ now, dateToCheck, expected }) => {
      expect(isBeforeWithoutYear(now, dateToCheck)).toEqual(expected);
    },
  );
});

describe('daysBeforeWithoutYear()', () => {
  const createCase = (start: string, end: string, expected: number) => {
    return {
      start: getWithFormat(start, DateFormatEnum.Full),
      _start: getWithFormat(start, DateFormatEnum.Full).format(
        DisplayDateFormatEnum.System,
      ),
      end: getWithFormat(end, DateFormatEnum.Full),
      _end: getWithFormat(end, DateFormatEnum.Full).format(
        DisplayDateFormatEnum.System,
      ),
      expected,
    };
  };

  // There year value doesn't matter for result
  test.each([
    createCase('2024-07-05', '2024-09-15', 72),
    createCase('2024-07-05', '2024-06-01', 331),
    createCase('2024-07-05', '2024-07-05', 0),
    createCase('2024-07-05', '2024-12-30', 178),
  ])('($_end, $_start) -> $expected', ({ start, end, expected }) => {
    expect(daysBeforeWithoutYear(end, start)).toEqual(expected);
  });
});
