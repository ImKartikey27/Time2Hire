/**
 * Utility functions for creating prompts
 */
class PromptUtils {
    static createSystemPrompt(candidateData, currentState, nextState, extractedEntities) {
      const basePrompt = `You are an AI assistant for ${candidateData?.company || 'a company'} named Time2Hire.
  You're having a conversation with ${candidateData?.name || 'a job candidate'} about a job opportunity.
  Keep your responses very brief and conversational.`;
      
      let statePrompt = '';
      
      switch (currentState) {
        case 'interest_check':
          statePrompt = `The candidate ${extractedEntities.isInterested ? 'is' : 'is not'} interested in the role.
  ${extractedEntities.isInterested ? 'Acknowledge their interest positively and prepare to ask about notice period.' : 'Politely thank them for their time and end the conversation.'}`;
          break;
        
        case 'notice_period':
          statePrompt = `The candidate's notice period is ${extractedEntities.noticePeriod ? 
            `${extractedEntities.noticePeriod.duration} ${extractedEntities.noticePeriod.unit}` : 
            'unclear from their response'}.
  Acknowledge this information briefly and prepare to ask about salary expectations.`;
          break;
        
        case 'salary_expectations':
          statePrompt = `The candidate ${extractedEntities.salary?.current ? 
            `has a current CTC of ${extractedEntities.salary.current}` : 
            'did not clearly state their current CTC'} and ${extractedEntities.salary?.expected ? 
              `expects ${extractedEntities.salary.expected}` : 
              'did not clearly state their expected CTC'}.
  Acknowledge this information briefly and prepare to ask about their availability for an interview next week.`;
          break;
        
        case 'availability':
          statePrompt = `The candidate is available ${extractedEntities.availability ? 
            (extractedEntities.availability.date && extractedEntities.availability.time ? 
              `on ${extractedEntities.availability.date} at ${extractedEntities.availability.time}` : 
              `at: ${extractedEntities.availability.raw || 'an unspecified time'}`) : 
            'at an unclear time'}.
  Acknowledge their availability briefly and let them know you'll schedule the interview.`;
          break;
        
        case 'confirm_booking':
          statePrompt = `The candidate ${extractedEntities.isConfirmed ? 
            'has confirmed' : 
            'has not confirmed'} the interview booking.
  ${extractedEntities.isConfirmed ? 
            'Thank them and let them know they will receive a confirmation email.' : 
            'Apologize for the confusion and offer to reschedule at a better time.'}`;
          break;
      }
      
      return `${basePrompt}\n\n${statePrompt}\n\nYour next prompt will be to ${this.getStateDescription(nextState)}.`;
    }
    
    static getStateDescription(state) {
      switch (state) {
        case 'interest_check':
          return "ask if they're interested in the role";
        case 'notice_period':
          return "ask about their notice period";
        case 'salary_expectations':
          return "ask about their current and expected CTC";
        case 'availability':
          return "ask when they're available for an interview next week";
        case 'confirm_booking':
          return "confirm the interview booking details";
        case 'farewell':
          return "say goodbye and end the conversation";
        default:
          return "continue the conversation";
      }
    }
  }

export default PromptUtils