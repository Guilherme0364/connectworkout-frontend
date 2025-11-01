const Theme = {
  screen: {
    backgroundColor: '#F9FAFB',
    primaryColor: '#BBF246',
    secondaryColor: '#8B46F2',
    titleColor: '#1F2937',
    textColor: '#374151',
    buttonTextColor: '#1F2937',

    activeIcon: '#BBF246',
    inactiveIcon: '#9CA3AF',
  },

  colors: {
    // Primary - Lime Green
    primary: '#BBF246',
    primaryDark: '#A8DB3D',
    primaryLight: '#D4F78A',
    primaryPressed: '#96C92B',
    primaryDisabled: '#DDF6B1',

    // Secondary - Violet (Complementary color)
    secondary: '#8B46F2',
    secondaryDark: '#7A3DD9',
    secondaryLight: '#A872F5',
    secondaryPressed: '#6934BF',

    // Accent
    accent: '#F59E0B',
    accentLight: '#FBBF24',

    // Semantic colors
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Neutrals
    white: '#FFFFFF',
    black: '#000000',
    darkNavy: '#1A1A2E',
    darkGray: '#2D2D2D',
    darkerGray: '#424242',

    // Grays
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Surface colors
    surface: '#FFFFFF',
    background: '#F9FAFB',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Text colors (optimized for contrast with #BBF246)
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textOnPrimary: '#1F2937', // Dark text on lime green background (better contrast)
    textOnSecondary: '#FFFFFF', // White text on violet background
  },

  components: {
    // Input
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E7EB',
    inputBorderFocused: '#BBF246',
    inputError: '#EF4444',
    inputPlaceholder: '#9CA3AF',

    // Card
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E7EB',
    cardShadow: 'rgba(0, 0, 0, 0.05)',

    // Button
    buttonPrimary: '#BBF246',
    buttonPrimaryPressed: '#96C92B',
    buttonPrimaryDisabled: '#DDF6B1',
    buttonSecondary: '#F3F4F6',
    buttonSecondaryPressed: '#E5E7EB',
    buttonDanger: '#EF4444',
    buttonDangerPressed: '#DC2626',
    buttonText: '#1F2937',
    buttonTextSecondary: '#374151',
    buttonTextDisabled: '#9CA3AF',

    // Badge
    badgeSuccess: '#BBF246',
    badgeSuccessText: '#384325',
    badgeError: '#EF4444',
    badgeErrorText: '#FFFFFF',
    badgeWarning: '#F59E0B',
    badgeWarningText: '#78350F',
    badgeInfo: '#3B82F6',
    badgeInfoText: '#FFFFFF',

    // Tab bar
    tabBarActive: '#BBF246',
    tabBarInactive: '#8E8E93',
    tabBarBackground: '#1A1A2E', // Dark navy background
    tabBarBorder: '#2D2D2D',

    // Loading
    skeleton: '#E5E7EB',
    loadingIndicator: '#BBF246',

    // Progress
    progressBackground: '#E5E7EB',
    progressFill: '#BBF246',
  },

  typography: {
    primaryFont: 'Poppins, sans-serif',
  },
};

export { Theme };
