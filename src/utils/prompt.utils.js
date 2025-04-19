/***
 * Utility functions for creating prompts
 */
class PromptUtils {
  static createSystemPrompt(candidateData, currentState, nextState, extractedEntities) {
    const basePrompt = `You are an AI assistant for ${candidateData?.company || 'a company'} named Time2Hire.
You're having a conversation with ${candidateData?.name || 'a job candidate'} about a ${candidateData?.position || 'job'} opportunity.
Keep your responses very brief and conversational. Use the candidate's name when appropriate.`;

    let statePrompt = '';
    switch (currentState) {
      case 'interest_check':
        statePrompt = `The candidate ${extractedEntities.isInterested === true ? 'is' : 
                      extractedEntities.isInterested === false ? 'is not' : 
                      'has not clearly indicated if they are'} interested in the role.
${extractedEntities.isInterested === true ? 
  'Acknowledge their interest positively and prepare to ask about notice period.' : 
  'Politely thank them for their time and end the conversation.'}`;
        break;
      case 'notice_period':
        statePrompt = `The candidate's notice period is ${extractedEntities.noticePeriod ?
          extractedEntities.noticePeriod :
          'unclear from their response'}.
Acknowledge this information briefly and prepare to ask about salary expectations.`;
        break;
      case 'salary_expectations':
        statePrompt = `The candidate ${extractedEntities.currentSalary ?
          `has a current salary of ${extractedEntities.currentSalary}` :
          'did not clearly state their current salary'} and ${extractedEntities.expectedSalary ?
          `expects ${extractedEntities.expectedSalary}` :
          'did not clearly state their expected salary'}.
Acknowledge this information briefly and prepare to ask about their availability for an interview next week.`;
        break;
      case 'availability':
        statePrompt = `The candidate is available ${extractedEntities.rawAvailability ?
          `at: ${extractedEntities.rawAvailability}` :
          'at an unclear time'}.
Acknowledge their availability briefly and let them know you'll suggest a specific interview time.`;
        break;
      case 'confirm_booking':
        statePrompt = `You've suggested an interview at ${extractedEntities.interviewDateTime || 'an unspecified time'}.
Ask the candidate to confirm if this time works for them.`;
        break;
      case 'booking_confirmed':
        statePrompt = `The candidate ${extractedEntities.isConfirmed ?
          'has confirmed' :
          'has not confirmed'} the interview booking.
${extractedEntities.isConfirmed ?
          'Thank them and let them know they will receive a confirmation email.' :
          'Apologize for the confusion and offer to reschedule at a better time.'}`;
        break;
    }
    
    return `${basePrompt}\n\n${statePrompt}\n\nYour next prompt will be to ${this.getStateDescription(nextState)}.\n\nIf the candidate provides information for a future state or asks questions, address them naturally before returning to your current objective.`;
  }

  static getStateDescription(state) {
    switch (state) {
      case 'initial_greeting':
        return "introduce yourself and explain the purpose of the conversation";
      case 'interest_check':
        return "ask if they're interested in the role";
      case 'notice_period':
        return "ask about their notice period";
      case 'salary_expectations':
        return "ask about their current and expected salary";
      case 'availability':
        return "ask when they're available for an interview next week";
      case 'confirm_booking':
        return "suggest a specific interview time and ask for confirmation";
      case 'booking_confirmed':
        return "confirm the interview booking details";
      case 'farewell':
        return "say goodbye and end the conversation";
      default:
        return "continue the conversation";
    }
  }

  static getPromptForState(state, contextData = {}) {
    switch (state) {
      case 'initial_greeting':
        return "Hi there! I'm calling from Time2Hire regarding the position you applied for. How are you today?";
      
      case 'interest_check':
        return "I wanted to confirm if you're still interested in the position we discussed?";
      
      case 'notice_period':
        return "Great to hear you're interested! Could you let me know what your notice period is at your current workplace?";
      
      case 'salary_expectations':
        return "Thank you for that information. May I ask about your current salary and your expectations for this role?";
      
      case 'availability':
        return "Thanks for sharing that. We'd like to schedule an interview with you. Could you please let me know your availability for next week?";
      
      case 'confirm_booking':
        const dateTime = contextData.dateTime || "our proposed time";
        return `Based on your availability, we'd like to schedule the interview for ${dateTime}. Does that work for you?`;
      
      case 'booking_confirmed':
        return "Excellent! I've confirmed your interview. You'll receive an email shortly with all the details. Is there anything else you'd like to know?";
      
      case 'farewell':
        return "Thank you for your time today! We look forward to speaking with you soon. Have a great day!";
      
      default:
        return "Is there anything else you'd like to discuss about the position?";
    }
  }
}

export default PromptUtils