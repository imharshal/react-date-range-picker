// Calendar.js
import React, { memo, useMemo } from 'react';

const Calendar = ({
  month,
  minDate,
  maxDate,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
  onMonthChange,
  isLeft,
  showDropdowns,
  utils,
  locale,
  moment, // Timezone-aware moment function
  isSelecting,
  dateFormat, // Date format for accessibility labels
}) => {
  // Use utils to format date consistently
  const monthName = useMemo(() => {
    // Format month name
    return month.format('MMMM');
  }, [month]);

  const year = month.year();

  // Generate month and year options using utilities
  const { monthOptions, yearOptions } = useMemo(() => {
    if (!showDropdowns) return { monthOptions: [], yearOptions: [] };

    // Generate month options
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(
        <option key={i} value={i}>
          {moment().month(i).format('MMMM')}
        </option>
      );
    }

    // Generate year options (10 years back, 10 years forward)
    const currentYear = moment().year();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return { monthOptions: months, yearOptions: years };
  }, [showDropdowns, moment]);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    const newDate = month.clone().month(newMonth);
    onMonthChange(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    const newDate = month.clone().year(newYear);
    onMonthChange(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = month.clone().subtract(1, 'month');
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = month.clone().add(1, 'month');
    onMonthChange(newDate);
  };

  // Build day matrix
  const buildDayMatrix = () => {
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
  };

  const { weekdaysShort, daysMatrix } = buildDayMatrix();

  // Use the utility for checking date states
  const isDateDisabled = (day) => {
    return (
      (minDate && day.isBefore(minDate, 'day')) ||
      (maxDate && day.isAfter(maxDate, 'day'))
    );
  };

  // Check if date is in preview range (between start and hover date)
  const isInPreviewRange = (day) => {
    if (!isSelecting || !startDate || !hoverDate) return false;

    const start = hoverDate.isAfter(startDate) ? startDate : hoverDate;
    const end = hoverDate.isAfter(startDate) ? hoverDate : startDate;

    return day.isSameOrAfter(start, 'day') && day.isSameOrBefore(end, 'day');
  };

  // Get class names for a date cell
  const getDateClassNames = (day) => {
    const isOffDay = day.month() !== month.month();
    const isDisabled = isDateDisabled(day);
    const isToday = day.isSame(moment(), 'day');
    const isStartDate = startDate && day.isSame(startDate, 'day');
    const isEndDate = endDate && day.isSame(endDate, 'day');
    const isInRange =
      !isOffDay &&
      startDate &&
      endDate &&
      day.isSameOrAfter(startDate, 'day') &&
      day.isSameOrBefore(endDate, 'day');
    const isPreview = isSelecting && isInPreviewRange(day);

    const classes = ['day'];

    if (isOffDay) classes.push('off');
    if (isDisabled) classes.push('disabled');
    if (isToday) classes.push('today');
    if (isStartDate) classes.push('start-date');
    if (isEndDate) classes.push('end-date');
    if (isInRange) classes.push('in-range');
    if (isPreview) classes.push('preview');

    return classes.join(' ');
  };

  return (
    <div className="calendar">
      <div className="month-header">
        <div
          className="month-navigation prev"
          onClick={handlePrevMonth}
          role="button"
          tabIndex={0}
          aria-label="Previous month"
        >
          «
        </div>

        {showDropdowns ? (
          <div className="month-dropdowns">
            <select
              value={month.month()}
              onChange={handleMonthChange}
              className="monthselect"
              aria-label="Select month"
            >
              {monthOptions}
            </select>
            <select
              value={month.year()}
              onChange={handleYearChange}
              className="yearselect"
              aria-label="Select year"
            >
              {yearOptions}
            </select>
          </div>
        ) : (
          <div className="month-name">
            {monthName} {year}
          </div>
        )}

        <div
          className="month-navigation next"
          onClick={handleNextMonth}
          role="button"
          tabIndex={0}
          aria-label="Next month"
        >
          »
        </div>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            {weekdaysShort.map((weekday) => (
              <th key={weekday} className="week-day">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysMatrix.map((week, i) => (
            <tr key={i} className="week">
              {week.map((day) => {
                const classNames = getDateClassNames(day);
                const dateLabel = day.format('MMMM D, YYYY');

                return (
                  <td
                    key={day.format('YYYY-MM-DD')}
                    className={classNames}
                    onClick={() => {
                      const isDisabled = isDateDisabled(day);
                      const isOffDay = day.month() !== month.month();
                      if (!isDisabled && !isOffDay) onDateClick(day);
                    }}
                    onMouseEnter={() => {
                      const isDisabled = isDateDisabled(day);
                      const isOffDay = day.month() !== month.month();
                      if (!isDisabled && !isOffDay && onDateHover)
                        onDateHover(day);
                    }}
                    aria-label={dateLabel}
                    aria-selected={
                      day.isSame(startDate, 'day') || day.isSame(endDate, 'day')
                    }
                    tabIndex={
                      day.month() !== month.month() || isDateDisabled(day)
                        ? -1
                        : 0
                    }
                  >
                    {day.date()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(Calendar);
