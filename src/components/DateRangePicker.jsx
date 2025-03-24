import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
  useCallback,
} from 'react';
import moment from 'moment-timezone';
import Calendar from './Calendar';
import TimePicker from './TimePicker';
import RangeSelector from './RangeSelector';
import DateRangePickerUtils from '../utils/DateRangePickerUtils';
import '../styles/styles.scss';

const DateRangePicker = (props) => {
  // Memoize timeZone to prevent recalculation
  const timeZone = useMemo(
    () => props.timeZone || moment.tz.guess(),
    [props.timeZone]
  );

  // Create utility instance once
  const utils = useMemo(() => new DateRangePickerUtils(), []);

  // Create an optimized timezone-aware moment function
  const getMoment = useCallback(
    (date) => {
      if (date && moment.isMoment(date)) {
        return date.clone().tz(timeZone);
      }
      return date ? moment(date).tz(timeZone) : moment().tz(timeZone);
    },
    [timeZone]
  );

  // Memoize format settings
  const userProvidedFormat = props.options?.locale?.format;
  const baseDateFormat = useMemo(() => {
    const systemOrProvidedFormat =
      userProvidedFormat || utils.getSystemDateFormat();
    return utils.extractDateFormat(systemOrProvidedFormat);
  }, [userProvidedFormat, utils]);

  const timeFormat = useMemo(() => {
    return utils.extractTimeFormat(
      userProvidedFormat,
      props.options?.timePicker24Hour
    );
  }, [userProvidedFormat, props.options?.timePicker24Hour, utils]);

  // Memoize options to prevent unnecessary recreation
  const options = useMemo(
    () => ({
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
    }),
    [props.options, baseDateFormat]
  );

  // Memoize display format to avoid recalculations
  const getDisplayFormat = useCallback(() => {
    return utils.getDisplayFormat(
      baseDateFormat,
      timeFormat,
      options.timePicker,
      userProvidedFormat
    );
  }, [
    baseDateFormat,
    timeFormat,
    options.timePicker,
    userProvidedFormat,
    utils,
  ]);

  // Memoize default ranges
  const defaultRanges = useMemo(
    () => ({
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
    }),
    [getMoment]
  );

  // Memoize showRanges configuration
  const showRanges = useMemo(
    () =>
      options.showRanges !== undefined
        ? options.showRanges
        : !options.singleDatePicker && (props.ranges !== undefined || true),
    [options.showRanges, options.singleDatePicker, props.ranges]
  );

  const ranges = useMemo(
    () => (showRanges ? props.ranges || defaultRanges : {}),
    [showRanges, props.ranges, defaultRanges]
  );

  // Optimize state initialization with lazy initializers
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [userStartDate, setUserStartDate] = useState(() =>
    props.startDate ? getMoment(props.startDate) : getMoment()
  );
  const [userEndDate, setUserEndDate] = useState(() =>
    props.endDate ? getMoment(props.endDate) : getMoment()
  );
  const [startDate, setStartDate] = useState(() =>
    props.startDate ? getMoment(props.startDate) : getMoment()
  );
  const [endDate, setEndDate] = useState(() =>
    props.endDate ? getMoment(props.endDate) : getMoment()
  );
  const [chosenLabel, setChosenLabel] = useState('');
  const [showCalendars, setShowCalendars] = useState(
    options.alwaysShowCalendars
  );
  const [leftCalendarMonth, setLeftCalendarMonth] = useState(() =>
    getMoment(startDate)
  );
  const [rightCalendarMonth, setRightCalendarMonth] = useState(() =>
    getMoment(startDate).add(1, 'month')
  );

  // Drag selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  // Refs for DOM elements
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Memoize formatDateDisplay to prevent recreation
  const formatDateDisplay = useCallback(
    (date) => {
      if (!date) return getMoment().format(getDisplayFormat());
      return date.format(getDisplayFormat());
    },
    [getDisplayFormat, getMoment]
  );

  // Optimize updateInputWidth with useCallback
  const updateInputWidth = useCallback(() => {
    if (inputRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = getComputedStyle(inputRef.current).font;
      const updatedWidth =
        context.measureText(inputRef.current.value).width + 30;
      inputRef.current.style.width = `${updatedWidth}px`;
    }
  }, []);

  // Optimize updateInputText with useCallback
  const updateInputText = useCallback(() => {
    if (inputRef.current) {
      const formattedStartDate = formatDateDisplay(startDate);
      const formattedEndDate = formatDateDisplay(endDate);

      inputRef.current.value = options.singleDatePicker
        ? formattedStartDate
        : `${formattedStartDate} ${options.locale.separator} ${formattedEndDate}`;
      updateInputWidth();
    }
  }, [
    startDate,
    endDate,
    options.singleDatePicker,
    options.locale.separator,
    formatDateDisplay,
    updateInputWidth,
  ]);

  // Optimize updateCalendars with useCallback
  const updateCalendars = useCallback(() => {
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
  }, [startDate, endDate, options.linkedCalendars]);

  // Optimize handleOutsideClick with useCallback
  const handleOutsideClick = useCallback(
    (e) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        e.target !== inputRef.current
      ) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  // Optimize applyChanges with useCallback
  const applyChanges = useCallback(
    (_startDate, _endDate, _chosenLabel) => {
      // Make sure startDate is before endDate
      const finalStartDate = _startDate.isBefore(_endDate)
        ? _startDate
        : _endDate;
      const finalEndDate = _startDate.isBefore(_endDate)
        ? _endDate
        : _startDate;

      setStartDate(finalStartDate);
      setEndDate(finalEndDate);
      setUserStartDate(finalStartDate);
      setUserEndDate(finalEndDate);
      setIsSelecting(false);
      setHoverDate(null);

      if (props.onApply) {
        props.onApply({
          startDate: finalStartDate,
          endDate: finalEndDate,
          chosenLabel: _chosenLabel,
        });
      }

      setIsOpen(false);
    },
    [props.onApply]
  );

  // Optimize date setting functions with useCallback
  const handleSetStartDate = useCallback(
    (date) => {
      const newDate = getMoment(date);

      if (!options.timePicker) {
        newDate.startOf('day');
      }

      setStartDate(newDate);

      if (options.singleDatePicker) {
        setEndDate(newDate.clone());
        setUserEndDate(newDate.clone());
      } else if (newDate.isAfter(endDate)) {
        setEndDate(newDate.clone());
        setUserStartDate(newDate.clone());
      }
    },
    [getMoment, options.timePicker, options.singleDatePicker, endDate]
  );

  const handleSetEndDate = useCallback(
    (date) => {
      const newDate = getMoment(date);

      if (!options.timePicker) {
        newDate.endOf('day');
      }

      setEndDate(newDate);

      if (newDate.isBefore(startDate)) {
        setStartDate(newDate.clone());
      }
    },
    [getMoment, options.timePicker, startDate]
  );

  // Optimize handlers with useCallback
  const toggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isOpen && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - inputRect.bottom;
        const calendarHeight = 300; // approximate height of calendar

        setDropUp(spaceBelow < calendarHeight);
      }

      setIsOpen((prev) => !prev);
    },
    [isOpen]
  );

  const handleDateClick = useCallback(
    (date) => {
      const customRangeLabel =
        options.locale?.customRangeLabel || 'Custom Range';

      if (options.singleDatePicker) {
        handleSetStartDate(date);
        if (options.autoApply) {
          applyChanges(date, date, customRangeLabel);
        }
        return;
      }

      if (options.autoApply && chosenLabel !== customRangeLabel) {
        applyChanges(startDate, endDate, chosenLabel);
        return;
      }

      if (!isSelecting) {
        handleSetStartDate(date);
        setEndDate(date.clone());
        setIsSelecting(true);
      } else {
        setIsSelecting(false);

        if (date.isBefore(startDate)) {
          setEndDate(startDate.clone());
          handleSetStartDate(date);
        } else {
          handleSetEndDate(date);
        }

        setHoverDate(null);
      }
    },
    [
      options.singleDatePicker,
      options.locale?.customRangeLabel,
      options.autoApply,
      chosenLabel,
      isSelecting,
      startDate,
      endDate,
      handleSetStartDate,
      handleSetEndDate,
      applyChanges,
    ]
  );

  const handleDateHover = useCallback(
    (date) => {
      if (!isSelecting) return;
      setHoverDate(date);
    },
    [isSelecting]
  );

  const cancelChanges = useCallback(() => {
    setIsSelecting(false);
    setHoverDate(null);
    setIsOpen(false);

    if (props.onCancel) {
      props.onCancel();
    }
  }, [props.onCancel]);

  const handleRangeClick = useCallback(
    (start, end, label) => {
      const customRangeLabel =
        options.locale?.customRangeLabel || 'Custom Range';

      if (label === customRangeLabel) {
        setChosenLabel(label);
        setShowCalendars(true);
      } else {
        if (start && end) {
          setStartDate(getMoment(start));
          setEndDate(getMoment(end));
          setChosenLabel(label);
        }
        setIsOpen(false);
        applyChanges(getMoment(start), getMoment(end), label);
      }
    },
    [options.locale?.customRangeLabel, getMoment, applyChanges]
  );

  // Optimize selectedRangeLabels with useMemo
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
      formatDateDisplay,
    ]
  );

  const selectedRangeLabel = useMemo(
    () =>
      options.singleDatePicker
        ? formatDateDisplay(startDate)
        : `${formatDateDisplay(startDate)} ${
            options.locale.separator
          } ${formatDateDisplay(endDate)}`,
    [
      options.singleDatePicker,
      startDate,
      endDate,
      options.locale.separator,
      formatDateDisplay,
    ]
  );

  // Effect for initial setup with proper cleanup
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    updateCalendars();

    if (options.autoUpdateInput) {
      updateInputText();
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [
    handleOutsideClick,
    updateCalendars,
    options.autoUpdateInput,
    updateInputText,
  ]);

  // Effect for updating input when dates change
  useEffect(() => {
    if (options.autoUpdateInput) {
      updateInputText();
    }
    updateCalendars();
  }, [
    startDate,
    endDate,
    options.autoUpdateInput,
    updateInputText,
    updateCalendars,
  ]);

  // Effect to determine active range based on current date selection
  useEffect(() => {
    if (showRanges && !options.singleDatePicker && ranges) {
      let matched = false;
      const displayFormat = getDisplayFormat();

      Object.entries(ranges).forEach(([label, [rangeStart, rangeEnd]]) => {
        if (
          startDate.format(displayFormat) ===
            rangeStart.format(displayFormat) &&
          endDate.format(displayFormat) === rangeEnd.format(displayFormat)
        ) {
          setChosenLabel(label);
          matched = true;
        }
      });

      if (!matched) {
        setChosenLabel(options.locale?.customRangeLabel || 'Custom Range');
        if (!options.alwaysShowCalendars) {
          setShowCalendars(true);
        }
      }
    }
  }, [
    startDate,
    endDate,
    ranges,
    showRanges,
    options.singleDatePicker,
    options.locale?.customRangeLabel,
    options.alwaysShowCalendars,
    getDisplayFormat,
  ]);

  // Effect for showing/hiding calendars
  useEffect(() => {
    if (isOpen) {
      if (options.alwaysShowCalendars || options.singleDatePicker) {
        setShowCalendars(true);
      } else {
        const customRangeLabel =
          options.locale?.customRangeLabel || 'Custom Range';
        setShowCalendars(chosenLabel === customRangeLabel);
      }
    }
  }, [
    isOpen,
    chosenLabel,
    options.alwaysShowCalendars,
    options.singleDatePicker,
    options.locale?.customRangeLabel,
  ]);

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
