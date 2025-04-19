class DateUtils {
    static parseDateFromMatch(match) {
      // Handle day of week
      if (/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(match[1])) {
        const dayName = match[1].toLowerCase().replace(/next\s+/, '');
        return this.getNextDayDate(dayName);
      }
      // Handle month name formats
      if (/january|february|march|april|may|june|july|august|september|october|november|december/i.test(match[1])) {
        const month = match[1].toLowerCase();
        const day = parseInt(match[2]);
        return this.formatDateWithMonthName(day, month);
      }
      if (/january|february|march|april|may|june|july|august|september|october|november|december/i.test(match[2])) {
        const day = parseInt(match[1]);
        const month = match[2].toLowerCase();
        return this.formatDateWithMonthName(day, month);
      }
      if(match[2] && match[3]) {
        const firstNumber = parseInt(match[1]);
        const secondNumber = parseInt(match[2]);
        const now = new Date();
        const year = now.getFullYear();
        return `${firstNumber}/${secondNumber}/${year}`;
      }
      //if we can't parse properly
      return match[0];
    }
  
    static parseTimeFromMatch(match) {
      const hours = parseInt(match[1]);
      const minutes = match[2] ? match[2] : '00';
      let period = match[3] ? match[3].toLowerCase() : '';
      if(!period) {
        period = hours < 8 ? 'pm' : 'am';
        if(hours >= 8 && hours <= 12) {
          period = 'am';
        } else if(hours > 0 && hours < 8) {
          period = 'pm';
        }
      }
      return `${hours}:${minutes} ${period}`;
    }
  
    static getNextDayDate(dayName) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; // Fixed order to match JS
      const today = new Date();
      const targetDayIndex = days.indexOf(dayName);
      if(targetDayIndex < 0) {
        return dayName;
      }
      const todayIndex = today.getDay();
      let daysToAdd = targetDayIndex - todayIndex;
      if (daysToAdd <= 0) {
        daysToAdd += 7;
      }
      const targetDate = new Date(today); // Fixed variable name
      targetDate.setDate(today.getDate() + daysToAdd);
      return `${targetDate.getDate()}/${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`;
    }
  
    static formatDateWithMonthName(day, month) {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const monthIndex = months.indexOf(month);
      if(monthIndex < 0) {
        return `${day}/${month}`;
      }
      const year = new Date().getFullYear();
      return `${day}/${monthIndex + 1}/${year}`;
    }
  }
  
  export default DateUtils;