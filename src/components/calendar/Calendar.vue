<script setup>
import {ref} from "vue";
import CalendarWeeks from "@/components/calendar/CalendarWeeks.vue";

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
  // console.log("LAST MONTH: ", numDaysInLastMon);
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

  console.log(daysArray);

  let weeksArr = [];
  for(let i = 0; i < numWeeksNecessary(y, m); i++){
    let daysArr = [];
    for(let j = 0; j < 7; j++){
      daysArr.push(daysArray[(i*7) + j])
    }
    weeksArr.push(daysArr);
  }
  return weeksArr;
}


const month = ref(currentMonth);
const monthNum = ref(currMonNum);
const year = ref(currentYear);
const weeksToMake = ref(numWeeksNecessary(currentYear, currMonNum));


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
          <div v-for="day in week" class="day-box">
            <p>{{ day }}</p>
          </div>
        </div>
      </div>
      <div class="nav-buttons">
        <button></button>
      </div>

    </div>
  </div>
</template>
<style>
h1{
  color: black;
}
.week-header{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.week-title{
  color: #673C4F;
  background-color: white;
  font-size: 14px;
  width: 75px;
  text-align: center;
}
.calendar-days{
  display: flex;
  flex-direction: column;
  border: 1px solid black;
}
.week-row{
  display: flex;
  flex-direction: row;
  margin: 0px;
  height: 75px;
}
.day-box{
  width: 75px;
  margin: 0px;
  border: 1px solid black;
}
</style>