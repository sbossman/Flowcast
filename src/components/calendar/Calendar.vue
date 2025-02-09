<script setup>
import {ref} from "vue";
import { useCollection } from "vuefire";
import {doc, getFirestore, collection, addDoc, getDocs} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {db, firebaseApp} from "@/firebase.js";
import {calculatePhase} from "@/components/PhaseCalculator.js";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = months[today.getMonth()];
const currMonNum = today.getMonth();

const checkIfPeriod = async (date) => {
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  const periods = useCollection(collection(db, "users", auth.currentUser.uid, "periods"))

  const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "periods"));
  if (!querySnapshot.empty) {
    const periods = querySnapshot.docs.map(doc => doc.data());
    let flag = false;
    console.log(date);
    for(let i = 0; i < periods.length; i++){
      let s = periods[i].startDate;
      let e = periods[i].endDate;
      if(s <= date && e >= date){
        flag = true;
      }
    }
    return flag;
  }
}

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
      const dayDate = new Date(y, m, d);
      const sameMon = !((d > 25 && i < 1) || (d < 8 && i > 3));
      daysArr.push({
        date: dayDate,
        day: d,
        sameMon: sameMon,
        period: checkIfPeriod(dayDate)
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



</script>
<template>
  <div>
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
               :class="{'diff-mon': !day.sameMon, 'period': day.period}">
            <p>{{ day.day }}</p>
          </div>
        </div>
      </div>
      <div class="nav-buttons">
        <button class="pn-btn" @click="toPrevMon"><<</button>
        <button class="today-btn" @click="toThisMon">Today</button>
        <button class="pn-btn" @click="toNextMon">>></button>
      </div>

    </div>
  </div>
</template>
<style>
h1{
  color: #673C4F;
  justify-self: center;
  font-weight: bold;
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
.day-box.diff-mon p{
  color: #646F76;
}
.day-box.period{
  background-color: #ffb4b8;
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