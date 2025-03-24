const defaultThemes = {
  default: {
    '--font-size': '0.875rem',
    '--small-font-size': '0.75rem',
    '--line-height': '1.4',

    '--primary-bg-color': '#007bff',
    '--primary-icon-color': '#007bff',
    '--primary-border-color': '#2e6da4',
    '--primary-text-color': '#fff',
    '--secondary-bg-color': '#fff',
    '--secondary-border-color': '#ccc',
    '--secondary-icon-color': '#495057',
    '--today-indicator-color': '#3498db',
    '--focus-shadow-color': 'rgba(51, 122, 183, 0.25)',

    '--container-bg-color': '#fafafa',
    '--container-gap': '0.5rem',
    '--bg-color': '#fff',
    '--text-color': '#333',
    '--muted-text-color': '#999',
    '--border-color': '#ddd',
    '--border-light-color': '#efefef',
    '--hover-bg-color': '#eee',
    '--active-bg-color': '#337ab7',
    '--active-text-color': '#fff',
    '--in-range-bg-color': '#ebf4f8',
    '--in-range-text-color': '#000',
    '--preview-range-bg-color': 'rgba(235, 244, 248, 0.75)',
  },
  light: {
    '--primary-bg-color': '#f8f9fa',
    '--primary-border-color': '#dae0e5',
    '--primary-text-color': '#212529',
    '--secondary-bg-color': '#fff',
    '--secondary-border-color': '#ccc',
    '--today-indicator-color': '#adb5bd',
    '--focus-shadow-color': 'rgba(108, 117, 125, 0.25)',
  },
  dark: {
    '--primary-bg-color': '#343a40',
    '--primary-border-color': '#454d55',
    '--primary-text-color': '#fff',
    '--secondary-bg-color': '#495057',
    '--secondary-border-color': '#6c757d',
    '--secondary-icon-color': '#adb5bd',
    '--container-bg-color': 'linear-gradient(180deg, #343a40 0%, #343a40 100%)',
    '--bg-color': '#495057',
    '--text-color': '#fff',
    '--muted-text-color': '#adb5bd',
    '--border-color': '#6c757d',
    '--border-light-color': '#6c757d',
    '--hover-bg-color': '#adb5bd',
    '--active-bg-color': '#212529',
    '--active-text-color': '#fff',
    '--in-range-bg-color': '#495057',
    '--in-range-text-color': '#fff',
    '--preview-range-bg-color': 'rgba(108, 117, 125, 0.5)',
    '--today-indicator-color': '#adb5bd',
    '--focus-shadow-color': 'rgba(108, 117, 125, 0.25)',
  },
};

class ThemeHandler {
  constructor(themes = defaultThemes) {
    this.themes = themes;
  }

  getTheme(themeName, customTheme = {}) {
    const selectedTheme = this.themes[themeName] || this.themes.default;
    return { ...selectedTheme, ...customTheme };
  }

  getStyles(themeName, customTheme = {}) {
    return this.getTheme(themeName, customTheme);
  }
}

export default ThemeHandler;
