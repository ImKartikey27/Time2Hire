
const STATES = {
    GREETING: 'greeting',
    INTEREST_CHECK: 'interest_check',
    NOTICE_PERIOD: 'notice_period',
    SALARY_EXPECTATIONS: 'salary_expectations',
    AVAILABILITY: 'availability',
    CONFIRM_BOOKING: 'confirm_booking',
    FAREWELL: 'farewell'
  };

  function getNextState(currentState, extractedEntities) {
    switch (currentState) {
      case STATES.GREETING:
        return STATES.INTEREST_CHECK;
        
      case STATES.INTEREST_CHECK:
        // If not interested, skip to farewell
        if (extractedEntities.isInterested === false) {
          return STATES.FAREWELL;
        }
        return STATES.NOTICE_PERIOD;
        
      case STATES.NOTICE_PERIOD:
        return STATES.SALARY_EXPECTATIONS;
        
      case STATES.SALARY_EXPECTATIONS:
        return STATES.AVAILABILITY;
        
      case STATES.AVAILABILITY:
        return STATES.CONFIRM_BOOKING;
        
      case STATES.CONFIRM_BOOKING:
        return STATES.FAREWELL;
        
      default:
        return STATES.FAREWELL;
    }
  }

// Using named exports in ES6
export { STATES, getNextState };
