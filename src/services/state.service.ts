import { Injectable, signal, computed } from '@angular/core';
import { Challenge, Protocol, Prize, Member } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly challenges = signal<Challenge[]>([
    {
      id: '1',
      name: 'Desafio 14 Dias Corpo em Paz',
      description: 'Um desafio focado em desinflamar e melhorar a digestão em 14 dias.',
      duration: 14,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      tasks: Array.from({ length: 14 }, (_, i) => ({
        day: i + 1,
        title: `Missão do Dia ${i + 1}`,
        motivationalText: 'Cada passo que você dá hoje é um investimento na sua saúde de amanhã. Força!',
        points: 10,
      })),
    },
     {
      id: '2',
      name: '7 Dias Detox',
      description: 'Uma semana para limpar o organismo e renovar as energias.',
      duration: 7,
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      tasks: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        title: `Foco Total no Dia ${i + 1}`,
        motivationalText: 'Continue firme, os resultados virão com a consistência.',
        points: 15,
      })),
    }
  ]);

  readonly protocols = signal<Protocol[]>([
    { id: 'p1', name: 'Protocolo Pré-Festa', description: 'O que comer antes de eventos sociais.', content: 'Foco em proteínas e fibras.' },
    { id: 'p2', name: 'Protocolo Pós-Páscoa', description: 'Para desinchar e voltar à rotina.', content: 'Muita água, chás e comida de verdade.' }
  ]);

  readonly prizes = signal<Prize[]>([
    { id: 'pr1', name: 'Consulta Bônus', description: 'Uma consulta de acompanhamento de 30 minutos.', requiredPoints: 200 },
    { id: 'pr2', name: 'Ebook de Receitas Exclusivo', description: 'Um ebook com 20 receitas saudáveis e práticas.', requiredPoints: 100 }
  ]);
  
  readonly members = signal<Member[]>([
    { id: 'm1', name: 'Ana Silva', points: 150, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'm2', name: 'Bruno Costa', points: 135, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 'm3', name: 'Carla Dias', points: 120, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { id: 'm4', name: 'Daniel Alves', points: 95, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
    { id: 'm5', name: 'Elisa Ferreira', points: 80, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' }
  ]);
  
  readonly sortedMembers = computed(() => this.members().slice().sort((a, b) => b.points - a.points));

  addChallenge(challenge: Challenge) {
    this.challenges.update(challenges => [...challenges, challenge]);
  }

  updateChallenge(updatedChallenge: Challenge) {
    this.challenges.update(challenges => challenges.map(c => c.id === updatedChallenge.id ? updatedChallenge : c));
  }

  getChallengeById(id: string) {
    return computed(() => this.challenges().find(c => c.id === id));
  }
  
  addProtocol(protocol: Protocol) {
      this.protocols.update(p => [...p, protocol]);
  }

  updateProtocol(updated: Protocol) {
      this.protocols.update(p => p.map(item => item.id === updated.id ? updated : item));
  }

  addPrize(prize: Prize) {
      this.prizes.update(p => [...p, prize]);
  }
  
  updatePrize(updated: Prize) {
      this.prizes.update(p => p.map(item => item.id === updated.id ? updated : item));
  }
}
