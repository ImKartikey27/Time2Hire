import GroqClient from "groq-sdk"
import  dotenv  from "dotenv";
import PromptUtils from "../utils/prompt.utils.js";

dotenv.config();

class AIService{
    constructor(){
        this.groq = new GroqClient({
            apiKey: process.env.GROQ_API_KEY,
        })
    }
    async generateResponse(messages){
        try {
            const response = await this.groq.chat.completions.create({
              model: 'llama3-8b-8192',
              messages,
              temperature: 0.3,
              max_tokens: 150
            });
            
            return response.choices[0].message.content;
          } catch (error) {
            console.error('Error calling Groq API:', error);
            return null;
          }
    }
    createSystemPrompt(candidateData, currentState, nextState, extractedEntities) {

        return PromptUtils.createSystemPrompt(candidateData, currentState, nextState, extractedEntities);
      }
}

export default AIService