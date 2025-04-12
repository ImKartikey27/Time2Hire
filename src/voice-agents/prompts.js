const PROMPTS = {
    greeting: "Hello {name}, this is {company} regarding a {position} opportunity.",
    interest_check: "Are you interested in this role?",
    notice_period: "What is your current notice period?",
    salary_expectations: "Can you share your current and expected CTC?",
    availability: "When are you available for an interview next week?",
    confirm_booking: "We've scheduled your interview on {dateTime}. Is that correct?",
    farewell: "Great! You'll receive a confirmation email shortly. We look forward to speaking with you soon. Thank you and have a great day."
  };

  function getPrompt(state, data = {}) {
    let prompt = PROMPTS[state] || '';
    
    // Replace placeholders with actual data
    Object.keys(data).forEach(key => {
      prompt = prompt.replace(`{${key}}`, data[key]);
    });
    
    return prompt;
  }

// Using named exports in ES6
export { PROMPTS, getPrompt };
