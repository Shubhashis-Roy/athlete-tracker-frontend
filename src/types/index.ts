export type UserRole = "coach" | "viewer";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  token: string;
}

export interface Athlete {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  sport: string;
  email: string;
  phone: string;
  createdAt: string;
  imageUrl?: string;
}

export interface TestScore {
  _id: string;
  athleteId: string;
  sprintTime: number; // 30m sprint in seconds
  verticalJump: number; // in cm
  agilityTest: number; // in seconds
  enduranceTest: number; // in minutes
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  athlete: Athlete;
  totalScore: number;
  testScore?: TestScore;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isCoach: boolean;
}

export interface AthleteContextType {
  athletes: Athlete[];
  testScores: TestScore[];
  addAthlete: (athlete: Omit<Athlete, "_id" | "createdAt">) => void;
  updateAthlete: (_id: string, athlete: Partial<Athlete>) => void;
  deleteAthlete: (_id: string) => void;
  addScore: (score: Omit<TestScore, "_id" | "createdAt">) => void;
  updateTestScore: (_id: string, score: Partial<TestScore>) => void;
  getAthleteById: (_id: string) => Athlete | undefined;
  getTestScoresByAthleteId: (athleteId: string) => TestScore[];
  getLatestTestScore: (athleteId: string) => TestScore | undefined;
  getLeaderboard: () => LeaderboardEntry[];
}
