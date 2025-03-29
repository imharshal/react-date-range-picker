/*eslint-disable*/
import React, { memo, useMemo } from 'react';
import CustomSelect from './CustomSelect'; // Import the CustomSelect component

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

    // Let utility class handle generating month options
    return utils.getCalendarDropdownOptions(moment);
  }, [showDropdowns, utils, moment]);

  // Convert monthOptions and yearOptions to the format expected by CustomSelect
  const monthSelectOptions = useMemo(() => {
    if (!monthOptions.length) return [];

    return monthOptions.map((option) => ({
      value: option.props.value,
      label: option.props.children,
      disabled: option.props.disabled || false,
    }));
  }, [monthOptions]);

  const yearSelectOptions = useMemo(() => {
    if (!yearOptions.length) return [];

    return yearOptions.map((option) => ({
      value: option.props.value,
      label: option.props.children,
      disabled: option.props.disabled || false,
    }));
  }, [yearOptions]);

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

  // Check if utils is available and has the required method
  if (!utils || typeof utils.buildDayMatrix !== 'function') {
    console.error('utils.buildDayMatrix is not a function', utils);
    return <div>Calendar Error: Missing utility functions</div>;
  }

  const dayMatrix = utils.buildDayMatrix(month);

  // Use the utility for checking date states
  const isDateDisabled = (day) => {
    return utils.isDateDisabled(day, minDate, maxDate);
  };

  // Check if date is in preview range (between start and hover date)
  const isInPreviewRange = (day) => {
    if (!isSelecting || !startDate || !hoverDate) return false;

    return utils.isDateInRange(
      day,
      hoverDate.isAfter(startDate) ? startDate : hoverDate,
      hoverDate.isAfter(startDate) ? hoverDate : startDate
    );
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
        />

        {showDropdowns ? (
          <div className="month-dropdowns">
            <CustomSelect
              value={month.month()}
              options={monthSelectOptions}
              onChange={handleMonthChange}
              className="monthselect"
              ariaLabel="Select month"
            />
            <CustomSelect
              value={month.year()}
              options={yearSelectOptions}
              onChange={handleYearChange}
              className="yearselect"
              ariaLabel="Select year"
            />
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
        />
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            {dayMatrix.weekdaysShort.map((weekday) => (
              <th key={weekday} className="week-day">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayMatrix.daysMatrix.map((week, i) => (
            <tr key={i} className="week">
              {week.map((day) => {
                const isOffDay = day.month() !== month.month();
                const isDisabled = isDateDisabled(day);
                const isToday = day.isSame(moment(), 'day');
                const isStartDate = startDate && day.isSame(startDate, 'day');
                const isEndDate = endDate && day.isSame(endDate, 'day');
                const isInRange =
                  !isOffDay && utils.isDateInRange(day, startDate, endDate);
                const isPreview = isSelecting && isInPreviewRange(day);

                // Get class names using utility
                const classNames = utils.getDateClassNames({
                  isOffDay,
                  isDisabled,
                  isToday,
                  isStartDate,
                  isEndDate,
                  isInRange,
                  isPreview,
                });

                // Format date for accessibility using the provided format
                const dateLabel = utils.formatDate(day, 'MMMM D, YYYY');

                return (
                  <td
                    key={day.format('YYYY-MM-DD')}
                    className={classNames}
                    onClick={() => !isDisabled && !isOffDay && onDateClick(day)}
                    onMouseEnter={() =>
                      !isDisabled &&
                      !isOffDay &&
                      onDateHover &&
                      onDateHover(day)
                    }
                    aria-label={dateLabel}
                    aria-selected={isStartDate || isEndDate}
                    tabIndex={isOffDay || isDisabled ? -1 : 0}
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
