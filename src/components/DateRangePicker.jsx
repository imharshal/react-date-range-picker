import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import moment from 'moment-timezone';
import Calendar from './Calendar';
import TimePicker from './TimePicker';
import RangeSelector from './RangeSelector';
import DateRangePickerUtils from '../utils/DateRangePickerUtils';
import ThemeHandler from '../utils/ThemeHandler';
import '../styles/styles.scss';

// Wrap the component with forwardRef to allow ref forwarding
const DateRangePicker = forwardRef(({ onApply, onCancel, ...props }, ref) => {
  const { theme = 'default', customTheme = {} } = props; // Default theme

  // Memoize timeZone to prevent recalculation
  const timeZone = useMemo(
    () => props.timeZone || moment.tz.guess(),
    [props.timeZone]
  );

  // Create utility instance once
  const utils = useMemo(() => new DateRangePickerUtils(), []);

  // Create theme handler instance
  const themeHandler = useMemo(() => new ThemeHandler(), []);

  // Apply theme styles
  const themeStyles = useMemo(
    () => themeHandler.getStyles(theme, customTheme),
    [theme, customTheme, themeHandler]
  );

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

  // state to track whether the calendar is ready to be visible
  const [isPositioned, setIsPositioned] = useState(false);
  // Optimize state initialization with lazy initializers
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
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
  const [chosenLabel, setChosenLabel] = useState(
    props.options?.chosenLabel || ''
  );
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
  const displayRef = useRef(null);

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
        e.target !== inputRef.current &&
        !displayRef.current?.contains(e.target)
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

      // Use provided label or fall back to current chosenLabel
      const finalChosenLabel = _chosenLabel || chosenLabel;
      setChosenLabel(finalChosenLabel);

      setIsSelecting(false);
      setHoverDate(null);

      if (onApply) {
        onApply({
          startDate: finalStartDate,
          endDate: finalEndDate,
          chosenLabel: finalChosenLabel,
        });
      }

      setIsOpen(false);
    },
    [onApply, chosenLabel]
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
      if (props.disabled) return;
      setIsOpen((prev) => !prev);
    },
    [props.disabled]
  );

  // Enhanced tooltip positioning - UPDATED
  const adjustTooltipPosition = useCallback(() => {
    // Use setTimeout to ensure tooltip is rendered in DOM
    setTimeout(() => {
      const tooltips = displayRef.current?.querySelectorAll('.drp-tooltip');
      if (!tooltips?.length) return;

      tooltips.forEach((tooltip) => {
        // Get parent element (trigger element) position
        const parentRect = displayRef.current.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Reset any inline styles from previous positioning
        tooltip.style.removeProperty('left');
        tooltip.style.removeProperty('right');
        tooltip.style.removeProperty('transform');

        // Remove edge classes
        tooltip.classList.remove('edge-left', 'edge-right');

        // Default center positioning
        let positionStyle = {
          left: '50%',
          transform: 'translateX(-50%)',
        };

        // Calculate boundaries
        const tooltipLeft =
          parentRect.left + parentRect.width / 2 - tooltipRect.width / 2;
        const tooltipRight = tooltipLeft + tooltipRect.width;

        // Check for edge collisions
        if (tooltipLeft < 10) {
          // Handle left edge collision
          tooltip.classList.add('edge-left');
          positionStyle = {
            left: '0',
            transform: 'translateX(0)',
          };
        } else if (tooltipRight > viewportWidth - 10) {
          // Handle right edge collision
          tooltip.classList.add('edge-right');
          positionStyle = {
            right: '0',
            left: 'auto',
            transform: 'translateX(0)',
          };
        }

        // Apply calculated positioning
        Object.assign(tooltip.style, positionStyle);
      });
    }, 10); // Small delay to ensure tooltip is in DOM
  }, []);

  // Effect for window resize - ADDED
  useEffect(() => {
    const handleResize = () => {
      if (!isOpen) adjustTooltipPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustTooltipPosition, isOpen]);

  // Effect to position tooltip on first appearance - ADDED
  useEffect(() => {
    if (!isOpen && (options.showTooltip || options.tooltip?.show)) {
      adjustTooltipPosition();
    }
  }, [
    isOpen,
    options.showTooltip,
    options.tooltip?.show,
    adjustTooltipPosition,
  ]);

  // Effect to handle position adjustments for overlay drp-main
  useEffect(() => {
    if (isOpen && containerRef.current && displayRef.current) {
      // Reset position state at the beginning of positioning calculation
      setIsPositioned(false);

      // Force the container to render at its natural width first
      if (containerRef.current) {
        // Save original styles properly
        const originalTop = containerRef.current.style.top;
        const originalLeft = containerRef.current.style.left;
        const originalRight = containerRef.current.style.right;

        // Set temporary positioning to measure natural dimensions
        containerRef.current.style.top = '0';
        containerRef.current.style.left = '0';
        containerRef.current.style.right = 'auto';

        // Get actual dimensions after positioning temporarily
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Restore original styles properly
        containerRef.current.style.top = originalTop;
        containerRef.current.style.left = originalLeft;
        containerRef.current.style.right = originalRight;

        // Get input element position relative to viewport
        const inputRect = displayRef.current.getBoundingClientRect();

        // Get scroll position
        const scrollX =
          window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY =
          window.pageYOffset || document.documentElement.scrollTop;

        // Get viewport dimensions
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate available space below and above
        const spaceBelow = viewportHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;

        // Determine appropriate drop direction
        let drops = options.drops;

        // Logic for "auto" mode
        if (drops === 'auto') {
          // Only open upward if necessary based on available space
          if (spaceBelow < containerHeight && spaceAbove >= containerHeight) {
            drops = 'up';
          }
          // If it doesn't fit either way, choose the side with more space
          else if (
            spaceBelow < containerHeight &&
            spaceAbove < containerHeight
          ) {
            drops = spaceAbove > spaceBelow ? 'up' : 'down';
          } else {
            drops = 'down'; // Default to down when there's enough space
          }
        }

        // Calculate position based on drop direction
        let containerTop;
        if (drops === 'up') {
          // Position calendar above with a modest offset
          containerTop = inputRect.top - containerHeight;
        } else {
          containerTop = inputRect.bottom;
        }

        // Set dropUp state
        setDropUp(drops === 'up');

        // Handle horizontal positioning (opens)
        let containerLeft;

        switch (options.opens) {
          case 'left':
            containerLeft = Math.max(0, inputRect.right - containerWidth);
            break;

          case 'center':
            containerLeft = Math.max(
              0,
              inputRect.left + inputRect.width / 2 - containerWidth / 2
            );
            if (containerLeft + containerWidth > viewportWidth) {
              containerLeft = Math.max(0, viewportWidth - containerWidth - 10);
            }
            break;

          default: // right
            containerLeft = inputRect.left;
            if (containerLeft + containerWidth > viewportWidth) {
              containerLeft = Math.max(0, viewportWidth - containerWidth - 10);
            }
            break;
        }

        // Apply final position with scroll offset
        const finalPosition = {
          top: containerTop + scrollY,
          left: containerLeft + scrollX,
          right: undefined,
        };

        setPosition(finalPosition);

        // Mark as positioned immediately - no timeout
        setIsPositioned(true);
      }
    } else if (!isOpen) {
      // Reset positioned state when closing
      setIsPositioned(false);
    }
  }, [isOpen, options.opens, options.drops, chosenLabel, showCalendars]);

  const handleDateClick = useCallback(
    (date) => {
      const customRangeLabel =
        options.locale?.customRangeLabel || 'Custom Range';

      // If single date picker, just set and apply if needed
      if (options.singleDatePicker) {
        handleSetStartDate(date);
        if (options.autoApply) {
          applyChanges(date, date, customRangeLabel);
        }
        return;
      }

      // If "Custom Range" is selected, allow both start and end selection
      if (chosenLabel === customRangeLabel) {
        if (!isSelecting) {
          // First click: set start, begin selecting
          handleSetStartDate(date);
          setEndDate(date.clone());
          setIsSelecting(true);
        } else {
          // Second click: set end, stop selecting
          setIsSelecting(false);
          let newStart = startDate;
          let newEnd = endDate;
          if (date.isBefore(startDate)) {
            newEnd = startDate.clone();
            newStart = date.clone();
            setEndDate(newEnd);
            handleSetStartDate(newStart);
          } else {
            newEnd = date.clone();
            setEndDate(newEnd);
          }
          setHoverDate(null);
          // Only apply if autoApply is true
          if (options.autoApply) {
            applyChanges(newStart, newEnd, chosenLabel);
          }
          // If autoApply is false, wait for Apply button
        }
        return;
      }

      // For other ranges, keep old logic
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
        let newStart = startDate;
        let newEnd = endDate;
        if (date.isBefore(startDate)) {
          newEnd = startDate.clone();
          newStart = date.clone();
          setEndDate(newEnd);
          handleSetStartDate(newStart);
        } else {
          newEnd = date.clone();
          setEndDate(newEnd);
        }
        setHoverDate(null);
        if (options.autoApply) {
          applyChanges(newStart, newEnd, chosenLabel);
        }
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

    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleRangeClick = useCallback(
    (start, end, label) => {
      const customRangeLabel =
        options.locale?.customRangeLabel || 'Custom Range';

      if (label === customRangeLabel) {
        setChosenLabel(label);
        setIsSelecting(false); // Ensure not in selection mode
        setShowCalendars(true);
      } else {
        if (start && end) {
          // Set dates and ensure chosenLabel is updated immediately
          const momentStart = getMoment(start);
          const momentEnd = getMoment(end);
          setStartDate(momentStart);
          setEndDate(momentEnd);
          setUserStartDate(momentStart);
          setUserEndDate(momentEnd);
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

    // Match initial dates to a predefined range and set chosenLabel accordingly
    if (!chosenLabel && showRanges && !options.singleDatePicker && ranges) {
      const displayFormat = getDisplayFormat();
      let matched = false;

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
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [
    handleOutsideClick,
    updateCalendars,
    options.autoUpdateInput,
    updateInputText,
    chosenLabel,
    showRanges,
    options.singleDatePicker,
    ranges,
    startDate,
    endDate,
    getDisplayFormat,
    options.locale?.customRangeLabel,
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
    // Prevent label reset while selecting custom range or when calendar is open for custom range
    const customRangeLabel = options.locale?.customRangeLabel || 'Custom Range';
    if ((isSelecting && chosenLabel === customRangeLabel) || (chosenLabel === customRangeLabel && showCalendars)) {
      return;
    }

    // Prioritize explicitly provided chosenLabel from props (important for showInputField=false cases)
    if (props.options?.chosenLabel) {
      setChosenLabel(props.options.chosenLabel);
      return;
    }

    // Otherwise match based on dates
    if (showRanges && !options.singleDatePicker && ranges) {
      let matched = false;
      const displayFormat = getDisplayFormat();

      if (!options.autoUpdateRanges) {
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
          setChosenLabel(customRangeLabel);
          if (!options.alwaysShowCalendars) {
            setShowCalendars(true);
          }
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
    options.autoUpdateRanges,
    options.alwaysShowCalendars,
    getDisplayFormat,
    props.options?.chosenLabel,
    isSelecting,
    chosenLabel,
    showCalendars,
  ]);

  // Effect for showing/hiding calendars
  useEffect(() => {
    // Early return if the picker is not open
    if (!isOpen) {
      setShowCalendars(false);
      return;
    }

    const customRangeLabel = options.locale?.customRangeLabel || 'Custom Range';

    // Determine when to show calendars
    const shouldShowCalendars =
      options.alwaysShowCalendars ||
      options.singleDatePicker ||
      (chosenLabel && chosenLabel === customRangeLabel) ||
      !showRanges;

    setShowCalendars(shouldShowCalendars);
  }, [
    isOpen,
    chosenLabel,
    showRanges,
    options.alwaysShowCalendars,
    options.singleDatePicker,
    options.locale?.customRangeLabel,
  ]);

  // Expose refs to parent component via the forwarded ref
  useImperativeHandle(
    ref,
    () => ({
      // Expose container element (input/trigger)
      container: displayRef.current,
      // Expose dropdown element ref
      dropdown: containerRef.current,
      // Expose Input element ref
      input: inputRef.current,
      // Expose useful methods
      isOpen: () => isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),

      // Expose date values
      getStartDate: () => startDate,
      getEndDate: () => endDate,

      // Expose date format and moment object
      getDisplayFormat: () => getDisplayFormat(),
      getMoment: () => getMoment(),

      // Expose setters
      setStartDate: (date) => handleSetStartDate(date),
      setEndDate: (date) => handleSetEndDate(date),
    }),
    [
      isOpen,
      startDate,
      endDate,
      getMoment,
      getDisplayFormat,
      handleSetStartDate,
      handleSetEndDate,
    ]
  );

  return (
    <>
      <div
        {...options.mainContainerAttr}
        ref={displayRef}
        className={`drp-main-container ${options.mainContainerClassName} ${
          props.disabled ? 'drp-disabled' : ''
        }`}
        onMouseEnter={adjustTooltipPosition}
        style={themeStyles}
      >
        {options.showInputField ? (
          <div
            {...options.inputContainerAttr}
            className={`drp-input ${options.inputContainerClassName ?? ''}`}
          >
            <div className="drp-icon-left">{options.icon}</div>
            <input
              {...options.inputAttr}
              type="text"
              ref={inputRef}
              style={{ border: 'none', outline: 'none', ...options.inputStyle }}
              className={props.inputClassName ?? ''}
              readOnly
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
          <div
            {...options.labelContainerAttr}
            className={`entry-label ${options.labelContainerClassName ?? ''}`}
            onClick={toggle}
          >
            <div className={`drp-icon-left ${options.iconClassName ?? ''}`}>
              {options.icon}
            </div>
            <span className={options.labelClassName ?? ''}>
              {options.showFullDateRangeLabel || options.singleDatePicker
                ? originalSelectedRangeLabel
                : chosenLabel ||
                  options.locale?.customRangeLabel ||
                  'Custom Range'}
            </span>
          </div>
        )}
        {(options.showTooltip || options.tooltip?.show) && !isOpen && (
          <div
            {...options.tooltip?.containerAttr}
            className={`drp-tooltip ${
              options.tooltip?.containerClassName ?? ''
            }`}
            style={{
              position: 'absolute',
              zIndex: 1000,
              top: '100%',
              marginTop: '5px',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
          >
            {options.tooltip?.showSelectedRange && (
              <div className={`drp-icon-left ${options.iconClassName ?? ''}`}>
                {options.icon}
              </div>
            )}
            <div
              className={`drp-tooltip-content ${
                options.tooltip?.contentClassName ?? ''
              }`}
            >
              {options.tooltip?.content || options.tooltip?.showSelectedRange
                ? selectedRangeLabel
                : props.placeholder}
            </div>
          </div>
        )}
      </div>
      {isOpen &&
        createPortal(
          <div
            style={{
              ...themeStyles,
              position: 'absolute',
              top: position.top,
              left: position.left !== undefined ? position.left : 'auto',
              right: position.right !== undefined ? position.right : 'auto',
              opacity: isPositioned ? 1 : 0, // Only show when positioned
              transition: isPositioned ? 'opacity 0.15s ease-in' : 'none',
              visibility: isOpen ? 'visible' : 'hidden',
            }}
            ref={containerRef}
            className={`drp-main 
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
                        <div
                          className={`drp-icon-left ${options.iconClassName}`}
                        >
                          {options.icon}
                        </div>
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
                    onClick={() =>
                      applyChanges(startDate, endDate, chosenLabel)
                    }
                    disabled={!endDate || startDate.isAfter(endDate)}
                    type="button"
                  >
                    {options.locale?.applyLabel || 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
});

// Add display name for debugging
DateRangePicker.displayName = 'DateRangePicker';

export default memo(DateRangePicker);
