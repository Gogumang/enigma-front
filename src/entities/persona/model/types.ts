export interface Persona {
  id: string;
  name: string;
  occupation: string;
  platform: string;
  profile_photo: string;
  difficulty: number;
  description: string;
  goal: string;
}

export interface Message {
  role: 'user' | 'scammer';
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  type: 'photo' | 'status' | 'life_event' | 'reel';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares?: number;
  time: string;
}

export interface SessionData {
  sessionId: string;
  persona: {
    id: string;
    name: string;
    platform?: string;
    profile_photo?: string;
    difficulty: string;
    occupation?: string;
    backstory?: string;
  };
  openingMessage: string;
  feedPosts?: Post[];
  hint: string;
}

export interface TrainingResult {
  finalScore: number;
  totalTurns: number;
  durationSeconds: number;
  tacticsEncountered: string[];
}
