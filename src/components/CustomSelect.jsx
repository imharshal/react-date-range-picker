 
import React, { useState, useRef, useEffect } from 'react';

// Enhanced CustomSelect Component with full keyboard support
const CustomSelect = ({ value, options, onChange, className, ariaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchString, setSearchString] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  // Find the selected option index
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to highlighted option when navigating
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current) {
      const optionElements = optionsRef.current.childNodes;
      if (optionElements[highlightedIndex]) {
        optionElements[highlightedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Set initial highlighted index when opening dropdown
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, selectedIndex]);

  // Type-ahead search functionality
  const handleTypeAhead = (char) => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Update search string with new character
    const newSearchString = searchString + char.toLowerCase();
    setSearchString(newSearchString);

    // Find the first option that matches the search string
    const matchIndex = options.findIndex(
      (option) =>
        option.label.toLowerCase().startsWith(newSearchString) &&
        !option.disabled
    );

    if (matchIndex >= 0) {
      setHighlightedIndex(matchIndex);
      if (isOpen && optionsRef.current) {
        const optionElements = optionsRef.current.childNodes;
        optionElements[matchIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }

    // Set timeout to clear search string after 1 second of inactivity
    const timeout = setTimeout(() => {
      setSearchString('');
    }, 1000);

    setSearchTimeout(timeout);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      // Handle keys when dropdown is closed
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          return;
        default:
          // Start type-ahead even when closed
          if (e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/)) {
            handleTypeAhead(e.key);
          }
          return;
      }
    }

    // Handle keys when dropdown is open
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          // Find next non-disabled option
          let nextIndex = prev + 1;
          while (nextIndex < options.length && options[nextIndex].disabled) {
            nextIndex++;
          }
          return nextIndex < options.length ? nextIndex : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          // Find previous non-disabled option
          let prevIndex = prev - 1;
          while (prevIndex >= 0 && options[prevIndex].disabled) {
            prevIndex--;
          }
          return prevIndex >= 0 ? prevIndex : prev;
        });
        break;
      case 'Home':
        e.preventDefault();
        // Find first non-disabled option
        for (let i = 0; i < options.length; i++) {
          if (!options[i].disabled) {
            setHighlightedIndex(i);
            break;
          }
        }
        break;
      case 'End':
        e.preventDefault();
        // Find last non-disabled option
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].disabled) {
            setHighlightedIndex(i);
            break;
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && !options[highlightedIndex].disabled) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case 'Tab':
        // Allow normal tab behavior but close dropdown
        setIsOpen(false);
        break;
      default:
        // Type-ahead search for any regular character key
        if (e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/)) {
          handleTypeAhead(e.key);
        }
        break;
    }
  };

  const handleSelect = (selectedValue) => {
    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
  };

  // Find the selected option
  const selectedOption = options.find((opt) => opt.value === value) || {
    label: value,
  };

  return (
    <div
      className={`drp-custom-select ${className}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={
        isOpen && highlightedIndex >= 0
          ? `option-${highlightedIndex}`
          : undefined
      }
    >
      <div
        className="drp-custom-select-selected"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${ariaLabel}: ${selectedOption.label}`}
      >
        {selectedOption.label}
      </div>

      {isOpen && (
        <div
          className="drp-custom-select-dropdown"
          role="listbox"
          ref={optionsRef}
          aria-label={`${ariaLabel} options`}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`option-${index}`}
              className={`drp-custom-select-option ${
                option.disabled ? 'disabled' : ''
              } ${value === option.value ? 'selected' : ''} ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => !option.disabled && handleSelect(option.value)}
              role="option"
              aria-selected={value === option.value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
