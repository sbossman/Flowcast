<template>
  <div class="tracker-container">
    <h1>Flowcast</h1>
    <!-- Log Period Button/Pop-up-->
    <button @click="showPeriodInput = true">Log Period</button>

    <!-- Only pops up if button is pressed :D-->
    <div v-if="showPeriodInput" class="modal">
      <div class="modal-content">
        <h2>Log Your Period</h2>
        <form @submit.prevent="logPeriod">
          <label>Expected Duration (days):</label>
          <input v-model.number="periodDuration" type="number" required />
          <button type="submit">Log</button>
        </form>
        <button @click="closeModal">Close</button>
      </div>
    </div>

    <!-- Displaying Current Menstrual Phase -->
    <div v-if="currPhase !== null">
      <h2>Currently in your {{ currPhase }}</h2>
    </div>
    <div v-else>
      <h2>Let's Get Started</h2>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";
import { calculatePhase } from './PhaseCalculator';
import {onMounted} from "vue";

const showPeriodInput = ref(false);
const periodDuration = ref(0);
const currPhase = ref(null);

const logPeriod = async () => {
  // calculating end date
  // NOTE: ASSUMING TODAY IS 1st DAY OF PERIOD
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + periodDuration.value);

  // adding dates to DB
  try {
    await addDoc(collection(db, 'periods'), {
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
    console.log('Period logged with start date:', today);
    closeModal();
    // calculating current phase
    currPhase.value = await calculatePhase(today, endDate)

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
  const querySnapshot = await getDocs(collection(db, 'periods'));
  if (!querySnapshot.empty) {
    const periods = querySnapshot.docs.map(doc => doc.data());
    periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const recentPeriod = periods[0];
    currPhase.value = await calculatePhase(recentPeriod.startDate, recentPeriod.endDate);
  }
});

</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>