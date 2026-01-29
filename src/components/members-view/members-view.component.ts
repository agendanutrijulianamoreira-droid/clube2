import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { GeminiService } from '../../services/gemini.service';
import { Challenge } from '../../models';

interface Message {
  author: 'user' | 'luna';
  content: string;
}

@Component({
  selector: 'app-members-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersViewComponent {
  private stateService = inject(StateService);
  geminiService = inject(GeminiService);
  members = this.stateService.sortedMembers;
  
  userInput = signal('');
  messages = signal<Message[]>([]);

  activeChallenge = computed(() => {
    const now = new Date();
    return this.stateService.challenges().find(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return now >= start && now <= end;
    });
  });

  async sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.geminiService.loading()) return;

    this.messages.update(m => [...m, { author: 'user', content: text }]);
    this.userInput.set('');

    const response = await this.geminiService.generateCoachResponse(text);
    if (response) {
      this.messages.update(m => [...m, { author: 'luna', content: response }]);
    } else {
      // Handle error case, maybe show an error message in chat
       this.messages.update(m => [...m, { author: 'luna', content: 'Desculpe, não consegui processar sua mensagem. Tente novamente.' }]);
    }
  }

  getTrophyColor(index: number): string {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-yellow-600';
    return 'text-gray-300';
  }
}
