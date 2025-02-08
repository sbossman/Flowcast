import { db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

export const calculateAvgCycle = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'periods'));
      const startDates = querySnapshot.docs
        .map((doc) => new Date(doc.data().startDate))
        .sort((a, b) => a - b);
  
      const cycleLengths = [];
      for (let i = 1; i < startDates.length; i++) {
        const diffInTime = startDates[i] - startDates[i - 1];
        const diffInDays = diffInTime / (24*60*60*1000);
        cycleLengths.push(diffInDays);
      }
  
      if (cycleLengths.length > 0) {
        const sum = cycleLengths.reduce((acc, length) => acc + length, 0);
        return (sum / cycleLengths.length).toFixed(2);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error calculating average cycle length:', error);
    }
  };
  