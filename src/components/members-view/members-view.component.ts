import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { Challenge } from '../../models';

@Component({
  selector: 'app-members-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersViewComponent {
  private stateService = inject(StateService);
  members = this.stateService.sortedMembers;
  
  activeChallenge = computed(() => {
    const now = new Date();
    return this.stateService.challenges().find(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return now >= start && now <= end;
    });
  });

  getTrophyColor(index: number): string {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-yellow-600';
    return 'text-gray-300';
  }
}
