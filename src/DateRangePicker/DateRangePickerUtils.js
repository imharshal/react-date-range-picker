// DateRangePickerUtils.js
class DateRangePickerUtils {
  constructor() {
    // Initialize utility functions
  }

  getSystemDateFormat() {
    return 'MM/DD/YYYY'; // Default format, will be improved later
  }

  extractDateFormat(formatString) {
    return formatString || 'MM/DD/YYYY';
  }

  extractTimeFormat(formatString, use24Hour) {
    return use24Hour ? 'HH:mm' : 'hh:mm A';
  }
}

export default DateRangePickerUtils;
