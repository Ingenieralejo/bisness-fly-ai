import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

/**
 * SERVICE: NEURAL INTERFACE LAYER (LOCAL LLM)
 * Connects directly to the Local Open Source Model (Ollama)
 * Powered by Llama 3 / Phi 3 / Mistral
 */
@Injectable()
export class LocalModelService {
  private readonly logger = new Logger(LocalModelService.name);
  private readonly ollamaUrl = 'http://localhost:11434/api/generate';

  /**
   * Execute a command using the local brain (The Queen - Llama 3)
   */
  async executeReasoning(prompt: string, context = ''): Promise<string> {
    return this.generate('llama3:8b', prompt, context);
  }

  /**
   * Execute a task using a worker agent (Unified to Llama 3)
   */
  async executeTask(prompt: string, context = ''): Promise<string> {
    return this.generate('llama3:8b', prompt, context);
  }

  /**
   * Universal Generative Neural Function
   */
  private async generate(model: string, prompt: string, context: string): Promise<string> {
    this.logger.log(`🧠 NEURAL SWARM: Running local inference [${model}]...`);
    
    try {
      const response = await axios.post(this.ollamaUrl, {
        model: model,
        prompt: prompt,
        stream: false,
        system: `You are an core AI in the WEALTH MATRIX (FLY.AI Ecosystem). 
                 You operate autonomously to generate revenue. 
                 Language: Spanish (unless asked otherwise). 
                 Context: ${context}`
      });

      return response.data.response;
    } catch (error: unknown) {
       const errMsg = error instanceof Error ? error.message : 'Unknown LLM error';
       this.logger.error(`❌ NEURAL ERROR: Failed to connect to local model ${model}: ${errMsg}`);
       throw new Error(`Local model interaction failed: ${errMsg}`);
    }
  }
}
