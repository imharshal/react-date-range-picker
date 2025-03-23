// DateRangePicker.js
import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import moment from 'moment-timezone';
import DateRangePickerUtils from './DateRangePickerUtils';
import './styles.scss';

const DateRangePicker = (props) => {
  // Get timeZone from props or use local timezone as default
  const timeZone = props.timeZone || moment.tz.guess();

  // Create utility instance
  const utils = new DateRangePickerUtils();

  // Create a timezone-aware moment function to ensure consistent usage
  const getMoment = (date) => {
    if (date && moment.isMoment(date)) {
      return date.clone().tz(timeZone);
    }
    return date ? moment(date).tz(timeZone) : moment().tz(timeZone);
  };

  // Get format settings
  const userProvidedFormat = props.options?.locale?.format;
  const baseDateFormat = useMemo(() => {
    const systemOrProvidedFormat =
      userProvidedFormat || utils.getSystemDateFormat();
    return utils.extractDateFormat(systemOrProvidedFormat);
  }, [userProvidedFormat]);

  const timeFormat = useMemo(() => {
    return utils.extractTimeFormat(
      userProvidedFormat,
      props.options?.timePicker24Hour
    );
  }, [userProvidedFormat, props.options?.timePicker24Hour]);

  // Default options
  const options = {
    singleDatePicker: false,
    icon: '',
    showInputField: true,
    showFullDateRangeLabel: false,
    showDropdowns: true,
    timePicker: false,
    timePicker24Hour: false,
    timePickerIncrement: 5,
    timePickerSeconds: false,
    linkedCalendars: true,
    autoApply: false,
    autoUpdateInput: true,
    showCustomRangeLabel: true,
    alwaysShowCalendars: false,
    opens: 'right',
    drops: 'auto',
    buttonClasses: 'drp-btn',
    applyButtonClasses: 'drp-btn-primary',
    cancelButtonClasses: 'drp-btn-default',
    ...props.options,
    locale: {
      format: baseDateFormat,
      separator: ' - ',
      ...(props.options?.locale || {}),
    },
  };

  // Get the display format for dates
  const getDisplayFormat = () => {
    return utils.getDisplayFormat(
      baseDateFormat,
      timeFormat,
      options.timePicker,
      userProvidedFormat
    );
  };

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [userStartDate, setUserStartDate] = useState(
    props.startDate ? getMoment(props.startDate) : null
  );
  const [userEndDate, setUserEndDate] = useState(
    props.endDate ? getMoment(props.endDate) : null
  );
  const [startDate, setStartDate] = useState(
    props.startDate ? getMoment(props.startDate) : getMoment()
  );
  const [endDate, setEndDate] = useState(
    props.endDate ? getMoment(props.endDate) : getMoment()
  );
  const [chosenLabel, setChosenLabel] = useState('');
  const [showCalendars, setShowCalendars] = useState(
    options.alwaysShowCalendars
  );
  const [leftCalendarMonth, setLeftCalendarMonth] = useState(
    getMoment(startDate)
  );
  const [rightCalendarMonth, setRightCalendarMonth] = useState(
    getMoment(startDate).add(1, 'month')
  );

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return '';
    return date.format(getDisplayFormat());
  };

  // Calendar updates
  const updateCalendars = () => {
    setLeftCalendarMonth(startDate.clone());
    if (
      options.linkedCalendars ||
      (startDate.month() === endDate.month() &&
        startDate.year() === endDate.year())
    ) {
      setRightCalendarMonth(startDate.clone().add(1, 'month'));
    } else {
      setRightCalendarMonth(endDate.clone());
    }
  };

  // Text input updates
  const updateInputText = () => {
    if (inputRef.current) {
      const formattedStartDate = formatDateDisplay(startDate);
      const formattedEndDate = formatDateDisplay(endDate);

      inputRef.current.value = options.singleDatePicker
        ? formattedStartDate
        : `${formattedStartDate} ${options.locale.separator} ${formattedEndDate}`;
    }
  };

  // Effect for initial setup
  useEffect(() => {
    updateCalendars();
    if (options.autoUpdateInput) {
      updateInputText();
    }
  }, []);

  // Effect for updating input when dates change
  useEffect(() => {
    if (options.autoUpdateInput) {
      updateInputText();
    }
    updateCalendars();
  }, [startDate, endDate]);

  // Refs for DOM elements
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  return (
    <div className="daterangepicker-container">
      {options.showInputField ? (
        <div className={`drp-input ${options.inputContainerClassName || ''}`}>
          <div className="drp-icon-left">{options.icon}</div>
          <input
            type="text"
            ref={inputRef}
            style={{ border: 'none', outline: 'none' }}
            className={props.inputClassName}
            placeholder={props.placeholder || 'Select date range'}
            aria-label={props.ariaLabel || 'Date range selector'}
          />
        </div>
      ) : (
        <div className="entry-label">
          <div className="drp-icon-left">{options.icon}</div>
          <span>Select date range</span>
        </div>
      )}
    </div>
  );
};

export default memo(DateRangePicker);
