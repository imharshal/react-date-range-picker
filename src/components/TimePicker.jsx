/*eslint-disable*/
import React, { memo } from 'react';
import moment from 'moment';

const TimePicker = ({
  selected,
  onChange,
  timePicker24Hour,
  timePickerIncrement,
  timePickerSeconds,
  minDate,
  maxDate,
  moment,
}) => {
  if (!selected) return null;

  const handleHourChange = (e) => {
    let hour = parseInt(e.target.value, 10);

    // Convert 12-hour to 24-hour if needed
    if (!timePicker24Hour) {
      const ampm = selected.format('A');
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    }

    const newDate = selected.clone().hour(hour);
    onChange(newDate);
  };

  const handleMinuteChange = (e) => {
    const minute = parseInt(e.target.value, 10);
    const newDate = selected.clone().minute(minute);
    onChange(newDate);
  };

  const handleSecondChange = (e) => {
    const second = parseInt(e.target.value, 10);
    const newDate = selected.clone().second(second);
    onChange(newDate);
  };

  const handleAmPmChange = (e) => {
    const ampm = e.target.value;
    let hour = selected.hour();

    if (ampm === 'AM' && hour >= 12) hour -= 12;
    if (ampm === 'PM' && hour < 12) hour += 12;

    const newDate = selected.clone().hour(hour);
    onChange(newDate);
  };

  const renderHourOptions = () => {
    const hours = [];
    const start = timePicker24Hour ? 0 : 1;
    const end = timePicker24Hour ? 23 : 12;

    for (let i = start; i <= end; i++) {
      const value = i;
      let hour = i;

      // For 12-hour format, map the hours correctly
      if (!timePicker24Hour) {
        if (selected.hour() >= 12) {
          hour = i === 12 ? 12 : i;
        } else {
          hour = i === 12 ? 0 : i;
        }
      }

      const time = selected.clone().hour(hour);
      const disabled =
        (minDate && time.minute(59).isBefore(minDate)) ||
        (maxDate && time.minute(0).isAfter(maxDate));

      hours.push(
        <option key={i} value={value} disabled={disabled}>
          {value}
        </option>
      );
    }

    return hours;
  };

  const renderMinuteOptions = () => {
    const minutes = [];
    const increment = timePickerIncrement || 5;

    for (let i = 0; i < 60; i += increment) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const time = selected.clone().minute(i);
      const disabled =
        (minDate && time.second(59).isBefore(minDate)) ||
        (maxDate && time.second(0).isAfter(maxDate));

      minutes.push(
        <option key={i} value={i} disabled={disabled}>
          {padded}
        </option>
      );
    }

    return minutes;
  };

  const renderSecondOptions = () => {
    const seconds = [];

    for (let i = 0; i < 60; i++) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const time = selected.clone().second(i);
      const disabled =
        (minDate && time.isBefore(minDate)) ||
        (maxDate && time.isAfter(maxDate));

      seconds.push(
        <option key={i} value={i} disabled={disabled}>
          {padded}
        </option>
      );
    }

    return seconds;
  };

  return (
    <div className="calendar-time">
      <select
        className="hourselect"
        value={timePicker24Hour ? selected.hour() : selected.format('h')}
        onChange={handleHourChange}
        aria-label="Hour"
      >
        {renderHourOptions()}
      </select>

      <span className="separator">:</span>

      <select
        className="minuteselect"
        value={selected.minute()}
        onChange={handleMinuteChange}
        aria-label="Minute"
      >
        {renderMinuteOptions()}
      </select>

      {timePickerSeconds && (
        <>
          <span className="separator">:</span>
          <select
            className="secondselect"
            value={selected.second()}
            onChange={handleSecondChange}
            aria-label="Second"
          >
            {renderSecondOptions()}
          </select>
        </>
      )}

      {!timePicker24Hour && (
        <select
          className="ampmselect"
          value={selected.format('A')}
          onChange={handleAmPmChange}
          aria-label="AM/PM"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      )}
    </div>
  );
};

export default memo(TimePicker);
