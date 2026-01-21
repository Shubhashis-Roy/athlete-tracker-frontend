import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  Athlete,
  TestScore,
  AthleteContextType,
  LeaderboardEntry,
} from "@/types";
import athleteService from "@/services/athleteService";
import api from "@/services/api";
import { useAuth } from "./AuthContext";

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

interface AthleteProviderProps {
  children: ReactNode;
}

export const AthleteProvider: React.FC<AthleteProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [testScores, setTestScores] = useState<TestScore[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch athletes when user is logged in
    if (user) {
      fetchAthletes();
    }
  }, [user]);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const data = await athleteService.getAll();
      setAthletes(data);
    } catch (error) {
      console.error("Failed to fetch athletes", error);
    } finally {
      setLoading(false);
    }
  };

  const addAthlete = async (athleteData: Omit<Athlete, "id" | "createdAt">) => {
    const newAthlete = await athleteService.create(athleteData);
    setAthletes((prev) => [...prev, newAthlete]);
  };

  const updateAthlete = async (id: string, athleteData: Partial<Athlete>) => {
    const updated = await athleteService.update(id, athleteData);

    setAthletes((prev) =>
      prev.map((athlete) => (athlete._id === id ? updated : athlete))
    );

    return updated;
  };

  const deleteAthlete = async (id: string) => {
    await athleteService.delete(id);

    setAthletes((prev) => prev.filter((athlete) => athlete._id !== id));
  };

  const getAthleteById = async (id: string) => {
    return await athleteService.getById(id);
  };

  // ---------------- TEST SCORES (REAL API) ----------------

  const addScore = async (scoreData: Omit<TestScore, "id" | "createdAt">) => {
    const response = await api.post("/scores", scoreData);
    setTestScores((prev) => [...prev, response.data]);
  };

  const addTests = async (scoreData: Omit<TestScore, "id" | "createdAt">) => {
    const response = await api.post("/tests", scoreData);
    setTestScores((prev) => [...prev, response.data]);
  };

  const updateTestScore = async (id: string, scoreData: Partial<TestScore>) => {
    const response = await api.put(`/scores/${id}`, scoreData);

    setTestScores((prev) =>
      prev.map((score) => (score.id === id ? response.data : score))
    );
  };

  const getTestScoresByAthleteId = async (athleteId: string) => {
    const response = await api.get(`/tests/${athleteId}`);
    return response.data;
  };

  const getLatestTestScore = async (athleteId: string) => {
    const scores = await getTestScoresByAthleteId(athleteId);
    return scores[0];
  };

  const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get("/leaderboard");
    return response.data;
  };

  const value: AthleteContextType = {
    athletes,
    testScores,
    loading,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    addScore,
    updateTestScore,
    getAthleteById,
    getTestScoresByAthleteId,
    getLatestTestScore,
    getLeaderboard,
    addTests,
  };

  return (
    <AthleteContext.Provider value={value}>{children}</AthleteContext.Provider>
  );
};

export const useAthletes = (): AthleteContextType => {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error("useAthletes must be used within an AthleteProvider");
  }
  return context;
};
