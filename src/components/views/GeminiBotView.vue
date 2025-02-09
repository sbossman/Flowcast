<script setup>
import { ref } from 'vue';
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
    if (!auth.currentUser) {
        console.error("Not logged in.");
        return;
    }
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
        await getCurrentPhase();
        if (userFeeling.value && currPhase.value != null) {
            console.log(userFeeling.value, currPhase.value);
            const str1 = `How does feeling ${userFeeling.value} relate to being in your ${currPhase.value}, and what are natural things I can do to help?`;
            advice.value = await adviceGenerator(str1);
        }
    } catch (error) {
        console.error('get advice function', error);
    }
};
</script>

<template>
    <div class = "user-home-container">
        <h1 class="flowcast-title">Cycle Advice</h1>
        <h2 class="question-title">How are you feeling?</h2>
        <h2 class="question-subtitle">Get advice for each phase of your cycle.</h2>
        <input
        v-model="userFeeling"
        type="text" 
        placeholder="Enter how you're feeling" 
        class="feeling-input"
        />
        <button @click="getAdvice" class="submit-button">Submit</button>

        <!-- Advice Display -->
        <div v-if="advice !==''" class="advice-response">
        <h2>Advice:</h2>
        <p>{{ advice }}</p>
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.flowcast-title{
  color: black;
  text-align: center;
  font-size: 64px;
  font-weight: bold;
  font-family:'Montserrat Alternates', sans-serif;
  letter-spacing: 5px;
}

.question-title {
  font-size: 24px;
  color: black;
  margin-bottom: 5px;
  font-style: italic;
  text-align: center;
  font-family:'Montserrat Alternates', sans-serif;
}

.question-subtitle {
  font-size: 16px;
  color: black;
  margin-bottom: 10px;
  font-style: italic;
  text-align: center;
  font-family:'Montserrat Alternates', sans-serif;
}


.feeling-input {
  width: 15%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}


.feeling-input:focus {
  outline: none;
  border-color: #9b96fa;
}


.submit-button {
  padding: 6px 14px;
  background-color: #673C4F;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  font-family:'Montserrat Alternates', sans-serif;
  color: white;
}

.submit-button:hover {
  background-color: #837ee5;;
}

.advice-response {
  background-color: #faefff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
  width: 70%;
  max-height: 350px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.advice-response h2 {
  font-size: 1.5rem;
  color: #333;
}


.advice-response p {
  font-size: 14adpx;
  color: #555555;
  line-height: 1.5;
}

</style>