import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChallengeEditorComponent } from './components/challenge-editor/challenge-editor.component';
import { LibraryComponent } from './components/protocols/protocols.component';
import { PrizesComponent } from './components/prizes/prizes.component';
import { MembersViewComponent } from './components/members-view/members-view.component';

type View = 'dashboard' | 'library' | 'prizes' | 'members-view';
type EditorView = { view: 'editor', id: string | null };
type CurrentView = { view: View } | EditorView;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    ChallengeEditorComponent,
    LibraryComponent,
    PrizesComponent,
    MembersViewComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  currentView = signal<CurrentView>({ view: 'dashboard' });

  menuItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Painel', icon: 'layout-dashboard' },
    { id: 'library', label: 'Biblioteca', icon: 'library' },
    { id: 'prizes', label: 'Prêmios', icon: 'trophy' },
    { id: 'members-view', label: 'Visão do Membro', icon: 'users' },
  ];

  isCurrentView(viewId: string): boolean {
    const current = this.currentView();
    return current.view === viewId;
  }
  
  isEditorView(): boolean {
      const current = this.currentView();
      return current.view === 'editor';
  }

  getEditorId(): string | null {
      const current = this.currentView();
      if (current.view === 'editor') {
          return current.id;
      }
      return null;
  }

  changeView(view: View) {
    this.currentView.set({ view });
  }

  navigateToEditor(challengeId: string | null) {
    this.currentView.set({ view: 'editor', id: challengeId });
  }
}
