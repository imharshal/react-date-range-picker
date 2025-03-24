import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import DateRangePicker from '.';

function App() {
  const ranges = useMemo(
    () => ({
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last Minute': [moment().subtract(1, 'minutes'), moment()],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
    }),
    []
  );
  const [dateRange, setDateRange] = useState({});

  // Define custom options
  const options = useMemo(() => {
    return {
      // singleDatePicker: true,
      showFullDateRangeLabel: true,
      // icon: <Icon name="calender" />,
      showInputField: false,
      showDropdowns: true,
      timePicker: true,
      timePicker24Hour: false,
      timePickerIncrement: 15,
      alwaysShowCalendars: false,
      linkedCalendars: false,
      autoApply: false,
      showRanges: true,
      opens: 'left',
      drops: 'down',
      locale: {
        format: 'MM/DD/YYYY h:mm A',
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom Range',
      },
    };
  }, []);

  const handleApply = useCallback((dateRange) => {
    console.warn('date range previous state:', dateRange);
    console.warn('formatted date range:', {
      startDate: dateRange.startDate.format('MM/DD/YYYY h:mm A'),
      endDate: dateRange.endDate.format('MM/DD/YYYY h:mm A'),
    });
    console.warn('date range onApply', dateRange);
    setDateRange(dateRange);
  }, []);

  return (
    <>
      <div style={{ width: '100%' }}>
        <DateRangePicker
          options={options}
          ranges={ranges}
          onApply={handleApply}
          startDate={dateRange?.startDate}
          endDate={dateRange?.endDate}
          placeholder="Select date range"
          timeZone="America/New_York"
        />
      </div>
    </>
  );
}

export default App;
