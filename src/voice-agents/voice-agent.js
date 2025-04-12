import EntityExtractor from '../services/entity-extractor';
import AIService from '../services/ai.services';
import { STATES, getNextState } from './states';
import { getPrompt } from '../utils/prompt.utils';
import Candidate from '../models/candidate.model';

class VoiceAgent {
  constructor() {
    this.states = STATES;
    this.entityExtractor = new EntityExtractor();
    this.aiService = new AIService();
    this.candidateData = null;
    this.conversationHistory = [];
    this.currentState = null;
  }
  
  async startConversation(candidateData) {
    try {
      // Save candidate data to database
      if (!candidateData._id) {
        const candidate = new Candidate(candidateData);
        this.candidateData = await candidate.save();
      } else {
        this.candidateData = await Candidate.findById(candidateData._id);
      }
      
      this.currentState = this.states.GREETING;
      this.conversationHistory = [];
      
      const greeting = getPrompt(this.states.GREETING, {
        name: this.candidateData.name,
        company: this.candidateData.company,
        position: this.candidateData.position
      });
      
      this.addToHistory('assistant', greeting);
      
      return {
        message: greeting,
        state: this.currentState,
        nextPrompt: getPrompt(this.states.INTEREST_CHECK),
        candidateId: this.candidateData._id
      };
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }
  
  async processResponse(userInput, candidateId) {
    try {
      // If candidateId is provided, load the candidate data
      if (candidateId && (!this.candidateData || !this.candidateData._id.equals(candidateId))) {
        this.candidateData = await Candidate.findById(candidateId);
        // Load conversation history if empty
        if (this.conversationHistory.length === 0) {
          this.conversationHistory = this.candidateData.conversationHistory || [];
        }
      }
      
      // Add user input to conversation history
      this.addToHistory('user', userInput);
      
      // Extract entities from the user input
      const extractedEntities = this.entityExtractor.extractEntities(this.currentState, userInput);
      
      // Get next state based on current state and extraction results
      const nextState = getNextState(this.currentState, extractedEntities);
      
      // Store extracted information
      await this.storeInformation(extractedEntities);
      
      // Use Groq to generate a natural language response
      const messages = [
        {
          role: 'system',
          content: this.aiService.createSystemPrompt(
            this.candidateData,
            this.currentState,
            nextState,
            extractedEntities
          )
        },
        ...this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userInput
        }
      ];
      
      // Skip AI service for simple transitions to reduce API calls
      let aiResponse = null;
      if (this.currentState !== this.states.GREETING && nextState !== this.states.FAREWELL) {
        aiResponse = await this.aiService.generateResponse(messages);
      }
      
      // Update state
      this.currentState = nextState;
      
      // Get next prompt based on the new state
      let nextPrompt = '';
      
      if (nextState === this.states.CONFIRM_BOOKING && this.candidateData.interviewDateTime) {
        nextPrompt = getPrompt(nextState, {
          dateTime: this.candidateData.interviewDateTime
        });
      } else {
        nextPrompt = getPrompt(nextState);
      }
      
      // Add AI response to history
      const finalResponse = aiResponse || nextPrompt;
      this.addToHistory('assistant', finalResponse);
      
      return {
        message: finalResponse,
        state: nextState,
        extractedEntities,
        done: nextState === this.states.FAREWELL,
        candidateId: this.candidateData._id
      };
    } catch (error) {
      console.error('Error processing response:', error);
      throw error;
    }
  }
  
  async storeInformation(extractedEntities) {
    if (!this.candidateData) return;
    
    // Update candidate data based on extracted entities
    if (extractedEntities.isInterested !== undefined) {
      this.candidateData.isInterested = extractedEntities.isInterested;
    }
    
    if (extractedEntities.noticePeriod) {
      this.candidateData.noticePeriod = `${extractedEntities.noticePeriod.duration} ${extractedEntities.noticePeriod.unit}`;
    }
    
    if (extractedEntities.salary) {
      if (extractedEntities.salary.current) {
        this.candidateData.currentSalary = extractedEntities.salary.current;
      }
      
      if (extractedEntities.salary.expected) {
        this.candidateData.expectedSalary = extractedEntities.salary.expected;
      }
    }
    
    if (extractedEntities.availability) {
      if (extractedEntities.availability.date && extractedEntities.availability.time) {
        this.candidateData.interviewDateTime = `${extractedEntities.availability.date} at ${extractedEntities.availability.time}`;
      } else if (extractedEntities.availability.raw) {
        this.candidateData.rawAvailability = extractedEntities.availability.raw;
        
        // For demo purposes, let's set a fake interview time
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        this.candidateData.interviewDateTime = `${nextWeek.toLocaleDateString()} at 2:00 pm`;
      }
    }
    
    if (extractedEntities.isConfirmed !== undefined) {
      this.candidateData.bookingConfirmed = extractedEntities.isConfirmed;
    }
    
    // Update conversation history
    this.candidateData.conversationHistory = this.conversationHistory;
    
    // Save to database
    await this.candidateData.save();
    
    return this.candidateData;
  }
  
  addToHistory(role, content) {
    this.conversationHistory.push({ 
      role, 
      content,
      timestamp: new Date()
    });
    
    // Limit history size to last 10 messages
    if (this.conversationHistory.length > 10) {
      this.conversationHistory.shift();
    }
  }
}

export default VoiceAgent;