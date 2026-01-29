import { Component, ChangeDetectionStrategy, input, output, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { GeminiService } from '../../services/gemini.service';
import { Challenge, DailyTask } from '../../models';

@Component({
  selector: 'app-challenge-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './challenge-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChallengeEditorComponent {
  challengeId = input<string | null>(null);
  closeEditor = output<void>();

  private stateService = inject(StateService);
  geminiService = inject(GeminiService);

  challenge = signal<Challenge | null>(null);
  aiPrompt = signal('');
  aiDuration = signal<7 | 14 | 21>(7);
  
  expandedDay = signal<number | null>(null);

  constructor() {
    effect(() => {
      const id = this.challengeId();
      if (id) {
        const existingChallenge = this.stateService.getChallengeById(id)();
        this.challenge.set(JSON.parse(JSON.stringify(existingChallenge))); // Deep copy for editing
      } else {
        // Create a new empty challenge structure
        this.challenge.set(this.createEmptyChallenge());
      }
    });
  }
  
  toggleDay(day: number) {
    if(this.expandedDay() === day){
      this.expandedDay.set(null);
    } else {
      this.expandedDay.set(day);
    }
  }

  createEmptyChallenge(): Challenge {
    const now = new Date();
    const duration = 7;
    return {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      duration: duration,
      startDate: now.toISOString().split('T')[0],
      endDate: new Date(now.getTime() + (duration - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tasks: Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        title: '',
        motivationalText: '',
        points: 10,
      })),
    };
  }

  async generateWithAI() {
    if (!this.aiPrompt()) return;
    const generatedChallenge = await this.geminiService.generateChallenge(this.aiPrompt(), this.aiDuration());
    if (generatedChallenge) {
      const currentChallenge = this.challenge();
      generatedChallenge.id = currentChallenge ? currentChallenge.id : crypto.randomUUID(); // Keep original ID
      generatedChallenge.startDate = currentChallenge?.startDate || new Date().toISOString().split('T')[0];
      generatedChallenge.endDate = new Date(new Date(generatedChallenge.startDate).getTime() + (generatedChallenge.duration - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      this.challenge.set(generatedChallenge);
    }
  }

  saveChallenge() {
    const currentChallenge = this.challenge();
    if (currentChallenge) {
      if (this.challengeId()) {
        this.stateService.updateChallenge(currentChallenge);
      } else {
        this.stateService.addChallenge(currentChallenge);
      }
      this.closeEditor.emit();
    }
  }

  updateDuration(newDuration: number) {
      const duration = newDuration as 7 | 14 | 21;
      this.challenge.update(c => {
          if (!c) return c;
          
          c.duration = duration;
          const currentTasks = c.tasks || [];
          const newTasks: DailyTask[] = [];

          for (let i = 0; i < duration; i++) {
              if (currentTasks[i]) {
                  newTasks.push(currentTasks[i]);
              } else {
                  newTasks.push({ day: i + 1, title: '', motivationalText: '', points: 10 });
              }
          }
          c.tasks = newTasks;
          this.updateEndDate();
          return c;
      });
  }

  updateEndDate() {
    this.challenge.update(c => {
      if (!c || !c.startDate) return c;
      const startDate = new Date(c.startDate);
      const endDate = new Date(startDate.getTime() + (c.duration - 1) * 24 * 60 * 60 * 1000);
      c.endDate = endDate.toISOString().split('T')[0];
      return c;
    });
  }

  onClose() {
    this.closeEditor.emit();
  }
}
