<script setup>
import { ref } from 'vue';
import { db } from '../../firebase.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { calculatePhase } from '../PhaseCalculator.js';
import { calculateAvgCycle } from '../cycleCalculator.js';
import {onMounted} from "vue";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const showPeriodInput = ref(false);
const currPhase = ref(null);
const startDate = ref("startDate");
const endDate = ref("endDate");
const nextPeriod = ref(null);

// predicting next period
const predictPeriod = async(mostRecent) => {
  try {
    const avgCycle = await calculateAvgCycle();
    if (typeof avgCycle !== 'number' || isNaN(avgCycle)) {
      console.error('invalid avg:', avgCycle);
      return;
    }

    //mostRecent as a date
    const mostRecentDate = new Date(mostRecent);
    if (isNaN(mostRecentDate.getTime())) {
      console.error('invalid recent date:', mostRecent);
      return;
    }

    const predictedDate = new Date(mostRecentDate);
    predictedDate.setDate(mostRecentDate.getDate() + avgCycle);

    nextPeriod.value = predictedDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('error w predicting period:', error);
  }
};

const dateToString = (date) => {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const splitString = date.split("-");
  let year = splitString[0]
  let monthNum = splitString[1]
  let month = months[Number(monthNum) - 1]
  let day = splitString[2]
  return month + " " + day + ", " + year;
}

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
    predictPeriod(start);
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
      predictPeriod(recentPeriod.startDate);
    } else {
      // latest period is ongoing
      currPhase.value = await calculatePhase(recentPeriod.startDate, currentDate);
      predictPeriod(recentPeriod.startDate);
    }
  }
});

</script>
<template>
  <div class="user-home-container">
    <h1 class="flowcast-title">Period Tracker</h1>
    <!-- only pops up if button is pressed :D-->
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


    <div class="inner-home-div">
      <button class="log-period" @click="showPeriodInput = true">Log Period</button>
      <div class="analysis-div">
        <!-- current phase -->
        <div v-if="currPhase !== null">
          <h2 class="phase-msg">Currently in your <span id="phase"> {{ currPhase }} </span></h2>
        </div>
        <div v-else>
          <h2 class="phase-msg">Let's Get Started</h2>
        </div>

        <!-- next period -->
         <div v-if="nextPeriod !== null">
          <h2 class="phase-msg">Your next period will be <span id="phase"> {{ dateToString(nextPeriod) }}</span></h2>
         </div>
         <div v-else>
          <h2 class="phase-msg">Loading!</h2>
         </div>
      </div>
      <!-- Log Period Button/Pop-up-->
    </div>


  </div>
</template>
