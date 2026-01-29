import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { Prize } from '../../models';

@Component({
  selector: 'app-prizes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prizes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizesComponent {
  private stateService = inject(StateService);
  prizes = this.stateService.prizes;
  
  showModal = signal(false);
  editingPrize = signal<Prize | null>(null);
  
  createNewPrize() {
    this.editingPrize.set({ id: '', name: '', description: '', requiredPoints: 0 });
    this.showModal.set(true);
  }
  
  editPrize(prize: Prize) {
    this.editingPrize.set({ ...prize });
    this.showModal.set(true);
  }
  
  savePrize() {
    const prize = this.editingPrize();
    if (!prize) return;
    
    if (prize.id) {
      this.stateService.updatePrize(prize);
    } else {
      prize.id = crypto.randomUUID();
      this.stateService.addPrize(prize);
    }
    
    this.closeModal();
  }
  
  closeModal() {
    this.showModal.set(false);
    this.editingPrize.set(null);
  }
}
