import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { Challenge } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  stateService = inject(StateService);
  challenges = this.stateService.challenges;

  editChallenge = output<string>();
  newChallenge = output<void>();

  onNewChallengeClick() {
    this.newChallenge.emit();
  }

  onEditChallengeClick(id: string) {
    this.editChallenge.emit(id);
  }

  isChallengeActive(challenge: Challenge): boolean {
    const now = new Date();
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    return now >= start && now <= end;
  }
  
  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
