import { calculateAvgCycle } from "./cycleCalculator.js";

export const calculatePhase = async (startDate, endDate) => {
    const avgLength = await calculateAvgCycle();
    if (!avgLength) {
        console.error('Insufficient data to calculate average cycle length.');
        return null;
      }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime()-start.getTime()) / (24*60*60*1000));
  
    if (today <= end) {
      return 'Menstrual Phase';
    }
    else if (daysSinceStart <= Math.floor(avgLength/2)) {
      return 'Follicular Phase';
    }
    else if (daysSinceStart == Math.floor(avgLength/2) + 1) {
      return 'Ovulation Phase';
    }
    else {
      return 'Luteal Phase';
    }
  };