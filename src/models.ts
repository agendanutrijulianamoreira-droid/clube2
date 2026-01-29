export interface DailyTask {
  day: number;
  title: string;
  motivationalText: string;
  points: number;
  audioUrl?: string;
  videoUrl?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: 7 | 14 | 21;
  startDate: string; // ISO string
  endDate: string; // ISO string
  tasks: DailyTask[];
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  content: string; // Can be markdown or HTML
  type: 'free' | 'vip';
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  requiredPoints: number;
}

export interface Member {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
}
