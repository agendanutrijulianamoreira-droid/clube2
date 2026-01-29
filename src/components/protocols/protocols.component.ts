import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { Protocol } from '../../models';

@Component({
  selector: 'app-protocols',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './protocols.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtocolsComponent {
  private stateService = inject(StateService);
  protocols = this.stateService.protocols;
  
  showModal = signal(false);
  editingProtocol = signal<Protocol | null>(null);
  
  createNewProtocol() {
    this.editingProtocol.set({ id: '', name: '', description: '', content: '' });
    this.showModal.set(true);
  }
  
  editProtocol(protocol: Protocol) {
    this.editingProtocol.set({ ...protocol }); // Create a copy
    this.showModal.set(true);
  }
  
  saveProtocol() {
    const protocol = this.editingProtocol();
    if (!protocol) return;
    
    if (protocol.id) {
      this.stateService.updateProtocol(protocol);
    } else {
      protocol.id = crypto.randomUUID();
      this.stateService.addProtocol(protocol);
    }
    
    this.closeModal();
  }
  
  closeModal() {
    this.showModal.set(false);
    this.editingProtocol.set(null);
  }
}
