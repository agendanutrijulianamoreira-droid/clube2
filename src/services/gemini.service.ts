import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Challenge, DailyTask } from '../models';

// WARNING: Do not use process.env in client-side code. This is a placeholder for the Applet environment.
declare const process: any;

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    try {
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      } else {
        console.warn('API_KEY environment variable not found.');
        this.error.set('Chave de API do Google GenAI não configurada.');
      }
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI', e);
      this.error.set('Falha ao inicializar o serviço de IA. Verifique a chave de API e as configurações.');
    }
  }

  async generateChallenge(prompt: string, duration: 7 | 14 | 21): Promise<Challenge | null> {
    if (!this.ai) {
      this.error.set('Serviço de IA não está disponível.');
      return null;
    }
    
    this.loading.set(true);
    this.error.set(null);

    const fullPrompt = `Gere um desafio nutricional de ${duration} dias com o tema: "${prompt}". 
    Crie um nome criativo para o desafio. 
    Crie uma descrição curta e motivadora.
    Para cada um dos ${duration} dias, crie uma tarefa (missão) com um título curto e um texto motivacional de 1 a 2 frases. 
    A pontuação para cada tarefa deve ser 10.
    O resultado deve ser um JSON estruturado.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Nome criativo do desafio.' },
              description: { type: Type.STRING, description: 'Descrição motivadora do desafio.' },
              tasks: {
                type: Type.ARRAY,
                description: `Uma lista de ${duration} tarefas diárias.`,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER, description: 'O número do dia no desafio, começando em 1.' },
                    title: { type: Type.STRING, description: 'Um título curto e claro para a missão do dia.' },
                    motivationalText: { type: Type.STRING, description: 'Um texto motivacional curto para o dia.' },
                    points: { type: Type.INTEGER, description: 'A pontuação para completar a tarefa.' },
                  },
                },
              },
            },
          },
        },
      });

      const jsonResponse = JSON.parse(response.text);
      const now = new Date();
      
      const newChallenge: Challenge = {
        id: crypto.randomUUID(),
        name: jsonResponse.name,
        description: jsonResponse.description,
        duration: duration,
        startDate: now.toISOString(),
        endDate: new Date(now.getTime() + (duration - 1) * 24 * 60 * 60 * 1000).toISOString(),
        tasks: jsonResponse.tasks,
      };

      return newChallenge;

    } catch (e: any) {
      console.error('Error generating challenge with Gemini:', e);
      this.error.set('Ocorreu um erro ao gerar o desafio. Tente novamente.');
      return null;
    } finally {
      this.loading.set(false);
    }
  }
}
