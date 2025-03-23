// DateRangePickerUtils.js
class DateRangePickerUtils {
  constructor() {
    // Initialize utility functions
  }

  getSystemDateFormat() {
    return 'MM/DD/YYYY'; // Default format
  }

  extractDateFormat(formatString) {
    return formatString || 'MM/DD/YYYY';
  }

  extractTimeFormat(formatString, use24Hour) {
    return use24Hour ? 'HH:mm' : 'hh:mm A';
  }

  getDisplayFormat(dateFormat, timeFormat, includeTime, userProvidedFormat) {
    if (userProvidedFormat) {
      return userProvidedFormat;
    }

    return includeTime ? `${dateFormat} ${timeFormat}` : dateFormat;
  }

  formatDate(date, format) {
    return date.format(format);
  }

  isDateDisabled(date, minDate, maxDate) {
    if (!date) return false;
    return (
      (minDate && date.isBefore(minDate, 'day')) ||
      (maxDate && date.isAfter(maxDate, 'day'))
    );
  }

  isDateInRange(date, startDate, endDate) {
    if (!date || !startDate || !endDate) return false;

    return (
      date.isSameOrAfter(startDate, 'day') &&
      date.isSameOrBefore(endDate, 'day')
    );
  }
}

export default DateRangePickerUtils;
