// DateRangePickerUtils.js (complete implementation)
class DateRangePickerUtils {
  /**
   * Get the system date format based on the user's locale
   * @returns {string} Date format string
   */
  getSystemDateFormat() {
    return 'MM/DD/YYYY'; // Default format, in a real implementation this would detect user's locale
  }

  /**
   * Extract date format from a combined format string
   * @param {string} formatString - Combined date and time format
   * @returns {string} Date format portion
   */
  extractDateFormat(formatString) {
    if (!formatString) return this.getSystemDateFormat();

    // If format contains time components, extract just the date part
    if (this.hasTimeComponent(formatString)) {
      return formatString.split(' ')[0];
    }

    return formatString;
  }

  /**
   * Extract time format from a combined format string
   * @param {string} formatString - Combined date and time format
   * @param {boolean} use24Hour - Whether to use 24-hour format
   * @returns {string} Time format portion
   */
  extractTimeFormat(formatString, use24Hour) {
    if (formatString && this.hasTimeComponent(formatString)) {
      return formatString.split(' ').slice(1).join(' ');
    }

    return use24Hour ? 'HH:mm' : 'hh:mm A';
  }

  /**
   * Check if a format string contains time components
   * @param {string} formatString - Format string to check
   * @returns {boolean} True if format contains time components
   */
  hasTimeComponent(formatString) {
    if (!formatString) return false;

    const timeTokens = ['HH', 'H', 'hh', 'h', 'mm', 'm', 'ss', 's', 'A', 'a'];
    return timeTokens.some((token) => formatString.includes(token));
  }

  /**
   * Get the display format for a date
   * @param {string} dateFormat - Date format
   * @param {string} timeFormat - Time format
   * @param {boolean} includeTime - Whether to include time in the output
   * @param {string} userProvidedFormat - User-provided format (overrides other params)
   * @returns {string} Display format
   */
  getDisplayFormat(dateFormat, timeFormat, includeTime, userProvidedFormat) {
    if (userProvidedFormat) {
      return userProvidedFormat;
    }

    return includeTime ? `${dateFormat} ${timeFormat}` : dateFormat;
  }

  /**
   * Format a date using the specified format
   * @param {Moment} date - Date to format
   * @param {string} format - Format string
   * @returns {string} Formatted date string
   */
  formatDate(date, format) {
    if (!date) return '';
    return date.format(format);
  }

  /**
   * Check if a date is disabled based on min/max constraints
   * @param {Moment} date - Date to check
   * @param {Moment} minDate - Minimum allowed date
   * @param {Moment} maxDate - Maximum allowed date
   * @returns {boolean} True if date is disabled
   */
  isDateDisabled(date, minDate, maxDate) {
    if (!date) return false;
    return (
      (minDate && date.isBefore(minDate, 'day')) ||
      (maxDate && date.isAfter(maxDate, 'day'))
    );
  }

  /**
   * Check if a date is within a given range
   * @param {Moment} date - Date to check
   * @param {Moment} startDate - Range start date
   * @param {Moment} endDate - Range end date
   * @returns {boolean} True if date is in range
   */
  isDateInRange(date, startDate, endDate) {
    if (!date || !startDate || !endDate) return false;

    return (
      date.isSameOrAfter(startDate, 'day') &&
      date.isSameOrBefore(endDate, 'day')
    );
  }

  /**
   * Get CSS class names for date cells based on various states
   * @param {Object} options - Date state options
   * @returns {string} Space-separated class names
   */
  getDateClassNames(options) {
    const {
      isOffDay,
      isDisabled,
      isToday,
      isStartDate,
      isEndDate,
      isInRange,
      isPreview,
    } = options;

    const classes = ['day'];

    if (isOffDay) classes.push('off');
    if (isDisabled) classes.push('disabled');
    if (isToday) classes.push('today');
    if (isStartDate) classes.push('start-date');
    if (isEndDate) classes.push('end-date');
    if (isInRange) classes.push('in-range');
    if (isPreview) classes.push('preview');

    return classes.join(' ');
  }

  /**
   * Generate month and year dropdown options
   * @param {Function} moment - Timezone-aware moment function
   * @returns {Object} Object with monthOptions and yearOptions arrays
   */
  getCalendarDropdownOptions(moment) {
    // Generate month options
    const monthOptions = [];
    for (let i = 0; i < 12; i++) {
      monthOptions.push(
        <option key={i} value={i}>
          {moment().month(i).format('MMMM')}
        </option>
      );
    }

    // Generate year options (10 years back, 10 years forward)
    const currentYear = moment().year();
    const yearOptions = [];
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
   * Build a matrix of days for the calendar
   * @param {Moment} month - Month to build matrix for
   * @returns {Object} Object with weekdaysShort and daysMatrix arrays
   */
  buildDayMatrix(month) {
    const firstDay = month.clone().startOf('month').day();
    const daysInMonth = month.daysInMonth();
    const lastMonthDays = month.clone().subtract(1, 'month').daysInMonth();

    const weekdaysShort = [];
    for (let i = 0; i < 7; i++) {
      weekdaysShort.push(moment().day(i).format('ddd'));
    }

    const daysMatrix = [];
    let day = 1;
    let nextMonthDay = 1;

    // Build 6 weeks (rows)
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
