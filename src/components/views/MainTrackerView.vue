<script setup>
import { ref } from 'vue';
import { db } from '../../firebase.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { calculatePhase } from '../PhaseCalculator.js';
import {onMounted} from "vue";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const showPeriodInput = ref(false);
const currPhase = ref(null);
const startDate = ref("startDate");
const endDate = ref("endDate");

const logPeriod = async () => {
  // calculating end date
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  // adding dates to DB
  try {
    await addDoc(collection(db, "users", auth.currentUser.uid, "periods"), {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    })
    console.log('Period logged with start date:', start.toISOString().split('T')[0]);
    console.log('Period logged with end date:', end.toISOString().split('T')[0]);
    closeModal();
    // calculating current phase
    currPhase.value = await calculatePhase(start, end)
    console.log(currPhase.value);
  } catch (error) {
    console.error('Error logging period:', error);
  }
};

const closeModal = () => {
  showPeriodInput.value = false;
};

// keeps currPhase updated. idk if there's an easier way to fetch most recent period
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
  if (!querySnapshot.empty) {
    const periods = querySnapshot.docs.map(doc => doc.data());
    periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentPeriod = periods[0];

    // past period, use that one
    const currentDate = new Date();
    if (new Date(recentPeriod.endDate) < currentDate) {
      currPhase.value = await calculatePhase(recentPeriod.startDate, recentPeriod.endDate);
    } else {
      // latest period is ongoing
      currPhase.value = await calculatePhase(recentPeriod.startDate, currentDate);
    }
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
            <label>End Date: </label>
            <input type="date" v-model="endDate">
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
