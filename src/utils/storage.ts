
import { CareerInfo } from "../types/career";

const STORAGE_KEY = "careerInfo";

export const storage = {
  saveCareerInfo: (data: Partial<CareerInfo>) => {
    const existingData = storage.getCareerInfo();
    const newData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },

  getCareerInfo: (): CareerInfo => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  clearCareerInfo: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  resetAllResponses: () => {
    // Completely remove all stored data
    localStorage.removeItem(STORAGE_KEY);
    console.log("All responses have been reset");
  }
};
