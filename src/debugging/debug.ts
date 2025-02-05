import debug from 'debug';
import * as path from 'path';

// Create the logger with a generic namespace for all logs
const log = debug('app:general');

// Enhanced log function to capture file and function names
const enhancedLog = (message: string, ...args: any[]) => {
  // Capture the stack trace to extract the caller's file and function name
  const stack = new Error().stack;
//   console.log("Full stack trace: ", stack); // Print the entire stack trace for analysis
  const stackLines = stack?.split('\n') || [];

  // The line we want to focus on is the second one, which is your controller method
  const callerLine = stackLines[2] || '';  // Adjust this to capture the correct line (this might be `stackLines[2]` instead of `stackLines[3]`)
//   console.log("Caller line: ", callerLine); // Print the caller line

  // Regex to capture function name and file path
  const match = callerLine.match(/at (.*) \((.*):(\d+):(\d+)\)/);  

  if (match) {
    const callerFunctionName = match[1];  // Function name
    const callerFileName = match[2];      // File path
    log(`[${path.basename(callerFileName)}:${callerFunctionName}] ${message}`, ...args);
  } else {
    log(`[Unknown file:Unknown function] ${message}`, ...args);  // Fallback if parsing fails
  }
};

// Export the enhanced log function
export default enhancedLog;
