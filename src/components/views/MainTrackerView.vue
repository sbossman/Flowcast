<script setup>
import { ref } from 'vue';
import { db } from '../../firebase.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { calculatePhase } from '../PhaseCalculator.js';
import {onMounted} from "vue";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const showPeriodInput = ref(false);
const periodDuration = ref(0);
const currPhase = ref(null);
const startDate = ref("startDate");

const logPeriod = async () => {
  // calculating end date
  // NOTE: ASSUMING TODAY IS 1st DAY OF PERIOD
  const start = new Date(startDate.value);
  const end = new Date();
  end.setDate(start.getDate() + periodDuration.value);

  // adding dates to DB
  try {
    await addDoc(collection(db, "users", auth.currentUser.uid, "periods"), {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });
    console.log('Period logged with start date:', start);
    closeModal();
    // calculating current phase
    currPhase.value = await calculatePhase(start, end)

  } catch (error) {
    console.error('Error logging period:', error);
  }
};

const closeModal = () => {
  showPeriodInput.value = false;
  periodDuration.value = 0;
};

// keeps currPhase updated. idk if there's an easier way to fetch most recent period
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
  console.log("HELLO");
  if (!querySnapshot.empty) {
    console.log(querySnapshot);
    const periods = querySnapshot.docs.map(doc => doc.data());
    periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentPeriod = periods[0];
    currPhase.value = await calculatePhase(recentPeriod.startDate, recentPeriod.endDate);
  }
});

</script>
<template>
  <div class="user-home-container">
    <h1 class="flowcast-title">Flowcast</h1>
    <!-- Log Period Button/Pop-up-->
    <button class="log-period" @click="showPeriodInput = true">Log Period</button>

    <!-- Only pops up if button is pressed :D-->
    <div v-if="showPeriodInput" class="modal">
      <div class="modal-content">
        <h2>Log Your Period</h2>
        <form @submit.prevent="logPeriod">
          <div class="input-section">
            <label>Start Date: </label>
            <input type="date" v-model="startDate">
          </div>
          <div class="input-section">
            <label>Expected Duration (days):</label>
            <input v-model.number="periodDuration" type="number" required />
          </div>
          <div class="button-section">
            <button id="close-btn" @click="closeModal">Close</button>
            <button id="submission-btn" type="submit">Log</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Displaying Current Menstrual Phase -->
    <div v-if="currPhase !== null">
      <h2 class="phase-msg">Currently in your <span id="phase"> {{ currPhase }} </span></h2>
    </div>
    <div v-else>
      <h2>Let's Get Started</h2>
    </div>

  </div>
</template>
