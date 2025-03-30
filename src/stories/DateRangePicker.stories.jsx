// DateRangePicker.stories.jsx
import React, { useState } from 'react';
import { DateRangePicker } from '@imharshal/react-date-range-picker';
import moment from 'moment-timezone';
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarDay,
  FaGlobe,
  FaUserClock,
} from 'react-icons/fa';

import './storybook-styles.css';

export default {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: `
# React Date Range Picker

A flexible, feature-rich date range picker for React applications with extensive configuration options.

## Key Features
- Date range or single date selection
- Time picker with 12/24 hour formats
- Predefined and custom ranges
- Themes and styling customization
- Timezone support
- Responsive design & positioning
`,
      },
    },
    viewMode: 'docs',
  },
  argTypes: {
    onApply: { action: 'applied' },
    onCancel: { action: 'cancelled' },
  },
};

// Helper to create source code for examples
const createSourceCode = (title, description, code) => {
  return `
// ${title}
// ${description}

${code}`;
};

// Base Template for most examples
const Template = (args) => {
  const [dateRange, setDateRange] = useState({
    startDate: args.startDate || moment().subtract(7, 'days'),
    endDate: args.endDate || moment(),
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      chosenLabel: range.chosenLabel,
    });
    args.onApply?.(range);
  };

  return (
    <div className="story-container">
      <DateRangePicker
        {...args}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApply={handleApply}
      />

      {args.showSelected && dateRange.startDate && dateRange.endDate && (
        <div className="selection-info">
          <h4>Current Selection:</h4>
          <p>
            <strong>Start Date:</strong>{' '}
            {dateRange.startDate.format(
              args.options?.locale?.format || 'MMMM D, YYYY'
            )}
          </p>
          <p>
            <strong>End Date:</strong>{' '}
            {dateRange.endDate.format(
              args.options?.locale?.format || 'MMMM D, YYYY'
            )}
          </p>
          {dateRange.chosenLabel && (
            <p>
              <strong>Range:</strong> {dateRange.chosenLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// 1. BASIC USAGE
export const BasicUsage = Template.bind({});
BasicUsage.args = {
  placeholder: 'Select date range',
  showSelected: true,
};
BasicUsage.parameters = {
  docs: {
    description: {
      story:
        'A simple date range picker with default configuration. This is the most basic implementation with start and end date selection.',
    },
    source: {
      code: createSourceCode(
        'Basic Date Range Picker',
        'Simple implementation with default settings',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import moment from 'moment-timezone';

function BasicExample() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment()
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
    console.log('Selected range:', range);
  };

  return (
    <DateRangePicker
      onApply={handleApply}
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      placeholder="Select date range"
    />
  );
}`
      ),
    },
  },
};

// 2. SINGLE DATE PICKER
export const SingleDatePicker = Template.bind({});
SingleDatePicker.args = {
  placeholder: 'Select a date',
  options: {
    singleDatePicker: true,
    autoApply: true,
  },
  showSelected: true,
};
SingleDatePicker.parameters = {
  docs: {
    description: {
      story:
        'Single date selection mode. Perfect for selecting a single date rather than a range. This example also uses auto-apply to immediately select the date when clicked.',
    },
    source: {
      code: createSourceCode(
        'Single Date Picker',
        'For selecting a single date with auto-apply',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import moment from 'moment-timezone';

function SingleDateExample() {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handleApply = (range) => {
    setSelectedDate(range.startDate);
    console.log('Selected date:', range.startDate.format('YYYY-MM-DD'));
  };

  return (
    <DateRangePicker
      onApply={handleApply}
      startDate={selectedDate}
      options={{
        singleDatePicker: true,
        autoApply: true
      }}
      placeholder="Select a date"
    />
  );
}`
      ),
    },
  },
};

// 3. DATE AND TIME PICKER
export const DateAndTimePicker = Template.bind({});
DateAndTimePicker.args = {
  placeholder: 'Select date and time',
  options: {
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 15,
    locale: {
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  showSelected: true,
};
DateAndTimePicker.parameters = {
  docs: {
    description: {
      story:
        'Date picker with time selection. This allows users to select both date and time values. This example shows a 24-hour format with 15-minute increments.',
    },
    source: {
      code: createSourceCode(
        'Date and Time Picker',
        'For selecting both date and time in 24-hour format',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import moment from 'moment-timezone';

function DateTimeExample() {
  const [dateTimeRange, setDateTimeRange] = useState({
    startDate: moment().subtract(1, 'days').hours(9).minutes(0),
    endDate: moment().hours(17).minutes(0)
  });

  const handleApply = (range) => {
    setDateTimeRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
    console.log('Start:', range.startDate.format('YYYY-MM-DD HH:mm'));
    console.log('End:', range.endDate.format('YYYY-MM-DD HH:mm'));
  };

  return (
    <DateRangePicker
      onApply={handleApply}
      startDate={dateTimeRange.startDate}
      endDate={dateTimeRange.endDate}
      options={{
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        locale: {
          format: 'YYYY-MM-DD HH:mm'
        }
      }}
      placeholder="Select date and time"
    />
  );
}`
      ),
    },
  },
};

// 4. CUSTOM PREDEFINED RANGES
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
    args.onApply?.(range);
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
    Q1: [moment().month(0).startOf('month'), moment().month(2).endOf('month')],
    Q2: [moment().month(3).startOf('month'), moment().month(5).endOf('month')],
    Q3: [moment().month(6).startOf('month'), moment().month(8).endOf('month')],
    Q4: [moment().month(9).startOf('month'), moment().month(11).endOf('month')],
  };

  return (
    <div className="story-container">
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApply={handleApply}
        ranges={customRanges}
        options={{
          alwaysShowCalendars: true,
          showCustomRangeLabel: true,
          icon: <FaCalendarDay />,
        }}
      />

      <div className="selection-info">
        <h4>Current Selection:</h4>
        <p>
          <strong>Range:</strong> {dateRange.chosenLabel}
        </p>
        <p>
          <strong>Start:</strong> {dateRange.startDate.format('MMMM D, YYYY')}
        </p>
        <p>
          <strong>End:</strong> {dateRange.endDate.format('MMMM D, YYYY')}
        </p>
        <p>
          <strong>Duration:</strong>{' '}
          {dateRange.endDate.diff(dateRange.startDate, 'days') + 1} days
        </p>
      </div>
    </div>
  );
};
CustomRanges.parameters = {
  docs: {
    description: {
      story:
        'Date picker with custom predefined date ranges. This allows users to quickly select common date ranges without manually selecting dates. You can define any ranges that make sense for your application.',
    },
    source: {
      code: createSourceCode(
        'Custom Predefined Ranges',
        'Offering quick selection of common date ranges',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import { FaCalendarDay } from 'react-icons/fa';
import moment from 'moment-timezone';

function CustomRangesExample() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
    chosenLabel: 'Last 7 Days'
  });

  // Define custom ranges
  const customRanges = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month')
    ],
    'Q1': [
      moment().month(0).startOf('month'),
      moment().month(2).endOf('month')
    ],
    'Q2': [
      moment().month(3).startOf('month'),
      moment().month(5).endOf('month')
    ],
    'Q3': [
      moment().month(6).startOf('month'),
      moment().month(8).endOf('month')
    ],
    'Q4': [
      moment().month(9).startOf('month'),
      moment().month(11).endOf('month')
    ]
  };

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      chosenLabel: range.chosenLabel
    });
  };

  return (
    <DateRangePicker
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onApply={handleApply}
      ranges={customRanges}
      options={{
        alwaysShowCalendars: true,
        showCustomRangeLabel: true,
        icon: <FaCalendarDay />
      }}
    />
  );
}`
      ),
    },
  },
};

// 5. DATE RESTRICTIONS
export const DateRestrictions = Template.bind({});
DateRestrictions.args = {
  placeholder: 'Select dates (restricted)',
  options: {
    minDate: moment().subtract(14, 'days'),
    maxDate: moment().add(14, 'days'),
    showDropdowns: true,
  },
  showSelected: true,
};
DateRestrictions.parameters = {
  docs: {
    description: {
      story:
        'Date picker with min/max date restrictions. This prevents users from selecting dates outside a valid range. Useful for booking systems, appointment scheduling, or any situation where there are time constraints.',
    },
    source: {
      code: createSourceCode(
        'Date Restrictions',
        'Limiting date selection with min/max constraints',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import moment from 'moment-timezone';

function DateRestrictionsExample() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(3, 'days'),
    endDate: moment().add(3, 'days')
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  return (
    <DateRangePicker
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onApply={handleApply}
      options={{
        minDate: moment().subtract(14, 'days'),
        maxDate: moment().add(14, 'days'),
        showDropdowns: true
      }}
      placeholder="Select dates (restricted)"
    />
  );
}`
      ),
    },
  },
};

// 6. CUSTOM THEMES AND STYLING
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
    args.onApply?.(range);
  };

  // Custom theme
  const customTheme = {
    primary: '#6200ea', // Deep purple
    secondary: '#ede7f6', // Light purple background
    background: '#ffffff', // White background
    text: '#424242', // Dark gray text
    border: '#d1c4e9', // Light purple border
    hover: '#f5f0ff', // Very light purple hover
  };

  return (
    <div className="story-container">
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApply={handleApply}
        theme="default"
        customTheme={customTheme}
        options={{
          icon: <FaCalendarAlt />,
          showTooltip: true,
          buttonClasses: 'custom-drp-btn',
          applyButtonClasses: 'custom-apply-btn',
          cancelButtonClasses: 'custom-cancel-btn',
        }}
        placeholder="Select with custom theme"
      />

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
CustomThemed.parameters = {
  docs: {
    description: {
      story:
        "Date picker with custom theme colors. This demonstrates how to customize the appearance to match your application's design system. You can control various aspects of the visual appearance through the customTheme prop.",
    },
    source: {
      code: createSourceCode(
        'Custom Themed Date Picker',
        'Customizing the visual appearance with a branded theme',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment-timezone';

function CustomThemedExample() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment()
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  // Custom theme colors
  const customTheme = {
    primary: '#6200ea',     // Deep purple
    secondary: '#ede7f6',   // Light purple background
    background: '#ffffff',  // White background
    text: '#424242',        // Dark gray text
    border: '#d1c4e9',      // Light purple border
    hover: '#f5f0ff'        // Very light purple hover
  };

  return (
    <DateRangePicker
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onApply={handleApply}
      theme="default"
      customTheme={customTheme}
      options={{
        icon: <FaCalendarAlt />,
        showTooltip: true,
        buttonClasses: 'custom-drp-btn',
        applyButtonClasses: 'custom-apply-btn',
        cancelButtonClasses: 'custom-cancel-btn'
      }}
      placeholder="Select with custom theme"
    />
  );
}`
      ),
    },
  },
};

// 7. LOCALIZATION & INTERNATIONALIZATION
export const LocalizedPicker = (args) => {
  // Initialize with French locale
  moment.locale('fr');

  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
    });
    args.onApply?.(range);
  };

  return (
    <div className="story-container">
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApply={handleApply}
        options={{
          locale: {
            format: 'DD/MM/YYYY',
            applyLabel: 'Appliquer',
            cancelLabel: 'Annuler',
            customRangeLabel: 'Plage personnalisée',
            separator: ' au ',
            daysOfWeek: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
            monthNames: [
              'Janvier',
              'Février',
              'Mars',
              'Avril',
              'Mai',
              'Juin',
              'Juillet',
              'Août',
              'Septembre',
              'Octobre',
              'Novembre',
              'Décembre',
            ],
          },
          icon: <FaGlobe />,
        }}
        placeholder="Sélectionner une période"
      />

      <div className="selection-info">
        <h4>Sélection actuelle:</h4>
        <p>
          <strong>Début:</strong> {dateRange.startDate.format('DD MMMM YYYY')}
        </p>
        <p>
          <strong>Fin:</strong> {dateRange.endDate.format('DD MMMM YYYY')}
        </p>
      </div>
    </div>
  );
};
LocalizedPicker.parameters = {
  docs: {
    description: {
      story:
        'Localized date picker in French. This demonstrates how to customize the date picker for different languages and date formats. You can translate all labels and change the date format to match regional preferences.',
    },
    source: {
      code: createSourceCode(
        'Localized Date Picker',
        'Translating the date picker to French',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import { FaGlobe } from 'react-icons/fa';
import moment from 'moment-timezone';
import 'moment/locale/fr';  // Import French locale

function LocalizedDatePickerExample() {
  // Set the locale to French
  moment.locale('fr');
  
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment()
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  return (
    <DateRangePicker
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onApply={handleApply}
      options={{
        locale: {
          format: 'DD/MM/YYYY',
          applyLabel: 'Appliquer',
          cancelLabel: 'Annuler',
          customRangeLabel: 'Plage personnalisée',
          separator: ' au ',
          daysOfWeek: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
          monthNames: [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
          ]
        },
        icon: <FaGlobe />
      }}
      placeholder="Sélectionner une période"
    />
  );
}`
      ),
    },
  },
};

// 8. DIFFERENT OPENING POSITIONS
export const OpeningPositions = () => {
  return (
    <div className="story-container">
      <div className="position-examples">
        <div className="position-example">
          <h4>Opens Right (Default)</h4>
          <DateRangePicker
            options={{
              opens: 'right',
            }}
            placeholder="Opens right"
          />
        </div>

        <div className="position-example">
          <h4>Opens Center</h4>
          <DateRangePicker
            options={{
              opens: 'center',
            }}
            placeholder="Opens center"
          />
        </div>

        <div className="position-example">
          <h4>Opens Left</h4>
          <DateRangePicker
            options={{
              opens: 'left',
            }}
            placeholder="Opens left"
          />
        </div>

        <div className="position-example">
          <h4>Drops Up</h4>
          <DateRangePicker
            options={{
              drops: 'up',
            }}
            placeholder="Drops upward"
          />
        </div>

        <div className="position-example">
          <h4>Drops Down</h4>
          <DateRangePicker
            options={{
              drops: 'down',
            }}
            placeholder="Drops downward"
          />
        </div>
      </div>
    </div>
  );
};
OpeningPositions.parameters = {
  docs: {
    description: {
      story:
        'Different opening positions and directions for the date picker. This is useful for ensuring the calendar fits well in your layout, especially near screen edges. The options include opening left, center, or right horizontally, and up or down vertically.',
    },
    source: {
      code: createSourceCode(
        'Opening Positions',
        'Controlling where the date picker calendar appears',
        `import React from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';

function OpeningPositionsExample() {
  return (
    <>
      <div>
        <h4>Opens Right (Default)</h4>
        <DateRangePicker
          options={{
            opens: 'right'
          }}
          placeholder="Opens right"
        />
      </div>
      
      <div>
        <h4>Opens Center</h4>
        <DateRangePicker
          options={{
            opens: 'center'
          }}
          placeholder="Opens center"
        />
      </div>
      
      <div>
        <h4>Opens Left</h4>
        <DateRangePicker
          options={{
            opens: 'left'
          }}
          placeholder="Opens left"
        />
      </div>

      <div>
        <h4>Drops Up</h4>
        <DateRangePicker
          options={{
            drops: 'up'
          }}
          placeholder="Drops upward"
        />
      </div>
    </>
  );
}`
      ),
    },
  },
};

// 9. AUTO-APPLY & LINKED CALENDAR CONFIGURATION
export const AutoApplyAndLinkedCalendars = () => {
  return (
    <div className="story-container">
      <div className="feature-comparison">
        <div className="feature-example">
          <h4>With Auto-Apply</h4>
          <p>Selection applies immediately when dates are clicked</p>
          <DateRangePicker
            options={{
              autoApply: true,
            }}
            placeholder="Auto-apply enabled"
          />
        </div>

        <div className="feature-example">
          <h4>Without Auto-Apply</h4>
          <p>Requires clicking Apply button to confirm selection</p>
          <DateRangePicker
            options={{
              autoApply: false,
            }}
            placeholder="Standard apply button"
          />
        </div>

        <div className="feature-example">
          <h4>Linked Calendars</h4>
          <p>Right calendar month follows left calendar</p>
          <DateRangePicker
            options={{
              linkedCalendars: true,
            }}
            placeholder="Linked calendars"
          />
        </div>

        <div className="feature-example">
          <h4>Unlinked Calendars</h4>
          <p>Calendars can show different months independently</p>
          <DateRangePicker
            options={{
              linkedCalendars: false,
            }}
            placeholder="Independent calendars"
          />
        </div>
      </div>
    </div>
  );
};
AutoApplyAndLinkedCalendars.parameters = {
  docs: {
    description: {
      story:
        'Auto-apply functionality and linked calendar behavior. Auto-apply immediately selects dates when clicked, without requiring an "Apply" button click. Linked calendars ensure the right calendar follows the left calendar when navigating months.',
    },
    source: {
      code: createSourceCode(
        'Auto-Apply and Linked Calendars',
        'Controlling selection behavior and calendar navigation',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';

function AutoApplyExample() {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
    // With auto-apply, this happens immediately when dates are clicked
  };

  return (
    <>
      <div>
        <h4>With Auto-Apply</h4>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleApply}
          options={{
            autoApply: true
          }}
          placeholder="Auto-apply enabled"
        />
      </div>
      
      <div>
        <h4>Linked Calendars</h4>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleApply}
          options={{
            linkedCalendars: true
          }}
          placeholder="Linked calendars"
        />
      </div>
    </>
  );
}`
      ),
    },
  },
};

// 10. TIMEZONE SUPPORT
export const TimezoneSupport = (args) => {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  });

  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
    });
    args.onApply?.(range);
  };

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  return (
    <div className="story-container">
      <div>
        <label htmlFor="timezone-select">Select Timezone: </label>
        <select
          id="timezone-select"
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          style={{
            padding: '8px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApply={handleApply}
        timeZone={selectedTimezone}
        options={{
          timePicker: true,
          icon: <FaUserClock />,
          locale: {
            format: 'YYYY-MM-DD HH:mm',
          },
        }}
        placeholder={`Date & time in ${selectedTimezone}`}
      />

      <div className="selection-info">
        <h4>Current Selection ({selectedTimezone}):</h4>
        <p>
          <strong>Start:</strong>{' '}
          {dateRange.startDate?.tz(selectedTimezone).format('YYYY-MM-DD HH:mm')}
        </p>
        <p>
          <strong>End:</strong>{' '}
          {dateRange.endDate?.tz(selectedTimezone).format('YYYY-MM-DD HH:mm')}
        </p>
      </div>
    </div>
  );
};
TimezoneSupport.parameters = {
  docs: {
    description: {
      story:
        'Date picker with timezone support. This demonstrates how to handle dates in different timezones, which is especially important for applications with users across multiple regions or for scheduling events in different parts of the world.',
    },
    source: {
      code: createSourceCode(
        'Timezone Support',
        'Working with dates in different timezones',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import { FaUserClock } from 'react-icons/fa';
import moment from 'moment-timezone';

function TimezoneSupportExample() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment()
  });

  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  return (
    <div>
      <div>
        <label htmlFor="timezone-select">Select Timezone: </label>
        <select 
          id="timezone-select"
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApply={handleApply}
        timeZone={selectedTimezone}
        options={{
          timePicker: true,
          icon: <FaUserClock />,
          locale: {
            format: 'YYYY-MM-DD HH:mm'
          }
        }}
        placeholder={\`Date & time in \${selectedTimezone}\`}
      />
    </div>
  );
}`
      ),
    },
  },
};

// 11. FORM INTEGRATION EXAMPLE
export const FormIntegration = () => {
  const [formData, setFormData] = useState({
    eventName: 'Team Meeting',
    dateRange: {
      startDate: moment().add(1, 'day').hours(10).minutes(0),
      endDate: moment().add(1, 'day').hours(11).minutes(30),
    },
    location: 'Conference Room',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Event Scheduled!\n${
        formData.eventName
      }\nFrom: ${formData.dateRange.startDate.format(
        'MMMM Do, YYYY h:mm A'
      )}\nTo: ${formData.dateRange.endDate.format(
        'MMMM Do, YYYY h:mm A'
      )}\nLocation: ${formData.location}`
    );
  };

  const handleApply = (range) => {
    setFormData({
      ...formData,
      dateRange: {
        startDate: range.startDate,
        endDate: range.endDate,
      },
    });
  };

  return (
    <div className="story-container">
      <form onSubmit={handleSubmit} className="example-form">
        <div className="form-group">
          <label htmlFor="event-name">Event Name:</label>
          <input
            id="event-name"
            type="text"
            value={formData.eventName}
            onChange={(e) =>
              setFormData({ ...formData, eventName: e.target.value })
            }
            required
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>

        <div className="form-group">
          <label>Date and Time:</label>
          <DateRangePicker
            startDate={formData.dateRange.startDate}
            endDate={formData.dateRange.endDate}
            onApply={handleApply}
            options={{
              timePicker: true,
              timePickerIncrement: 15,
              locale: {
                format: 'MM/DD/YYYY h:mm A',
              },
            }}
            placeholder="Select event time"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows="3"
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 16px',
            backgroundColor: '#4a6cf7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Schedule Event
        </button>
      </form>
    </div>
  );
};
FormIntegration.parameters = {
  docs: {
    description: {
      story:
        'Integrating the date picker into a form. This example shows how to use the date picker as part of a larger form, such as an event scheduling or booking system. The form validates and submits the selected date range along with other fields.',
    },
    source: {
      code: createSourceCode(
        'Form Integration',
        'Using the date picker in a form with other fields',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import moment from 'moment-timezone';

function EventSchedulerForm() {
  const [formData, setFormData] = useState({
    eventName: 'Team Meeting',
    dateRange: {
      startDate: moment().add(1, 'day').hours(10).minutes(0),
      endDate: moment().add(1, 'day').hours(11).minutes(30)
    },
    location: 'Conference Room',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission
    alert(\`Event Scheduled!\\n\${formData.eventName}\\nFrom: \${formData.dateRange.startDate.format('MMMM Do, YYYY h:mm A')}\\nTo: \${formData.dateRange.endDate.format('MMMM Do, YYYY h:mm A')}\\nLocation: \${formData.location}\`);
  };

  const handleApply = (range) => {
    setFormData({
      ...formData,
      dateRange: {
        startDate: range.startDate,
        endDate: range.endDate
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="event-name">Event Name:</label>
        <input 
          id="event-name"
          type="text" 
          value={formData.eventName}
          onChange={(e) => setFormData({...formData, eventName: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Date and Time:</label>
        <DateRangePicker
          startDate={formData.dateRange.startDate}
          endDate={formData.dateRange.endDate}
          onApply={handleApply}
          options={{
            timePicker: true,
            timePickerIncrement: 15,
            locale: {
              format: 'MM/DD/YYYY h:mm A'
            }
          }}
          placeholder="Select event time"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input 
          id="location"
          type="text" 
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="notes">Notes:</label>
        <textarea 
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows="3"
        />
      </div>
      
      <button type="submit">
        Schedule Event
      </button>
    </form>
  );
}`
      ),
    },
  },
};

