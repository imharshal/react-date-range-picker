/*eslint-disable*/
import React, { memo, useState, useRef, useEffect } from 'react';
import CustomSelect from './CustomSelect';

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

  // Prepare options for hour select
  const hourOptions = (() => {
    const options = [];
    const start = timePicker24Hour ? 0 : 1;
    const end = timePicker24Hour ? 23 : 12;

    for (let i = start; i <= end; i++) {
      // Always use 24-hour value for comparison
      let hour24 = i;
      if (!timePicker24Hour) {
        const ampm = selected.format('A');
        if (ampm === 'PM' && i < 12) {
          hour24 = i + 12;
        } else if (ampm === 'AM' && i === 12) {
          hour24 = 0;
        }
      }

      let disabled = false;
      if (
        minDate &&
        maxDate &&
        selected.isSame(minDate, 'day') &&
        selected.isSame(maxDate, 'day')
      ) {
        if (hour24 < minDate.hour() || hour24 > maxDate.hour()) {
          disabled = true;
        }
      } else if (minDate && selected.isSame(minDate, 'day')) {
        if (hour24 < minDate.hour()) {
          disabled = true;
        }
      } else if (maxDate && selected.isSame(maxDate, 'day')) {
        if (hour24 > maxDate.hour()) {
          disabled = true;
        }
      } else {
        // Fallback for other days
        const time = selected.clone().hour(hour24);
        if (minDate && time.minute(59).second(59).isBefore(minDate)) {
          disabled = true;
        }
        if (maxDate && time.minute(0).second(0).isAfter(maxDate)) {
          disabled = true;
        }
      }

      options.push({
        value: i,
        label: i.toString(),
        disabled,
      });
    }

    return options;
  })();

  // Prepare options for minute select
  const minuteOptions = (() => {
    const options = [];
    const increment = timePickerIncrement || 5;

    for (let i = 0; i < 60; i += increment) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const time = selected.clone().minute(i);
      const disabled =
        (minDate && time.second(59).isBefore(minDate)) ||
        (maxDate && time.second(0).isAfter(maxDate));

      options.push({
        value: i,
        label: padded,
        disabled,
      });
    }

    return options;
  })();

  // Prepare options for second select
  const secondOptions = (() => {
    if (!timePickerSeconds) return [];

    const options = [];
    for (let i = 0; i < 60; i++) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const time = selected.clone().second(i);
      const disabled =
        (minDate && time.isBefore(minDate)) ||
        (maxDate && time.isAfter(maxDate));

      options.push({
        value: i,
        label: padded,
        disabled,
      });
    }

    return options;
  })();

  // Prepare options for AM/PM select
  const ampmOptions = [
    { value: 'AM', label: 'AM', disabled: false },
    { value: 'PM', label: 'PM', disabled: false },
  ];

  return (
    <div className="calendar-time">
      <CustomSelect
        className="hourselect"
        value={timePicker24Hour ? selected.hour() : selected.format('h')}
        options={hourOptions}
        onChange={handleHourChange}
        ariaLabel="Hour"
      />

      <span className="separator">:</span>

      <CustomSelect
        className="minuteselect"
        value={selected.minute()}
        options={minuteOptions}
        onChange={handleMinuteChange}
        ariaLabel="Minute"
      />

      {timePickerSeconds && (
        <>
          <span className="separator">:</span>
          <CustomSelect
            className="secondselect"
            value={selected.second()}
            options={secondOptions}
            onChange={handleSecondChange}
            ariaLabel="Second"
          />
        </>
      )}

      {!timePicker24Hour && (
        <CustomSelect
          className="ampmselect"
          value={selected.format('A')}
          options={ampmOptions}
          onChange={handleAmPmChange}
          ariaLabel="AM/PM"
        />
      )}
    </div>
  );
};

export default memo(TimePicker);
