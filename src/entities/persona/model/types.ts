export interface Persona {
  id: string;
  name: string;
  occupation: string;
  difficulty: number;
  description: string;
  goal: string;
}

export interface Message {
  role: 'user' | 'scammer';
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  type: 'photo' | 'status' | 'life_event';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
}

export interface SessionData {
  sessionId: string;
  persona: {
    id: string;
    name: string;
    difficulty: string;
  };
  openingMessage: string;
  hint: string;
}

export interface TrainingResult {
  finalScore: number;
  totalTurns: number;
  durationSeconds: number;
  tacticsEncountered: string[];
}
