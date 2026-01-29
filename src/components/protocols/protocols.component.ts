import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { Protocol } from '../../models';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protocols.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  private stateService = inject(StateService);
  private libraryItems = this.stateService.libraryItems;
  
  freeContent = computed(() => this.libraryItems().filter(item => item.type === 'free'));
  vipContent = computed(() => this.libraryItems().filter(item => item.type === 'vip'));
}
