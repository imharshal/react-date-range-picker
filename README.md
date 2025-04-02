# @imharshal/react-date-range-picker

[Link to Live Demo (Storybook)](https://imharshal.github.io/react-date-range-picker)

A flexible, feature-rich date range picker component for React applications with modern design, extensive configuration options, and timezone customizations. This library supports single and range date selection, time pickers, custom themes, and more.

[![npm version](https://img.shields.io/npm/v/@imharshal/react-date-range-picker)](https://www.npmjs.com/package/@imharshal/react-date-range-picker) [![npm downloads](https://img.shields.io/npm/dm/@imharshal/react-date-range-picker)](https://www.npmjs.com/package/@imharshal/react-date-range-picker) [![license](https://img.shields.io/npm/l/@imharshal/react-date-range-picker)](https://www.npmjs.com/package/@imharshal/react-date-range-picker)

---

## Table of Contents

- [@imharshal/react-date-range-picker](#imharshalreact-date-range-picker)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [TypeScript Support](#typescript-support)
    - [`DateRangePickerProps`](#daterangepickerprops)
    - [`DateRangePickerOptions`](#daterangepickeroptions)
  - [Props and Options](#props-and-options)
    - [Core Props](#core-props)
    - [Options (via `options` prop)](#options-via-options-prop)
    - [Tooltip Options (via `options.tooltip`)](#tooltip-options-via-optionstooltip)
    - [Customization Props](#customization-props)
  - [Advanced Examples](#advanced-examples)
    - [Single Date Picker](#single-date-picker)
    - [Time Picker](#time-picker)
    - [Custom Ranges](#custom-ranges)
    - [Custom Theme](#custom-theme)
    - [Disabled Picker](#disabled-picker)
    - [Localization Example](#localization-example)
    - [Tooltip Example](#tooltip-example)
    - [Programmatic Control with Ref Forwarding](#programmatic-control-with-ref-forwarding)
    - [Available Methods via Ref](#available-methods-via-ref)
  - [Predefined Ranges](#predefined-ranges)
  - [Localization](#localization)
  - [Events](#events)
    - [`onApply`](#onapply)
    - [`onCancel`](#oncancel)
  - [Styling and Customization](#styling-and-customization)
  - [Browser Support](#browser-support)
  - [Dependencies](#dependencies)
  - [Troubleshooting](#troubleshooting)
    - [Issue: The picker does not open](#issue-the-picker-does-not-open)
    - [Issue: Incorrect date format](#issue-incorrect-date-format)
    - [Issue: Time picker not working](#issue-time-picker-not-working)
    - [Issue: Predefined ranges not showing](#issue-predefined-ranges-not-showing)
    - [Issue: Dates not updating in parent component](#issue-dates-not-updating-in-parent-component)
    - [Issue: Calendar doesn't open/close properly](#issue-calendar-doesnt-openclose-properly)
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [License](#license)

---

## Features

- **Flexible Date Selection**: Single date or date range selection
- **Time Picker**: Optional time selection with 12/24 hour format support
- **Predefined Ranges**: Built-in common ranges (Today, Last 7 Days, etc.)
- **Custom Ranges**: Define your own named date ranges
- **Theme Support**: Default theme with customization options
- **Timezone Awareness**: Works with any timezone using moment-timezone
- **Responsive Positioning**: Smart positioning based on available screen space
- **Locale Support**: Customizable date formats and labels
- **Auto-resize Input**: Input field that adjusts to content width
- **Mobile Friendly**: Responsive design works on all devices
- **Keyboard Navigation**: Accessible keyboard controls
- **Extensive Customization**: Configure almost any aspect of appearance and behavior
- **Programmatic Control**: Ref forwarding for controlling the picker programmatically
- **Tooltip Support**: Configurable tooltips for additional context

---

## Installation

Install the library using npm or yarn:

```bash
npm install @imharshal/react-date-range-picker
```

or

```bash
yarn add @imharshal/react-date-range-picker
```

---

## Basic Usage

```jsx
import React from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';

const App = () => {
  const handleApply = ({ startDate, endDate, chosenLabel }) => {
    console.log('Selected Range:', startDate, endDate, chosenLabel);
  };

  return (
    <DateRangePicker onApply={handleApply} placeholder="Select a date range" />
  );
};

export default App;
```

---

## TypeScript Support

This library includes TypeScript support for better type safety and developer experience. Below are the interfaces for the `DateRangePicker` component and its options:

### `DateRangePickerProps`

```typescript
interface DateRangePickerProps {
  // Core functionality
  startDate?: Date | string | moment.Moment;
  endDate?: Date | string | moment.Moment;
  onApply?: (range: {
    startDate: moment.Moment;
    endDate: moment.Moment;
    chosenLabel: string;
  }) => void;
  onCancel?: () => void;

  // Display and behavior
  timeZone?: string;
  theme?: string;
  customTheme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    border?: string;
    hover?: string;
    [key: string]: string;
  };
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;

  // Styling
  inputClassName?: string;

  // Ranges
  ranges?: {
    [key: string]: [moment.Moment, moment.Moment];
  };

  // Advanced configuration
  options?: DateRangePickerOptions;
}
```

### `DateRangePickerOptions`

```typescript
interface DateRangePickerOptions {
  // Selection behavior
  singleDatePicker?: boolean;
  autoApply?: boolean;
  linkedCalendars?: boolean;
  autoUpdateInput?: boolean;
  alwaysShowCalendars?: boolean;

  // Display settings
  showInputField?: boolean;
  showFullDateRangeLabel?: boolean;
  showDropdowns?: boolean;
  showCustomRangeLabel?: boolean;
  showRanges?: boolean;

  // Time related
  timePicker?: boolean;
  timePicker24Hour?: boolean;
  timePickerIncrement?: number;
  timePickerSeconds?: boolean;

  // Positioning
  opens?: 'left' | 'center' | 'right';
  drops?: 'up' | 'down' | 'auto';

  // Date restrictions
  minDate?: Date | string | moment.Moment;
  maxDate?: Date | string | moment.Moment;

  // Custom styling
  icon?: React.ReactNode;
  buttonClasses?: string;
  applyButtonClasses?: string;
  cancelButtonClasses?: string;
  mainContainerClassName?: string;
  inputContainerClassName?: string;
  labelContainerClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  inputStyle?: React.CSSProperties;

  // Custom attributes
  mainContainerAttr?: object;
  inputContainerAttr?: object;
  labelContainerAttr?: object;
  inputAttr?: object;

  // Tooltip
  showTooltip?: boolean;
  tooltip?: {
    show?: boolean;
    showSelectedRange?: boolean;
    content?: React.ReactNode;
    containerClassName?: string;
    contentClassName?: string;
    containerAttr?: object;
  };

  // Localization
  locale?: {
    format?: string;
    separator?: string;
    applyLabel?: string;
    cancelLabel?: string;
    customRangeLabel?: string;
    [key: string]: string;
  };
}
```

These interfaces provide a comprehensive overview of all the props and options supported by the `DateRangePicker` component, making it easier to integrate into TypeScript projects.

---

## Props and Options

### Core Props

| Prop          | Type     | Default               | Description                                             |
| ------------- | -------- | --------------------- | ------------------------------------------------------- |
| `onApply`     | Function | `null`                | Callback when the user applies the selected date range. |
| `onCancel`    | Function | `null`                | Callback when the user cancels the selection.           |
| `startDate`   | Moment   | `null`                | Initial start date.                                     |
| `endDate`     | Moment   | `null`                | Initial end date.                                       |
| `timeZone`    | String   | Auto-detected         | Timezone for date calculations.                         |
| `placeholder` | String   | `'Select date range'` | Placeholder text for the input field.                   |
| `disabled`    | Boolean  | `false`               | Disables the date picker.                               |

### Options (via `options` prop)

| Option                | Type    | Default           | Description                                                             |
| --------------------- | ------- | ----------------- | ----------------------------------------------------------------------- |
| `singleDatePicker`    | Boolean | `false`           | Enables single date selection mode.                                     |
| `timePicker`          | Boolean | `false`           | Enables time selection.                                                 |
| `timePicker24Hour`    | Boolean | `false`           | Enables 24-hour time format.                                            |
| `timePickerIncrement` | Number  | `5`               | Time picker increment in minutes.                                       |
| `timePickerSeconds`   | Boolean | `false`           | Enables seconds selection in the time picker.                           |
| `showInputField`      | Boolean | `true`            | Displays an input field for the date range.                             |
| `showRanges`          | Boolean | `true`            | Displays predefined ranges.                                             |
| `ranges`              | Object  | Predefined Ranges | Custom predefined ranges.                                               |
| `locale`              | Object  | `{}`              | Localization options (e.g., `format`, `separator`, `applyLabel`, etc.). |
| `minDate`             | Moment  | `null`            | Minimum selectable date.                                                |
| `maxDate`             | Moment  | `null`            | Maximum selectable date.                                                |
| `autoApply`           | Boolean | `false`           | Automatically applies the selection without requiring a button click.   |
| `alwaysShowCalendars` | Boolean | `false`           | Always shows the calendars.                                             |
| `opens`               | String  | `'right'`         | Position of the picker (`'left'`, `'right'`, `'center'`).               |
| `drops`               | String  | `'auto'`          | Drop direction (`'up'`, `'down'`, `'auto'`).                            |

### Tooltip Options (via `options.tooltip`)

| Option               | Type      | Default | Description                                           |
| -------------------- | --------- | ------- | ----------------------------------------------------- |
| `show`               | Boolean   | `false` | Whether to show the tooltip.                          |
| `showSelectedRange`  | Boolean   | `false` | Whether to display the selected range in the tooltip. |
| `content`            | ReactNode | `null`  | Custom content to display in the tooltip.             |
| `containerClassName` | String    | `''`    | Custom class for the tooltip container.               |
| `contentClassName`   | String    | `''`    | Custom class for the tooltip content.                 |
| `containerAttr`      | Object    | `{}`    | Additional attributes for the tooltip container.      |

### Customization Props

| Prop                      | Type   | Default     | Description                                        |
| ------------------------- | ------ | ----------- | -------------------------------------------------- |
| `theme`                   | String | `'default'` | Theme name. Available Themes (`'light'`, `'dark'`) |
| `customTheme`             | Object | `{}`        | Custom theme styles.                               |
| `inputContainerClassName` | String | `''`        | Custom class for the input container field.        |
| `inputClassName`          | String | `''`        | Custom class for the input field.                  |
| `mainContainerClassName`  | String | `''`        | Custom class for the main container.               |

---

## Advanced Examples

### Single Date Picker

```jsx
<DateRangePicker
  options={{ singleDatePicker: true }}
  placeholder="Select a date"
/>
```

### Time Picker

```jsx
<DateRangePicker
  options={{
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 15,
  }}
/>
```

### Custom Ranges

```jsx
<DateRangePicker
  options={{
    ranges: {
      Today: [moment(), moment()],
      'This Week': [moment().startOf('week'), moment().endOf('week')],
    },
  }}
/>
```

### Custom Theme

```jsx
<DateRangePicker
  theme="custom"
  customTheme={{
    '--color-range-bg': '#f0f0f0',
    '--color-primary': '#333',
  }}
/>
```

### Disabled Picker

```jsx
<DateRangePicker disabled={true} placeholder="Picker is disabled" />
```

### Localization Example

```jsx
<DateRangePicker
  options={{
    locale: {
      format: 'DD/MM/YYYY',
      separator: ' to ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
    },
  }}
/>
```

### Tooltip Example

```jsx
<DateRangePicker
  options={{
    showTooltip: true,
    tooltip: {
      show: true,
      showSelectedRange: true,
      content: 'Select a date range',
      containerClassName: 'custom-tooltip-container',
      contentClassName: 'custom-tooltip-content',
    },
  }}
  placeholder="Hover to see tooltip"
/>
```

### Programmatic Control with Ref Forwarding

The `DateRangePicker` component supports ref forwarding, allowing you to programmatically control its behavior. Here's an example:

```jsx
import React, { useRef } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';

const App = () => {
  const pickerRef = useRef();

  const openPicker = () => {
    pickerRef.current.open();
  };

  const closePicker = () => {
    pickerRef.current.close();
  };

  const logSelectedDates = () => {
    console.log('Start Date:', pickerRef.current.getStartDate());
    console.log('End Date:', pickerRef.current.getEndDate());
  };

  return (
    <div>
      <button onClick={openPicker}>Open Picker</button>
      <button onClick={closePicker}>Close Picker</button>
      <button onClick={logSelectedDates}>Log Selected Dates</button>
      <DateRangePicker ref={pickerRef} placeholder="Select a date range" />
    </div>
  );
};

export default App;
```

### Available Methods via Ref

| Method               | Description                                     |
| -------------------- | ----------------------------------------------- |
| `open()`             | Opens the date range picker.                    |
| `close()`            | Closes the date range picker.                   |
| `toggle()`           | Toggles the open/close state of the picker.     |
| `isOpen()`           | Returns whether the picker is currently open.   |
| `getStartDate()`     | Returns the currently selected start date.      |
| `getEndDate()`       | Returns the currently selected end date.        |
| `getDisplayFormat()` | Returns the display format for the dates.       |
| `getMoment()`        | Returns the moment instance used by the picker. |
| `setStartDate(date)` | Sets the start date programmatically.           |
| `setEndDate(date)`   | Sets the end date programmatically.             |

---

## Predefined Ranges

By default, the following ranges are available:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- This Month
- Last Month

You can override these ranges using the `ranges` option.

---

## Localization

You can customize labels and formats using the `locale` option:

```jsx
<DateRangePicker
  options={{
    locale: {
      format: 'DD/MM/YYYY',
      separator: ' to ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
    },
  }}
/>
```

---

## Events

### `onApply`

Called when the user applies the selected date range.

```jsx
const handleApply = ({ startDate, endDate, chosenLabel }) => {
  console.log('Selected Range:', startDate, endDate, chosenLabel);
};
```

### `onCancel`

Called when the user cancels the selection.

```jsx
const handleCancel = () => {
  console.log('Selection canceled');
};
```

---

## Styling and Customization

The component includes default SCSS-based styling, which can be customized in the following ways:

1. **Theme Props**: Use the `theme` and `customTheme` props to apply predefined or custom themes.
2. **Custom CSS Classes**: Add your own CSS classes using props like `mainContainerClassName`, `inputClassName`, etc.
3. **Style Attributes**: Inline styles can be applied using props like `inputStyle`.

You can override the default styles by importing your own SCSS file or using the `customTheme` prop to define specific styles.

---

## Browser Support

The date range picker works in all modern browsers:

- Chrome
- Firefox
- Safari
- Edge
- Opera

---

## Dependencies

This library requires the following dependencies:

- **React 16.8+** (uses hooks)
- **moment-timezone**
- **react-dom** (for portals)

---

## Troubleshooting

### Issue: The picker does not open

- Ensure the `disabled` prop is not set to `true`.
- Verify that the `onClick` handler is not being overridden.

### Issue: Incorrect date format

- Check the `locale.format` option to ensure it matches your desired format.

### Issue: Time picker not working

- Ensure `timePicker` is set to `true` in the `options` prop.
- Verify that `timePicker24Hour` and `timePickerIncrement` are correctly configured.

### Issue: Predefined ranges not showing

- Ensure `showRanges` is set to `true` in the `options` prop.
- Verify that the `ranges` object is correctly defined.

### Issue: Dates not updating in parent component

- Ensure you're handling the `onApply` callback correctly.
- Check that you're updating your state with the new values.

### Issue: Calendar doesn't open/close properly

- Check the browser console for errors.
- Ensure you're not stopping event propagation incorrectly.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

---

## Credits

This library is inspired by:

- [Date Range Picker by Dan Grossman](https://www.daterangepicker.com/)
- [GitHub Repository: dangrossman/daterangepicker](https://github.com/dangrossman/daterangepicker)

---

## License

This project is licensed under the MIT License.
