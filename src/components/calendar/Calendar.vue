<script setup>
import {onMounted, ref} from "vue";
import { useCollection } from "vuefire";
import {doc, getFirestore, collection, updateDoc, getDocs, deleteDoc, addDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {db, firebaseApp} from "@/firebase.js";
import {calculatePhase} from "@/components/PhaseCalculator.js";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = months[today.getMonth()];
const currMonNum = today.getMonth();



const numWeeksNecessary = (y, m) => {
  const tempDate = new Date(y, (m+1), 0);
  const numDaysInMon = tempDate.getDate();
  const firstDayOfMonth = new Date(y, m, 1);
  const weekdayOfFDOM = firstDayOfMonth.getDay();

  const totalDays = numDaysInMon + weekdayOfFDOM;
  return Math.ceil(totalDays/7);
}

const getDaysArray = (y, m) => {
  const tempDate = new Date(y, (m+1), 0);
  const numDaysInMon = tempDate.getDate();
  const firstDayOfMonth = new Date(y, m, 1);

  const weekdayOfFDOM = firstDayOfMonth.getDay();


  // Fill in the empty days before the start of the month
  const daysArray = [];

  let mm = m;
  if(mm == 0){
    mm = 12;
  }
  const numDaysInLastMon = new Date(y, mm, 0);
  for (let i = 0; i < weekdayOfFDOM; i++) {
    const d = numDaysInLastMon.getDate() - (weekdayOfFDOM - 1 - i) //- weekdayOfFDOM)
    daysArray.push(d);
  }

  // Add the days of the current month
  for (let i = 1; i <= numDaysInMon; i++) {
    daysArray.push(i);
  }

  const sizeDaysArray = daysArray.length;
  for(let i = 1; i <= ((numWeeksNecessary(y, m)*7) - sizeDaysArray); i++){
    daysArray.push(i)
  }

  let weeksArr = [];
  for(let i = 0; i < numWeeksNecessary(y, m); i++){
    let daysArr = [];
    for(let j = 0; j < 7; j++){
      const d = daysArray[(i*7) + j];
      let mon = m;
      let yr = y;
      if(d > 20 && i < 1){
        if (mon === 0) {
          mon = 11;
          yr--;
        } else {
          mon--;
        }
      }
      else if(d < 8 && i > 3){
        if (mon === 11) {
          mon = 0;
          yr++;
        } else {
          mon++;
        }

      }
      const dayDate = new Date(yr, mon, d);
      const sameMon = !((d > 20 && i < 1) || (d < 8 && i > 3));
      daysArr.push({
        date: dayDate,
        day: d,
        sameMon: sameMon,
        isPeriod: false
      })
    }
    weeksArr.push(daysArr);
  }
  return weeksArr;
}

const month = ref(currentMonth);
const monthNum = ref(currMonNum);
const year = ref(currentYear);
const weeksToMake = ref(numWeeksNecessary(currentYear, currMonNum));

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const toPrevMon = () => {
  if (monthNum.value === 0) {
    monthNum.value = 11;
    year.value--;
  } else {
    monthNum.value--;
  }
  month.value = months[monthNum.value]
}

const toThisMon = () => {
  month.value = currentMonth;
  year.value = currentYear
}

const toNextMon = () => {
  if (monthNum.value === 11) {
    monthNum.value = 0;
    year.value++;
  } else {
    monthNum.value++;
  }
  month.value = months[monthNum.value]
}

const periods = ref([])

const fetchPeriods = async () => {
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
  if(!querySnapshot.empty){
    // periods.value = querySnapshot.docs.map(doc => doc.data());
    periods.value = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        data: doc.data()
      }
    });
  }
}

const periodOnDay = (day) => {
  return periods.value.filter(event => {
    let s = event.data.valueOf().startDate;
    let e = event.data.valueOf().endDate;
    let now = formatDate(day);
    return now >= s && now <= e;
    // const eventDate = new Date(event.date.seconds * 1000); // Firestore stores dates as timestamp (seconds)
    // return eventDate.getDate() === day && eventDate.getMonth() === currentMonth.value && eventDate.getFullYear() === currentYear.value;
  });
}

const selectedDay = ref(null)
const selectedPeriod = ref(null)
const startDate = ref(null)
const endDate = ref(null)
const periodId = ref(null)
const showAddPeriod = ref(null)

