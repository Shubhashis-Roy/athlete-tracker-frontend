import { LeaderboardEntry } from "@/types";
import api from "./api";

export const leaderboardService = {
  // GET /leaderboard
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get("/leaderboard");

    return response?.data;
  },
};

export default leaderboardService;
