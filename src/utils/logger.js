/**
 * Logger utility for consistent logging throughout the app
 */
class Logger {
    static info(message, data = null) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? data : '');
    }
    
    static error(message, error = null) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error ? error : '');
    }
    
    static warn(message, data = null) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data ? data : '');
    }
    
    static debug(message, data = null) {
      if (process.env.DEBUG === 'true') {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data ? data : '');
      }
    }
  }
  
  export default Logger;