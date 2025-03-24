const defaultThemes = {
  default: {
    // Core Colors - Primary and Secondary
    '--color-primary': '#007bff',
    '--color-secondary': '#fff',

    // Typography
    '--font-size': '0.875rem',
    '--small-font-size': '0.75rem',
    '--line-height': '1.4',

    // Derived Primary Colors
    '--color-primary-hover': '#0069d9',
    '--color-primary-border': '#2e6da4',

    // Text Colors
    '--color-text': '#333',
    '--color-text-light': '#fff',
    '--color-text-muted': '#999',

    // Background Colors
    '--color-bg': '#fff',
    '--color-bg-container': '#fafafa',
    '--color-bg-hover': '#eee',

    // Border Colors
    '--color-border': '#ddd',
    '--color-border-light': '#efefef',

    // Icon Colors
    '--color-icon-primary': '#007bff',
    '--color-icon-secondary': '#495057',

    // States
    '--color-today-indicator': '#3498db',
    '--color-focus-shadow': 'rgba(51, 122, 183, 0.25)',

    // Range States
    '--color-range-bg': '#ebf4f8',
    '--color-range-text': '#000',
    '--color-range-preview-bg': 'rgba(235, 244, 248, 0.75)',

    // Spacing
    '--container-gap': '0.5rem',
  },

  light: {
    // Core colors
    '--color-primary': '#f8f9fa',
    '--color-secondary': '#fff',

    // Derived colors
    '--color-primary-border': '#dae0e5',
    '--color-text-light': '#212529',

    // Icon colors
    '--color-icon-primary': '#f8f9fa',

    // States
    '--color-today-indicator': '#adb5bd',
    '--color-focus-shadow': 'rgba(108, 117, 125, 0.25)',
  },

  dark: {
    // Core colors
    '--color-primary': '#343a40',
    '--color-secondary': '#495057',

    // Derived colors
    '--color-primary-hover': '#23272b',
    '--color-primary-border': '#454d55',

    // Text colors
    '--color-text': '#fff',
    '--color-text-light': '#fff',
    '--color-text-muted': '#adb5bd',

    // Background colors
    '--color-bg': '#495057',
    '--color-bg-container': 'linear-gradient(180deg, #343a40 0%, #343a40 100%)',
    '--color-bg-hover': '#adb5bd',

    // Border colors
    '--color-border': '#6c757d',
    '--color-border-light': '#6c757d',

    // Icon colors
    '--color-icon-primary': '#343a40',
    '--color-icon-secondary': '#adb5bd',

    // States
    '--color-today-indicator': '#adb5bd',
    '--color-focus-shadow': 'rgba(108, 117, 125, 0.25)',

    // Range states
    '--color-range-bg': '#495057',
    '--color-range-text': '#fff',
    '--color-range-preview-bg': 'rgba(108, 117, 125, 0.5)',
  },
};

class ThemeHandler {
  constructor(themes = defaultThemes) {
    this.themes = themes;
  }

  getTheme(themeName, customTheme = {}) {
    const selectedTheme = this.themes[themeName] || this.themes.default;
    return { ...this.themes.default, ...selectedTheme, ...customTheme };
  }

  getStyles(themeName, customTheme = {}) {
    return this.getTheme(themeName, customTheme);
  }
}

export default ThemeHandler;
