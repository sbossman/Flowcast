<script setup>
import readline from 'readline';
import { db } from '../../firebase.js';
import { collection, getDocs } from "firebase/firestore";
import { adviceGenerator } from '../geminiAI';
import { calculatePhase } from '../PhaseCalculator';
import { getAuth } from "firebase/auth";

// initializations
const auth = getAuth();
const userFeeling = ref('');
const advice = ref('');
const currPhase = ref(null);

// currPhase
const getCurrentPhase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
    if (!querySnapshot.empty) {
        const periods = querySnapshot.docs.map(doc => doc.data());
        periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        const recentPeriod = periods[0];
        currPhase.value = await calculatePhase(recentPeriod.startDate, recentPeriod.endDate);
    }
  } catch (error) {
    console.error('get current phase prob', error);
  }
};

// get advice based on input
const getAdvice = async () => {
    try {
        getCurrentPhase();
        if (userFeeling.value && currPhase.value != null) {
            const str1 = `How does feeling ${userFeeling.value} relate to being in your ${currPhase.value}?`;
            advice.value = await adviceGenerator(str1);
        }
    } catch (error) {
        console.error('get advice function', error);
    }
};
</script>



<template>
    <div class = "user-home-container">
        <h1>How are you feeling?</h1>
        <input
        v-model="userFeeling"
        type="text" 
        placeholder="Enter how you're feeling" 
        class="feeling-input"
        />
        <button @click="getAdvice" class="submit-button">Ask</button>
        <div v-if="advice" class="advice-response">
        <h2>Advice:</h2>
        <p>{{ advice }}</p>
        </div>
    </div>
</template>

<!--
<style scoped>
.chatbot-container {
  padding: 20px;
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.feeling-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.advice-response {
  margin-top: 20px;
}
</style>
-->