// 12. FULLY FEATURED COMPREHENSIVE EXAMPLE
export const ComprehensiveExample = (args) => {
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
    args.onApply?.(range);
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
        <p>
          <strong>Start:</strong>{' '}
          {dateRange.startDate.format('YYYY-MM-DD HH:mm')}
        </p>
        <p>
          <strong>End:</strong> {dateRange.endDate.format('YYYY-MM-DD HH:mm')}
        </p>
        {dateRange.chosenLabel && (
          <p>
            <strong>Range:</strong> {dateRange.chosenLabel}
          </p>
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
ComprehensiveExample.parameters = {
  docs: {
    description: {
      story:
        "A comprehensive example showcasing most of the date picker's capabilities. This is a fully-featured implementation that combines multiple advanced options like time selection, custom ranges, theming, tooltips, and localization.",
    },
    source: {
      code: createSourceCode(
        'Comprehensive Date Range Picker',
        'A fully-featured implementation showing most capabilities',
        `import React, { useState } from 'react';
import DateRangePicker from '@imharshal/react-date-range-picker';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment-timezone';

function ComprehensiveExample() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  });

  const handleApply = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      chosenLabel: range.chosenLabel
    });
  };

  // Custom ranges
  const customRanges = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')]
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
      contentClassName: 'custom-tooltip'
    },
    locale: {
      format: 'YYYY-MM-DD HH:mm',
      applyLabel: 'Apply Selection',
      cancelLabel: 'Clear',
      customRangeLabel: 'Custom Period'
    }
  };

  // Custom theme
  const customTheme = {
    primary: '#3f51b5',
    secondary: '#e8eaf6',
    background: '#ffffff',
    text: '#424242',
    border: '#d1d9ff',
    hover: '#f5f5f5'
  };

  return (
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
  );
}`
      ),
    },
  },
};
