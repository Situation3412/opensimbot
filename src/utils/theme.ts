export type ThemeColor = 'text' | 'bg' | 'border' | 'shadow';
export type ComponentVariant = 'primary' | 'secondary' | 'danger';
export type ThemeComponent = 'app' | 'card' | 'button' | 'input' | 'header' | 'body' | 'container' | 'tooltip' | 'tooltip.arrow';
export type Intensity = 'default' | 'strong' | 'weak' | 'inverse';

interface ThemeStyles {
  [key: string]: string;
}

const darkTheme: ThemeStyles = {
  // App
  'app.bg': 'bg-bnet-gray-800',
  'app.text': 'text-bnet-gray-100',

  // Text styles
  'text.default': 'text-bnet-gray-100',
  'text.strong': 'text-white',
  'text.weak': 'text-bnet-gray-400',
  'text.inverse': 'text-bnet-gray-900',

  // Background styles
  'bg.default': 'bg-bnet-gray-700/50',
  'bg.strong': 'bg-bnet-gray-700',
  'bg.weak': 'bg-bnet-gray-800/50',
  'bg.inverse': 'bg-white',

  // Border styles
  'border.default': 'border-bnet-gray-600',
  'border.strong': 'border-bnet-gray-500',
  'border.weak': 'border-bnet-gray-700',
  'border.hover': 'hover:border-bnet-blue-500/30',

  // Shadow styles
  'shadow.default': 'shadow-lg shadow-black/20',
  'shadow.strong': 'shadow-xl shadow-black/30',
  'shadow.colored': 'shadow-lg shadow-bnet-blue-500/20',

  // Button variants
  'button.primary': 'bg-bnet-blue-500 hover:bg-bnet-blue-400 text-white focus:ring-bnet-blue-500 shadow-lg shadow-bnet-blue-500/20',
  'button.secondary': 'bg-bnet-gray-700 hover:bg-bnet-gray-600 text-bnet-gray-100 focus:ring-bnet-gray-500 shadow-lg shadow-bnet-gray-700/20',
  'button.danger': 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-lg shadow-red-500/20',

  // Card styles
  'card.bg': 'bg-bnet-gray-700/50',
  'card.border': 'border-bnet-gray-600',
  'card.shadow': 'shadow-lg shadow-black/20',
  'card.header.bg': 'bg-bnet-gray-700/50',
  'card.header.border': 'border-bnet-gray-600',
  'card.body.bg': 'bg-bnet-gray-700/50',

  // Tooltip styles
  'tooltip.bg': 'bg-bnet-gray-600',
  'tooltip.text': 'text-bnet-gray-100',
  'tooltip.border': 'border border-bnet-gray-500',
  'tooltip.arrow.border': 'border-bnet-gray-600',
  'tooltip.shadow': 'shadow-lg shadow-black/20',
};

const lightTheme: ThemeStyles = {
  // App
  'app.bg': 'bg-bnet-gray-50',
  'app.text': 'text-bnet-gray-900',

  // Text styles
  'text.default': 'text-bnet-gray-900',
  'text.strong': 'text-bnet-gray-900',
  'text.weak': 'text-bnet-gray-600',
  'text.inverse': 'text-white',

  // Background styles
  'bg.default': 'bg-white',
  'bg.strong': 'bg-bnet-gray-50',
  'bg.weak': 'bg-white/50',
  'bg.inverse': 'bg-bnet-gray-900',

  // Border styles
  'border.default': 'border-bnet-gray-200',
  'border.strong': 'border-bnet-gray-300',
  'border.weak': 'border-bnet-gray-100',
  'border.hover': 'hover:border-bnet-blue-500/30',

  // Shadow styles
  'shadow.default': 'shadow-lg shadow-bnet-gray-200/50',
  'shadow.strong': 'shadow-xl shadow-bnet-gray-300/50',
  'shadow.colored': 'shadow-lg shadow-bnet-blue-500/20',

  // Button variants
  'button.primary': 'bg-bnet-blue-500 hover:bg-bnet-blue-600 text-white focus:ring-bnet-blue-500 shadow-lg shadow-bnet-blue-500/20',
  'button.secondary': 'bg-bnet-gray-100 hover:bg-bnet-gray-200 text-bnet-gray-900 focus:ring-bnet-gray-400 shadow-lg shadow-bnet-gray-200/20',
  'button.danger': 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg shadow-red-500/20',

  // Card styles
  'card.bg': 'bg-white/50',
  'card.border': 'border-bnet-gray-200',
  'card.shadow': 'shadow-lg shadow-bnet-gray-200/50',
  'card.header.bg': 'bg-white',
  'card.header.border': 'border-bnet-gray-200',
  'card.body.bg': 'bg-white',

  // Tooltip styles
  'tooltip.bg': 'bg-bnet-gray-800',
  'tooltip.text': 'text-white',
  'tooltip.border': 'border border-bnet-gray-700',
  'tooltip.arrow.border': 'border-bnet-gray-800',
  'tooltip.shadow': 'shadow-lg shadow-bnet-gray-900/20',
};

export function getThemeStyle(key: string, isDark: boolean): string {
  const theme = isDark ? darkTheme : lightTheme;
  return theme[key] || '';
}

export function getThemeStyles(keys: string[], isDark: boolean): string {
  return keys.map(key => getThemeStyle(key, isDark)).join(' ');
}

export function getComponentStyles(
  component: ThemeComponent, 
  variant?: ComponentVariant, 
  isDark: boolean = false
): string {
  const styles: string[] = [];
  
  switch (component) {
    case 'app':
      styles.push('min-h-screen transition-colors duration-200');
      styles.push(getThemeStyle('app.bg', isDark));
      styles.push(getThemeStyle('app.text', isDark));
      break;
    case 'card':
      styles.push('rounded-xl border backdrop-blur-sm transition-all duration-200 ease-in-out');
      styles.push(getThemeStyle('card.bg', isDark));
      styles.push(getThemeStyle('card.border', isDark));
      styles.push(getThemeStyle('card.shadow', isDark));
      styles.push(getThemeStyle('border.hover', isDark));
      break;
    case 'button':
      if (variant) {
        styles.push(getThemeStyle(`button.${variant}`, isDark));
      }
      break;
    case 'tooltip':
      styles.push('absolute z-50 px-2 py-1 text-sm rounded-lg whitespace-nowrap transition-opacity duration-150');
      styles.push(getThemeStyles([
        'tooltip.bg',
        'tooltip.text',
        'tooltip.border',
        'tooltip.shadow'
      ], isDark));
      break;
    case 'tooltip.arrow':
      styles.push('absolute w-2 h-2 border-4');
      styles.push(getThemeStyle('tooltip.arrow.border', isDark));
      break;
    // Add more components as needed
  }

  return styles.join(' ');
} 