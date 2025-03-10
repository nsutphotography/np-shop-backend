import debug from 'debug';
import * as path from 'path';

// Create the logger with a generic namespace for all logs
const log = debug('app:general');

// ANSI escape codes for colors
const colors = {
  bold: '\x1b[1m', // Bold text

  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Enhanced log function to capture file and function names
const enhancedLog = (message: any, ...args: any[]) => {
  // Capture the stack trace to extract the caller's file and function name
  const stack = new Error().stack;
  const stackLines = stack?.split('\n') || [];

  // The line we want to focus on is the second one, which is your controller method
  const callerLine = stackLines[2] || '';
  const match = callerLine.match(/at (.*) \((.*):(\d+):(\d+)\)/);  

  if (match) {
    const callerFunctionName = match[1];  // Function name
    const callerFileName = match[2];      // File path

    // Color the message (for example, color the function name in blue)
    const coloredMessage = `${colors.green}[${path.basename(callerFileName)}:${callerFunctionName}]${colors.reset}${colors.yellow}${message}${colors.reset}`;

    // Color the args (for example, color the email in green)
    const coloredArgs = args.map(arg => `${colors.green}${arg}${colors.reset}`);

    log(coloredMessage, ...coloredArgs);
  } else {
    log(`[Unknown file:Unknown function] ${message}`, ...args);  // Fallback if parsing fails
  }
};

// Export the enhanced log function
export default enhancedLog;
