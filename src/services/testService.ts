import { TestScore } from "@/types";
import api from "./api";

// These functions are structured for future API integration
// Currently, all data is managed through context with mock data

export const testService = {
  // GET /tests
  getAll: async (): Promise<TestScore[]> => {
    // When API is ready:
    // const response = await api.get('/tests');
    // return response.data;
    throw new Error("API not implemented - using context");
  },

  // GET /tests/athlete/:athleteId
  getByAthleteId: async (athleteId: string): Promise<TestScore[]> => {
    // When API is ready:
    // const response = await api.get(`/tests/athlete/${athleteId}`);
    // return response.data;
    throw new Error("API not implemented - using context");
  },

  // POST /tests
  create: async (
    testScore: Omit<TestScore, "id" | "createdAt">
  ): Promise<TestScore> => {
    // When API is ready:
    const response = await api.post("/tests", testScore);
    return response.data;
    throw new Error("API not implemented - using context");
  },

  // PUT /tests/:id
  update: async (
    id: string,
    testScore: Partial<TestScore>
  ): Promise<TestScore> => {
    // When API is ready:
    // const response = await api.put(`/tests/${id}`, testScore);
    // return response.data;
    throw new Error("API not implemented - using context");
  },
};

export default testService;
