const entityPatterns = {
    //extract yes no responses
    yesNo: {
        yes: /\b(yes|yeah|sure|correct|right|definitely|absolutely|of course)\b/i,
        no: /\b(no|nope|not really|not interested|cannot|can't|cannot|don't think so)\b/i
      },

      //extract notice-period
      noticePeriod: /\b(\d+)\s*(day|days|week|weeks|month|months)\b/i,

      //extract ctc (current and expected)
      salary: {
        current: /\bcurrent(?:ly)?(?:\s*(?:is|:))?\s*(?:(?:Rs|INR|₹)?\s*(\d+(?:\.\d+)?(?:\s*[kK])?(?:\s*(?:lakhs|lakh|L))))/i,
        expected: /\bexpect(?:ed|ing)?(?:\s*(?:is|:))?\s*(?:(?:Rs|INR|₹)?\s*(\d+(?:\.\d+)?(?:\s*[kK])?(?:\s*(?:lakhs|lakh|L))))/i
      },

      //extract dates various formats
      date: [
        // Day of week (e.g., "Monday", "next Tuesday")
        /\b((?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i,
        
        // Specific dates (e.g., "April 15", "15th April", "15/04")
        /\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
        /\b(\d{1,2})[\/\.-](\d{1,2})(?:[\/\.-](\d{2,4}))?\b/
      ],

      //extract time
      time: /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i
};

class EntityExtractor {
    extractEntities(state, userInput){
        const extracted = {}

        switch(state){
            case 'interest_check':
             extracted.isInterested = entityPatterns.yesNo.yes.test(userInput);
             break;

            case 'notice_period':
                const noticePeriodMatch = userInput.match(entityPatterns.noticePeriod);
                if (noticePeriodMatch) {
                    extracted.noticePeriod = {
                        duration: parseInt(noticePeriodMatch[1]),
                        unit: noticePeriodMatch[2]
                    };    
                }
            break;

            case 'salary_expectations':
            const currentMatch = userInput.match(entityPatterns.salary.current);
            const expectedMatch = userInput.match(entityPatterns.salary.expected);
        
            extracted.salary = {};
        
            if (currentMatch) {
                extracted.salary.current = currentMatch[1];
            }
        
            if (expectedMatch) {
                extracted.salary.expected = expectedMatch[1];
            }
            break;

            case 'availability':
            // Extract date
            let dateFound = false;
        
            for (const datePattern of entityPatterns.date) {
                const dateMatch = userInput.match(datePattern);
                if (dateMatch) {
                    extracted.availability = { 
                        date: this._parseDateFromMatch(dateMatch) 
                    };
                dateFound = true;
                break;
                }
            }

            // Extract time
            const timeMatch = userInput.match(entityPatterns.time);
            if (timeMatch) {
                if (!extracted.availability) extracted.availability = {};
                    extracted.availability.time = this._parseTimeFromMatch(timeMatch);
                 }
        
            // If no structured date was found, store the raw input
             if (!dateFound && !extracted.availability) {
                 extracted.availability = { raw: userInput.trim() };
             }
             break;

            case 'confirm_booking':
                extracted.isConfirmed = entityPatterns.yesNo.yes.test(userInput);
                break;
        }
        return extracted;
    }

    _parseDateFromMatch(match){
        const Dateutils = require("../utils/date.utils.js")
        return Dateutils.parseDateFromMatch(match);
    }

    _parseTimeFromMatch(match){
        const Dateutils = require("../utils/date.utils.js")
        return Dateutils.parseTimeFromMatch(match);
    }
}

module.exports = {EntityExtractor, entityPatterns}