const selectDay = (day) => {
  selectedDay.value = day;
  let periods = periodOnDay(day);
  if(periods.length > 0){
    selectedPeriod.value = periods.at(0);
    startDate.value = periods.at(0).data.startDate;
    endDate.value = periods.at(0).data.endDate;
    showModifyPeriod.value = true;
    periodId.value = periods.at(0).id;
  }
  else{
    showAddPeriod.value = true;
  }
}
const modifyPeriod = async (docId, data) => {
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  try {
    const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
    const documentRef = doc(db, "users", auth.currentUser.uid, "periods", docId);

    if(del.value){
      await deleteDoc(documentRef, data)
    }
    else{
      await updateDoc(documentRef, data);
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

const del = ref(false);
const logPeriod = async () => {
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  await modifyPeriod(periodId.value, {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  })
  closeModal()
  await fetchPeriods()
}


const addPeriod = async () => {
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  // calculating end date
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  // adding dates to DB
  try {
    await addDoc(collection(db, "users", auth.currentUser.uid, "periods"), {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    })
    closeModal();
    await fetchPeriods()
  } catch (error) {
    console.error('Error logging period:', error);
  }
};

const closeModal = () => {
  selectedDay.value = null;
  selectedPeriod.value = null;
  startDate.value = null;
  endDate.value = null;
  showModifyPeriod.value = false;
  del.value = false;
  showAddPeriod.value = false;
}

const deletePeriod = async (docId) => {
  del.value = true;
}

onMounted(() => {
  fetchPeriods();
});

const showModifyPeriod = ref(false);

</script>
<template>
  <div class="calendar">
    <h1>{{ month }} {{ year }}</h1>
    <div>
      <div class="week-header">
        <h2 class="week-title">Sunday</h2>
        <h2 class="week-title">Monday</h2>
        <h2 class="week-title">Tuesday</h2>
        <h2 class="week-title">Wednesday</h2>
        <h2 class="week-title">Thursday</h2>
        <h2 class="week-title">Friday</h2>
        <h2 class="week-title">Saturday</h2>
      </div>
      <div class="calendar-days">
        <div v-for="week in getDaysArray(year, monthNum)" class="week-row">
          <div v-for="day in week"
               class="day-box"
               :class="{'diff-mon': !day.sameMon, 'period': periodOnDay(day.date).length > 0}"
               @click="selectDay(day.date)"
          >
            <p>{{ day.day }}</p>
<!--            <p>{{ periodOnDay(day.date)}}</p>-->
          </div>
        </div>
      </div>
      <div class="nav-buttons">
        <button class="pn-btn" @click="toPrevMon"><<</button>
        <button class="today-btn" @click="toThisMon">Today</button>
        <button class="pn-btn" @click="toNextMon">>></button>
      </div>

    </div>
    <div v-if="showModifyPeriod" class="modal">
      <div class="modal-content">
        <h2>Modify Period</h2>
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
            <button id="delete-btn" @click="deletePeriod(periodId)">Delete</button>
            <button id="submission-btn" type="submit">Modify</button>
          </div>
        </form>

      </div>
    </div>
    <div v-else-if="showAddPeriod" class="modal">
      <div class="modal-content">
        <h2>Add Period</h2>
        <form @submit.prevent="addPeriod">
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
  </div>
</template>
<style>
.calendar h1{
  color: #673C4F;
  justify-self: center;
  font-weight: bold;
  font-size: 24px;
}
.week-header{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  border: 1px solid #673C4F;
}
.week-header h2{
  color: white;
}
.week-title{
  color: white;
  background-color: #673C4F;
  font-size: 15px;
  width: 100px;
  border: 1px solid #673C4F;
  overflow: hidden;
  text-align: center;
}
.calendar-days{
  display: flex;
  flex-direction: column;
  border: 1px solid #673C4F;
}
.week-row{
  display: flex;
  flex-direction: row;
  margin: 0px;
  height: 75px;
}
.day-box{
  width: 100px;
  margin: 0px;
  border: 1px solid #673C4F;
  justify-content: center;
  padding: 2px 5px 5px 2px;
  color: black;
  background-color: white;
}
.day-box:hover{
  cursor: pointer;
}
.day-box.diff-mon p{
  color: #646F76;
}
.day-box.period{
  background-color: #F1555A;
}
.nav-buttons{
  margin: 10px;
  display: flex;
  justify-content: space-between;
}

.pn-btn{
  background-color: #673C4F;
  border-radius: 20px;
  border: 0 solid;
  font-size: 16px;
  width: 60px;
  padding: 10px;
  color: white;
  font-weight: bold;
}


.today-btn{
  background-color: #673C4F;
  border-radius: 20px;
  border: 0 solid;
  font-size: 16px;
  width: 80px;
  padding: 10px;
  color: white;
  font-weight: bold;
}

.pn-btn:hover{
  background-color: #8d536d;
  cursor: pointer;
}

</style>