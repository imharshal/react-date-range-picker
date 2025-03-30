// DateRangePicker.stories.jsx
import React, { useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarDay } from 'react-icons/fa';
import moment from 'moment-timezone';

import './storybook-styles.css';

export default {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: `
# React Date Range Picker

A flexible and feature-rich date range picker for React applications.

## Features
- Single date or range selection
- Time picker support
- Customizable themes and styling
- Predefined ranges
- Timezone support
- Responsive design
- Keyboard navigation
        `,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
        { name: 'colorful', value: '#f0f8ff' },
      ],
    },
  },
  argTypes: {
    // Core functionality
    onApply: { action: 'applied' },
    onCancel: { action: 'cancelled' },
    disabled: {
      control: 'boolean',
      defaultValue: false,
      description: 'Disable the date picker',
    },

    // Display options
    theme: {
      control: { type: 'select', options: ['default', 'blue', 'dark', 'flat'] },
      defaultValue: 'default',
      description: 'Theme preset to use',
    },
    placeholder: {
      control: 'text',
      defaultValue: 'Select date range',
      description: 'Placeholder text',
    },

    // Styling
    inputClassName: {
      control: 'text',
      description: 'Custom CSS class for the input',
    },

    // Options category
    'options.singleDatePicker': {
      control: 'boolean',
      defaultValue: false,
      description: 'Select a single date instead of a range',
    },
    'options.showInputField': {
      control: 'boolean',
      defaultValue: true,
      description: 'Show the input field',
    },
    'options.timePicker': {
      control: 'boolean',
      defaultValue: false,
      description: 'Enable time selection',
    },
    'options.timePicker24Hour': {
      control: 'boolean',
      defaultValue: false,
      description: 'Use 24-hour time format',
    },
    'options.autoApply': {
      control: 'boolean',
      defaultValue: false,
      description: 'Auto-apply dates when selected',
    },
    'options.linkedCalendars': {
      control: 'boolean',
      defaultValue: true,
      description: 'Link calendars together',
    },
    'options.showDropdowns': {
      control: 'boolean',
      defaultValue: true,
      description: 'Show month/year dropdown selectors',
    },
    'options.opens': {
      control: { type: 'select', options: ['left', 'center', 'right'] },
      defaultValue: 'right',
      description: 'Where the picker opens relative to input',
    },
    'options.drops': {
      control: { type: 'select', options: ['up', 'down', 'auto'] },
      defaultValue: 'auto',
      description: 'Dropdown direction',
    },
    'options.showTooltip': {
      control: 'boolean',
      defaultValue: false,
      description: 'Show tooltip with selected dates',
    },
    'options.alwaysShowCalendars': {
      control: 'boolean',
      defaultValue: false,
      description: 'Always show calendar, not just on custom range',
    },
  },
};

