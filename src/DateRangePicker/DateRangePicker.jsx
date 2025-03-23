/*eslint-disable*/
import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import moment from 'moment-timezone';
import Calendar from './Calendar';
import TimePicker from './TimePicker';
import RangeSelector from './RangeSelector';
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

  // Default ranges
  const defaultRanges = {
    Today: [getMoment(), getMoment()],
    Yesterday: [
      getMoment().subtract(1, 'days'),
      getMoment().subtract(1, 'days'),
    ],
    'Last 7 Days': [getMoment().subtract(6, 'days'), getMoment()],
    'Last 30 Days': [getMoment().subtract(29, 'days'), getMoment()],
    'This Month': [getMoment().startOf('month'), getMoment().endOf('month')],
    'Last Month': [
      getMoment().subtract(1, 'month').startOf('month'),
      getMoment().subtract(1, 'month').endOf('month'),
    ],
  };

  // Show ranges configuration
  const showRanges =
    options.showRanges !== undefined
      ? options.showRanges
      : !options.singleDatePicker && (props.ranges !== undefined || true);

  const ranges = showRanges ? props.ranges || defaultRanges : {};

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

  // Drag selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  // Refs for DOM elements
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return '';
    return date.format(getDisplayFormat());
  };

  // Effect for initial setup
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    updateCalendars();

    if (options.autoUpdateInput) {
      updateInputText();
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Effect for updating input when dates change
  useEffect(() => {
    if (options.autoUpdateInput) {
      updateInputText();
    }
    updateCalendars();
  }, [startDate, endDate]);

  // Effect to determine active range based on current date selection
  useEffect(() => {
    if (showRanges && !options.singleDatePicker && ranges) {
      // Look for an exact match with predefined ranges
      let matched = false;

      Object.entries(ranges).forEach(([label, [rangeStart, rangeEnd]]) => {
        if (
          startDate.format('YYYY-MM-DD') === rangeStart.format('YYYY-MM-DD') &&
          endDate.format('YYYY-MM-DD') === rangeEnd.format('YYYY-MM-DD')
        ) {
          setChosenLabel(label);
          matched = true;
        }
      });

      // If no match was found, set to custom range
      if (!matched && isOpen) {
        setChosenLabel(options.locale?.customRangeLabel || 'Custom Range');
        if (!options.alwaysShowCalendars) {
          setShowCalendars(true);
        }
      }
    }
  }, [startDate, endDate, isOpen]);

  // Effect for showing/hiding calendars
  useEffect(() => {
    if (isOpen) {
      if (options.alwaysShowCalendars || options.singleDatePicker) {
        setShowCalendars(true);
      } else {
        // Show calendars if Custom Range is selected, otherwise hide them
        const customRangeLabel =
          options.locale?.customRangeLabel || 'Custom Range';
        setShowCalendars(chosenLabel === customRangeLabel);
      }
    }
  }, [isOpen, chosenLabel, options.alwaysShowCalendars]);

  // Function to update input width based on content
  const updateInputWidth = () => {
    if (inputRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = getComputedStyle(inputRef.current).font;
      const updatedWidth =
        context.measureText(inputRef.current.value).width + 30;
      inputRef.current.style.width = `${updatedWidth}px`;
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
      updateInputWidth();
    }
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

  // Handle outside click
  const handleOutsideClick = (e) => {
    if (
      isOpen &&
      containerRef.current &&
      !containerRef.current.contains(e.target) &&
      e.target !== inputRef.current
    ) {
      setIsOpen(false);
    }
  };

  // Toggle datepicker
  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if we need to display the calendar above the input
    if (!isOpen && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - inputRect.bottom;
      const calendarHeight = 300; // approximate height of calendar

      setDropUp(spaceBelow < calendarHeight);
    }

    setIsOpen((prev) => !prev);
  };

  // Handle date click with drag selection support
  const handleDateClick = (date) => {
    const customRangeLabel = options.locale?.customRangeLabel || 'Custom Range';

    if (options.singleDatePicker) {
      // Single date picker behavior - just set the date
      handleSetStartDate(date);
      if (options.autoApply) {
        applyChanges(date, date, customRangeLabel);
      }
      return;
    }

    if (options.autoApply && chosenLabel !== customRangeLabel) {
      applyChanges(startDate, endDate, chosenLabel);
    }

    if (!isSelecting) {
      // First click - start selection
      handleSetStartDate(date);
      setEndDate(date.clone());
      setIsSelecting(true);
    } else {
      // Second click - end selection
      setIsSelecting(false);

      // Ensure start date is before end date
      if (date.isBefore(startDate)) {
        setEndDate(startDate.clone());
        handleSetStartDate(date);
      } else {
        handleSetEndDate(date);
      }

      setHoverDate(null);
    }
  };

  // Handle date hover for range preview
  const handleDateHover = (date) => {
    if (!isSelecting) return;
    setHoverDate(date);
  };

  // Set start date
  const handleSetStartDate = (date) => {
    const newDate = getMoment(date);

    if (!options.timePicker) {
      newDate.startOf('day');
    }

    setStartDate(newDate);

    if (options.singleDatePicker) {
      setEndDate(newDate.clone());
      setUserEndDate(newDate.clone());
    } else if (newDate.isAfter(endDate)) {
      // If the new start date is after the end date, adjust the end date
      setEndDate(newDate.clone());
      setUserStartDate(newDate.clone());
    }
  };

  // Set end date
  const handleSetEndDate = (date) => {
    const newDate = getMoment(date);

    if (!options.timePicker) {
      newDate.endOf('day');
    }

    setEndDate(newDate);

    if (newDate.isBefore(startDate)) {
      // If the new end date is before the start date, adjust the start date
      setStartDate(newDate.clone());
    }
  };

  // Apply changes
  const applyChanges = (_startDate, _endDate, _chosenLabel) => {
    // Make sure startDate is before endDate
    const finalStartDate = _startDate.isBefore(_endDate)
      ? _startDate
      : _endDate;
    const finalEndDate = _startDate.isBefore(_endDate) ? _endDate : _startDate;

    setStartDate(finalStartDate);
    setEndDate(finalEndDate);

    // setting main container labels
    setUserStartDate(finalStartDate);
    setUserEndDate(finalEndDate);

    // Reset selection state
    setIsSelecting(false);
    setHoverDate(null);

    if (props.onApply) {
      props.onApply({
        startDate: finalStartDate,
        endDate: finalEndDate,
        chosenLabel: _chosenLabel,
      });
    }

    if (options.autoUpdateInput) {
      updateInputText();
    }

    setIsOpen(false);
  };

  // Cancel changes
  const cancelChanges = () => {
    // Reset selection state
    setIsSelecting(false);
    setHoverDate(null);
    setIsOpen(false);

    if (props.onCancel) {
      props.onCancel();
    }
  };

  // Handle range click
  const handleRangeClick = (start, end, label) => {
    const customRangeLabel = options.locale?.customRangeLabel || 'Custom Range';

    if (label === customRangeLabel) {
      // If Custom Range is clicked, show the calendars but don't apply yet
      setChosenLabel(label);
      setShowCalendars(true);
    } else {
      // For predefined ranges, set the dates and auto-apply
      if (start && end) {
        setStartDate(getMoment(start));
        setEndDate(getMoment(end));
        setChosenLabel(label);
      }
      setIsOpen(false);
      applyChanges(getMoment(start), getMoment(end), label);
    }
  };

  const originalSelectedRangeLabel = useMemo(
    () =>
      options.singleDatePicker
        ? formatDateDisplay(userStartDate)
        : `${formatDateDisplay(userStartDate)} ${
            options.locale.separator
          } ${formatDateDisplay(userEndDate)}`,
    [
      options.singleDatePicker,
      userStartDate,
      userEndDate,
      options.locale.separator,
    ]
  );

  const selectedRangeLabel = useMemo(
    () =>
      options.singleDatePicker
        ? formatDateDisplay(startDate)
        : `${formatDateDisplay(startDate)} ${
            options.locale.separator
          } ${formatDateDisplay(endDate)}`,
    [options.singleDatePicker, startDate, endDate, options.locale.separator]
  );

  return (
    <div className="daterangepicker-container">
      {options.showInputField ? (
        <div className={`drp-input ${options.inputContainerClassName}`}>
          <div className="drp-icon-left">{options.icon}</div>
          <input
            type="text"
            ref={inputRef}
            style={{ border: 'none', outline: 'none' }}
            className={props.inputClassName}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggle(e);
              }
            }}
            placeholder={props.placeholder || 'Select date range'}
            aria-label={props.ariaLabel || 'Date range selector'}
            aria-haspopup="true"
            aria-expanded={isOpen}
          />
        </div>
      ) : (
        <div className="entry-label" onClick={toggle}>
          <div className="drp-icon-left">{options.icon}</div>
          <span>
            {options.showFullDateRangeLabel || options.singleDatePicker
              ? originalSelectedRangeLabel
              : chosenLabel}
          </span>
        </div>
      )}
      {isOpen && (
        <div
          ref={containerRef}
          className={`daterangepicker 
            ${options.opens || 'right'} 
            ${dropUp ? 'drop-up' : 'drop-down'} 
            ${showRanges && !options.singleDatePicker ? 'show-ranges' : ''}
            ${options.singleDatePicker ? 'single' : ''} 
            ${options.timePicker ? 'has-time-picker' : ''}
            ${isSelecting ? 'selecting' : ''}
            ${showCalendars ? 'show-calendar' : ''}`}
        >
          <div className="drp-content">
            {showRanges && !options.singleDatePicker && (
              <RangeSelector
                ranges={ranges}
                locale={options.locale}
                onRangeClick={handleRangeClick}
                activeRangeLabel={chosenLabel}
              />
            )}
            {showCalendars && (
              <div className="drp-right-container">
                <>
                  <div className="drp-selected-container">
                    <span className="drp-selected">
                      <div className="drp-icon-left">{options.icon}</div>
                      {selectedRangeLabel}
                    </span>
                  </div>

                  <div className="drp-calendar-container">
                    <div className="drp-calendar left">
                      <Calendar
                        month={leftCalendarMonth}
                        minDate={
                          options.minDate
                            ? getMoment(options.minDate)
                            : undefined
                        }
                        maxDate={
                          options.maxDate
                            ? getMoment(options.maxDate)
                            : undefined
                        }
                        startDate={startDate}
                        endDate={endDate}
                        hoverDate={hoverDate}
                        isSelecting={isSelecting}
                        onDateClick={handleDateClick}
                        onDateHover={handleDateHover}
                        onMonthChange={(month) =>
                          setLeftCalendarMonth(getMoment(month))
                        }
                        isLeft={true}
                        showDropdowns={options.showDropdowns}
                        utils={utils}
                        locale={options.locale}
                        moment={getMoment}
                        dateFormat={baseDateFormat}
                      />

                      {options.timePicker && (
                        <TimePicker
                          selected={startDate}
                          onChange={handleSetStartDate}
                          timePicker24Hour={options.timePicker24Hour}
                          timePickerIncrement={options.timePickerIncrement}
                          timePickerSeconds={options.timePickerSeconds}
                          minDate={
                            options.minDate
                              ? getMoment(options.minDate)
                              : undefined
                          }
                          maxDate={
                            options.maxDate
                              ? getMoment(options.maxDate)
                              : undefined
                          }
                          moment={getMoment}
                          timeFormat={timeFormat}
                        />
                      )}
                    </div>

                    {!options.singleDatePicker && (
                      <div className="drp-calendar right">
                        <Calendar
                          month={rightCalendarMonth}
                          minDate={
                            options.minDate
                              ? getMoment(options.minDate)
                              : undefined
                          }
                          maxDate={
                            options.maxDate
                              ? getMoment(options.maxDate)
                              : undefined
                          }
                          startDate={startDate}
                          endDate={endDate}
                          hoverDate={hoverDate}
                          isSelecting={isSelecting}
                          onDateClick={handleDateClick}
                          onDateHover={handleDateHover}
                          onMonthChange={(month) =>
                            setRightCalendarMonth(getMoment(month))
                          }
                          isLeft={false}
                          showDropdowns={options.showDropdowns}
                          utils={utils}
                          locale={options.locale}
                          moment={getMoment}
                          dateFormat={baseDateFormat}
                        />

                        {options.timePicker && (
                          <TimePicker
                            selected={endDate}
                            onChange={handleSetEndDate}
                            timePicker24Hour={options.timePicker24Hour}
                            timePickerIncrement={options.timePickerIncrement}
                            timePickerSeconds={options.timePickerSeconds}
                            minDate={startDate}
                            maxDate={
                              options.maxDate
                                ? getMoment(options.maxDate)
                                : undefined
                            }
                            moment={getMoment}
                            timeFormat={timeFormat}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </>
              </div>
            )}
          </div>

          {showCalendars && !options.autoApply && (
            <div className="drp-buttons">
              <div className="drp-button-group">
                <button
                  className={`drp-btn drp-btn-default ${options.cancelButtonClasses}`}
                  onClick={cancelChanges}
                  type="button"
                >
                  {options.locale?.cancelLabel || 'Cancel'}
                </button>
                <button
                  className={`drp-btn drp-btn-primary ${options.applyButtonClasses}`}
                  onClick={() => applyChanges(startDate, endDate, chosenLabel)}
                  disabled={!endDate || startDate.isAfter(endDate)}
                  type="button"
                >
                  {options.locale?.applyLabel || 'Apply'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(DateRangePicker);
