import { db } from '../firebase.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const auth = getAuth();

export const calculateAvgCycle = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
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
        const avgCycle = sum / cycleLengths.length;
        console.log('Average cycle length:', avgCycle);
        return parseFloat(avgCycle.toFixed(2));
      } else {
        console.log('idk my dude');
        return 0;
      }
    } catch (error) {
      console.error('error calculating avg cycle length:', error);
      return 0;
    }
  };
  