// Default Template
const Template = (args) => {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      chosenLabel: range.chosenLabel,
    });
    args.onApply(range);
  };

  // Extract options from args
  const options = {
    singleDatePicker: args['options.singleDatePicker'],
    showInputField: args['options.showInputField'],
    timePicker: args['options.timePicker'],
    timePicker24Hour: args['options.timePicker24Hour'],
    autoApply: args['options.autoApply'],
    linkedCalendars: args['options.linkedCalendars'],
    showDropdowns: args['options.showDropdowns'],
    opens: args['options.opens'],
    drops: args['options.drops'],
    showTooltip: args['options.showTooltip'],
    alwaysShowCalendars: args['options.alwaysShowCalendars'],
  };

  return (
    <div className="story-container">
      <h3>Live Interactive Demo</h3>
      <p className="story-description">
        Click the date picker to interact with it and see the selected values
        below. Modify controls in the Storybook panel to experiment with
        different options.
      </p>

      <div className="date-picker-container">
        <DateRangePicker
          {...args}
          options={options}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleApply}
        />
      </div>

      <div className="selection-info">
        <h4>Current Selection:</h4>
        {dateRange.startDate && dateRange.endDate && (
          <>
            <p>
              <strong>Start Date:</strong>{' '}
              {dateRange.startDate.format('MMMM D, YYYY')}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {dateRange.endDate.format('MMMM D, YYYY')}
            </p>
            {dateRange.chosenLabel && (
              <p>
                <strong>Selected Range:</strong> {dateRange.chosenLabel}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Basic usage
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Select date range',
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default configuration with basic options.',
    },
  },
};

// Single Date Picker
export const SingleDatePicker = Template.bind({});
SingleDatePicker.args = {
  placeholder: 'Select a date',
  'options.singleDatePicker': true,
  'options.autoApply': true,
};
SingleDatePicker.parameters = {
  docs: {
    description: {
      story:
        'Single date picker configuration that auto-applies the selection.',
    },
  },
};

// Date Time Picker
export const DateTimePicker = Template.bind({});
DateTimePicker.args = {
  placeholder: 'Select date and time',
  'options.timePicker': true,
  'options.timePicker24Hour': true,
};
DateTimePicker.parameters = {
  docs: {
    description: {
      story: 'Date picker with time selection in 24-hour format.',
    },
  },
};

// Custom Themed
export const CustomThemed = (args) => {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
    });
    args.onApply(range);
  };

  // Custom theme
  const customTheme = {
    primary: '#4a6cf7',
    secondary: '#f0f4ff',
    background: '#ffffff',
    text: '#333333',
    border: '#e2e8f0',
    hover: '#edf2ff',
  };

  // Extract options from args
  const options = {
    singleDatePicker: args['options.singleDatePicker'],
    showInputField: args['options.showInputField'],
    timePicker: args['options.timePicker'],
    timePicker24Hour: args['options.timePicker24Hour'],
    autoApply: args['options.autoApply'],
    linkedCalendars: args['options.linkedCalendars'],
    showDropdowns: args['options.showDropdowns'],
    opens: args['options.opens'],
    drops: args['options.drops'],
    showTooltip: args['options.showTooltip'],
    alwaysShowCalendars: args['options.alwaysShowCalendars'],
    icon: <FaCalendarCheck />,
    tooltip: {
      show: true,
      showSelectedRange: true,
    },
  };

  return (
    <div className="story-container">
      <h3>Custom Theme Example</h3>
      <p className="story-description">
        This example demonstrates a custom themed date picker with a custom
        icon.
      </p>

      <div className="date-picker-container">
        <DateRangePicker
          {...args}
          options={options}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleApply}
          theme="default"
          customTheme={customTheme}
        />
      </div>

      <div className="selection-info">
        <h4>Current Selection:</h4>
        {dateRange.startDate && dateRange.endDate && (
          <>
            <p>
              <strong>Start:</strong>{' '}
              {dateRange.startDate.format('MMMM D, YYYY')}
            </p>
            <p>
              <strong>End:</strong> {dateRange.endDate.format('MMMM D, YYYY')}
            </p>
          </>
        )}
      </div>

      <div className="theme-preview">
        <h4>Custom Theme Colors:</h4>
        <div className="color-swatches">
          {Object.entries(customTheme).map(([key, color]) => (
            <div key={key} className="color-swatch">
              <div
                className="color-preview"
                style={{ backgroundColor: color }}
              ></div>
              <span>
                {key}: {color}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Custom Ranges
export const CustomRanges = (args) => {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
    chosenLabel: 'Last 7 Days',
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      chosenLabel: range.chosenLabel,
    });
    args.onApply(range);
  };

  // Define custom ranges
  const customRanges = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
    'Q1 2023': [moment('2023-01-01'), moment('2023-03-31')],
    'Q2 2023': [moment('2023-04-01'), moment('2023-06-30')],
    'Q3 2023': [moment('2023-07-01'), moment('2023-09-30')],
    'Q4 2023': [moment('2023-10-01'), moment('2023-12-31')],
  };

  // Extract options from args
  const options = {
    singleDatePicker: false, // Custom ranges need range selection
    showRanges: true,
    alwaysShowCalendars: true,
    icon: <FaCalendarDay />,
  };

  return (
    <div className="story-container">
      <h3>Custom Date Ranges</h3>
      <p className="story-description">
        This example shows custom predefined date ranges that users can select
        from.
      </p>

      <div className="date-picker-container">
        <DateRangePicker
          options={options}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleApply}
          ranges={customRanges}
        />
      </div>

      <div className="selection-info">
        <h4>Current Selection:</h4>
        {dateRange.startDate && dateRange.endDate && (
          <>
            <p>
              <strong>Range Name:</strong> {dateRange.chosenLabel}
            </p>
            <p>
              <strong>Start:</strong>{' '}
              {dateRange.startDate.format('MMMM D, YYYY')}
            </p>
            <p>
              <strong>End:</strong> {dateRange.endDate.format('MMMM D, YYYY')}
            </p>
            <p>
              <strong>Duration:</strong>{' '}
              {dateRange.endDate.diff(dateRange.startDate, 'days') + 1} days
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Fully Featured Example
export const AdvancedConfiguration = (args) => {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      chosenLabel: range.chosenLabel,
    });
    args.onApply(range);
  };

  // Custom ranges
  const customRanges = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
  };

  // Advanced options
  const options = {
    showDropdowns: true,
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 10,
    showTooltip: true,
    alwaysShowCalendars: true,
    opens: 'center',
    autoApply: false,
    linkedCalendars: true,
    minDate: moment().subtract(1, 'year'),
    maxDate: moment().add(1, 'year'),
    icon: <FaCalendarAlt />,
    tooltip: {
      show: true,
      showSelectedRange: true,
      contentClassName: 'custom-tooltip',
    },
    locale: {
      format: 'YYYY-MM-DD HH:mm',
      applyLabel: 'Apply Selection',
      cancelLabel: 'Clear',
      customRangeLabel: 'Custom Period',
    },
  };

  // Custom theme
  const customTheme = {
    primary: '#3f51b5',
    secondary: '#e8eaf6',
    background: '#ffffff',
    text: '#424242',
    border: '#d1d9ff',
    hover: '#f5f5f5',
  };

  return (
    <div className="story-container">
      <h3>Advanced Configuration</h3>
      <p className="story-description">
        This fully-featured example demonstrates most capabilities of the date
        range picker, including time selection, custom ranges, tooltips, and
        custom styling.
      </p>

      <div className="date-picker-container">
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleApply}
          onCancel={() => console.log('Selection cancelled')}
          options={options}
          ranges={customRanges}
          theme="default"
          customTheme={customTheme}
          timeZone="America/New_York"
        />
      </div>

      <div className="selection-info">
        <h4>Current Selection:</h4>
        {dateRange.startDate && dateRange.endDate && (
          <>
            <p>
              <strong>Start:</strong>{' '}
              {dateRange.startDate.format('YYYY-MM-DD HH:mm')}
            </p>
            <p>
              <strong>End:</strong>{' '}
              {dateRange.endDate.format('YYYY-MM-DD HH:mm')}
            </p>
            {dateRange.chosenLabel && (
              <p>
                <strong>Range:</strong> {dateRange.chosenLabel}
              </p>
            )}
          </>
        )}
      </div>

      <div className="feature-list">
        <h4>Features Demonstrated:</h4>
        <ul>
          <li>Time picker with 24-hour format</li>
          <li>Custom date ranges</li>
          <li>Tooltips</li>
          <li>Custom theme</li>
          <li>Min/max date restrictions</li>
          <li>Custom locale settings</li>
          <li>Custom positioning (centered)</li>
          <li>Custom icon</li>
        </ul>
      </div>
    </div>
  );
};
