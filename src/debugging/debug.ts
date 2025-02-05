import debug from 'debug';
import * as path from 'path';

// Create the logger with a generic namespace for all logs
const log = debug('app:general');

// Enhance the log function to include the function name and file name
const enhancedLog = (message: string, ...args: any[]) => {
  // Capture the stack trace to extract the caller's file and function name
  const stack = new Error().stack;
  const stackLines = stack?.split('\n') || [];
  const callerLine = stackLines[3] || ''; // Third line usually contains the function call info
  const callerFileName = callerLine.match(/\((.*):\d+:\d+\)/)?.[1] || 'Unknown file';
  const callerFunctionName = callerLine.match(/at (\w+)/)?.[1] || 'Unknown function';

  // Format the log message with the caller information
  log(`[${path.basename(callerFileName)}:${callerFunctionName}] ${message}`, ...args);
};

// Export the enhancedLog function directly
export default enhancedLog;
