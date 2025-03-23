// RangeSelector.js (complete file)
import React, { memo } from 'react';

const RangeSelector = ({
  ranges,
  onRangeClick,
  locale = {
    customRangeLabel: 'Custom Range',
  },
  activeRangeLabel = null,
}) => {
  return (
    <div className="ranges">
      <ul>
        {Object.entries(ranges).map(([label, [start, end]]) => (
          <li
            key={label}
            data-range-key={label}
            className={activeRangeLabel === label ? 'active' : ''}
            onClick={() => onRangeClick(start.clone(), end.clone(), label)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRangeClick(start.clone(), end.clone(), label);
              }
            }}
            aria-label={label}
            aria-selected={activeRangeLabel === label}
          >
            {label}
          </li>
        ))}

        <li
          key="custom"
          data-range-key={locale.customRangeLabel}
          className={
            activeRangeLabel === locale.customRangeLabel ? 'active' : ''
          }
          onClick={() => onRangeClick(null, null, locale.customRangeLabel)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onRangeClick(null, null, locale.customRangeLabel);
            }
          }}
          aria-label={locale.customRangeLabel}
          aria-selected={activeRangeLabel === locale.customRangeLabel}
        >
          {locale.customRangeLabel}
        </li>
      </ul>
    </div>
  );
};

export default memo(RangeSelector);
