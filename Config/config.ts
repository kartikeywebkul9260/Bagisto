// config.js
const config = {
  // The base URL of the application under test
  baseUrl: process.env.APP_URL || 'http://localhost:8000',

  // Customer credentials
  customerEmail: process.env.CUSTOMER_EMAIL || 'testxyat1k@example.com',
  customerPassword: process.env.CUSTOMER_PASSWORD || 'E2*D7R7(ISTarU^Y',

  // Admin credentials
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',

  // UI customization and input settings
  darkMode: process.env.DARK_MODE === 'true' || false,
  userInput: process.env.USER_INPUT === 'true' || false,
  validInputs: process.env.VALID_INPUTS === 'true' || true,

  // Browser settings
  browser: process.env.BROWSER || 'chromium',

  // Timeout settings
  mediumTimeout: 120000, // 2 minutes
  highTimeout: 240000,   // 4 minutes
};

export default config;
