/*eslint-disable*/
import React from 'react';

/**
 * Utility class for DateRangePicker component
 * Provides helper methods for date manipulation, formatting and UI generation
 */
class DateRangePickerUtils {
  /**
   * Check if a format string contains time components
   * @param {string} format - Date format string
   * @returns {boolean} True if format contains time tokens
   */
  containsTimeFormat(format) {
    if (!format) return false;
    const timeTokens = ['HH', 'H', 'hh', 'h', 'mm', 'm', 'ss', 's', 'a', 'A'];
    return timeTokens.some((token) => format.includes(token));
  }

  /**
   * Get system date format based on user's locale
   * @returns {string} Date format string (e.g. 'MM/DD/YYYY')
   */
  getSystemDateFormat() {
    try {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formatter = new Intl.DateTimeFormat(navigator.language, options);
      const parts = formatter.formatToParts(new Date());

      let format = '';
      for (const part of parts) {
        switch (part.type) {
          case 'month':
            format += 'MM';
            break;
          case 'day':
            format += 'DD';
            break;
          case 'year':
            format += 'YYYY';
            break;
          case 'literal':
            format += part.value;
            break;
        }
      }
      return format || 'MM/DD/YYYY'; // Fallback if detection fails
    } catch (e) {
      return 'MM/DD/YYYY';
    }
  }

  /**
   * Extract date format from a combined format
   * @param {string} format - Date format possibly containing time components
   * @returns {string} Date-only format
   */
  extractDateFormat(format) {
    if (!format || !this.containsTimeFormat(format)) return format;
    return format.replace(
      /\s?[hHkaA]{1,2}[:.]?[mM]{0,2}[:.]?[sS]{0,2}\s?[aApP]{0,2}[mM]{0,2}\s?/g,
      ''
    );
  }

  /**
   * Extract time format from a combined format or get default
   * @param {string} format - Date format possibly containing time components
   * @param {boolean} timePicker24Hour - Whether to use 24-hour format
   * @returns {string} Time format string
   */
  extractTimeFormat(format, timePicker24Hour) {
    if (format && this.containsTimeFormat(format)) {
      const timeMatch = format.match(
        /[hHkaA]{1,2}[:.]?[mM]{0,2}[:.]?[sS]{0,2}\s?[aApP]{0,2}[mM]{0,2}/
      );
      if (timeMatch) return timeMatch[0];
    }
    return timePicker24Hour ? 'HH:mm' : 'hh:mm A';
  }

  /**
   * Get display format based on settings
   * @param {string} dateFormat - Date format
   * @param {string} timeFormat - Time format
   * @param {boolean} timePicker - Whether time picker is enabled
   * @param {string} userProvidedFormat - Format provided by user (if any)
   * @returns {string} Format to use for display
   */
  getDisplayFormat(dateFormat, timeFormat, timePicker, userProvidedFormat) {
    if (userProvidedFormat && this.containsTimeFormat(userProvidedFormat)) {
      return userProvidedFormat;
    }
    return timePicker ? `${dateFormat} ${timeFormat}` : dateFormat;
  }

  /**
   * Format a date with the specified format
   * @param {object} date - Moment date object
   * @param {string} format - Date format string
   * @returns {string} Formatted date string
   */
  formatDate(date, format) {
    if (!date) return '';
    return date.format(format);
  }

  /**
   * Check if a date is disabled based on min/max constraints
   * @param {object} date - Moment date object to check
   * @param {object} minDate - Minimum allowed date
   * @param {object} maxDate - Maximum allowed date
   * @returns {boolean} True if date is disabled
   */
  isDateDisabled(date, minDate, maxDate) {
    return (
      (minDate && date.isBefore(minDate, 'day')) ||
      (maxDate && date.isAfter(maxDate, 'day'))
    );
  }

  /**
   * Check if a date is within a range (inclusive)
   * @param {object} date - Moment date object to check
   * @param {object} rangeStart - Start of range
   * @param {object} rangeEnd - End of range
   * @returns {boolean} True if date is within range
   */
  isDateInRange(date, rangeStart, rangeEnd) {
    if (!date || !rangeStart || !rangeEnd) return false;
    return (
      date.isSameOrAfter(rangeStart, 'day') &&
      date.isSameOrBefore(rangeEnd, 'day')
    );
  }

  /**
   * Get CSS class names for date cells
   * @param {object} params - Object containing boolean flags for various states
   * @returns {string} Space-separated class names
   */
  getDateClassNames({
    isOffDay,
    isDisabled,
    isToday,
    isStartDate,
    isEndDate,
    isInRange,
    isPreview,
  }) {
    const classNames = [
      isOffDay ? 'off' : 'available',
      isDisabled ? 'disabled' : '',
      isToday ? 'today' : '',
      isStartDate ? 'active start-date' : '',
      isEndDate ? 'active end-date' : '',
      (isInRange || isPreview) && !isStartDate && !isEndDate ? 'in-range' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return classNames;
  }

  /**
   * Generate dropdown options for month/year selectors
   * @param {function} momentFn - Moment function with timezone support
   * @returns {object} Object with monthOptions and yearOptions arrays
   */
  getCalendarDropdownOptions(momentFn) {
    const monthOptions = [];
    const yearOptions = [];

    // Build month options
    for (let i = 0; i < 12; i++) {
      monthOptions.push(
        <option key={i} value={i}>
          {momentFn().month(i).format('MMM')}
        </option>
      );
    }

    // Build year options
    const currentYear = momentFn().year();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      yearOptions.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return { monthOptions, yearOptions };
  }

  /**
   * Build a matrix of days for the calendar view
   * @param {object} month - Moment object representing the month to display
   * @returns {object} Object with weekdaysShort and daysMatrix
   */
  buildDayMatrix(month) {
    if (!month) {
      console.error('Month is required to build day matrix');
      return { weekdaysShort: [], daysMatrix: [] };
    }

    const firstDay = month.clone().startOf('month').day();
    const daysInMonth = month.daysInMonth();
    const lastMonthDays = month.clone().subtract(1, 'month').daysInMonth();

    // Generate short weekday names
    const weekdaysShort = [];
    for (let i = 0; i < 7; i++) {
      weekdaysShort.push(month.clone().day(i).format('dd'));
    }

    // Generate days matrix
    const daysMatrix = [];
    let day = 1;
    let nextMonthDay = 1;

    // Build 6 rows (weeks)
    for (let i = 0; i < 6; i++) {
      const week = [];

      // Build 7 columns (days)
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          // Previous month days
          const prevMonthDate = month
            .clone()
            .subtract(1, 'month')
            .date(lastMonthDays - (firstDay - j - 1));
          week.push(prevMonthDate);
        } else if (day > daysInMonth) {
          // Next month days
          const nextMonthDate = month
            .clone()
            .add(1, 'month')
            .date(nextMonthDay++);
          week.push(nextMonthDate);
        } else {
          // Current month days
          const currentDate = month.clone().date(day++);
          week.push(currentDate);
        }
      }

      daysMatrix.push(week);

      // If we've already included all days and started the next month, we can stop
      if (day > daysInMonth && i >= 4) {
        break;
      }
    }

    return { weekdaysShort, daysMatrix };
  }

  /**
   * Get a standardized separator for date ranges
   * @param {object} locale - Locale configuration object
   * @returns {string} Separator string
   */
  getSeparator(locale) {
    return locale?.separator || ' - ';
  }
}

export default DateRangePickerUtils;
