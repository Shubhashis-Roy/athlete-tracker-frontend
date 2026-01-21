import { Athlete } from "@/types";
import api from "./api";

export const athleteService = {
  // GET /athletes
  getAll: async (): Promise<Athlete[]> => {
    const response = await api.get("/athletes");
    return response.data;
  },

  // GET /athletes/:id
  getById: async (id: string): Promise<Athlete> => {
    const response = await api.get(`/athletes/${id}`);
    return response.data;
  },

  // POST /athletes
  create: async (
    athlete: Omit<Athlete, "id" | "createdAt">
  ): Promise<Athlete> => {
    const response = await api.post("/athletes", athlete);
    return response.data;
  },

  // PUT /athletes/:id
  update: async (id: string, athlete: Partial<Athlete>): Promise<Athlete> => {
    const response = await api.put(`/athletes/${id}`, athlete);
    return response.data;
  },

  // DELETE /athletes/:id
  delete: async (id: string): Promise<void> => {
    await api.delete(`/athletes/${id}`);
  },
};

export default athleteService;
