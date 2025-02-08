<script setup>
import { ref } from "vue"
import { useCollection } from "vuefire";
import { doc, getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirestore } from 'vuefire'
import { firebaseApp } from "@/firebase.js";

// const db = useFirestore()
const db = getFirestore(firebaseApp)

const startDate = ref("startDate")
const endDate = ref("startDate")
const auth = getAuth();

const submitPeriodBtn = () => {
  const data = {
    startDate: startDate.value,
    endDate: endDate.value
  }
  console.log(data);
  addPeriod(data)
}
const addPeriod = async (data) => {
  try{
    console.log("Data: ", data);
    const userPeriods = collection(db, "users", auth.currentUser.uid, "periods");
    const docRef = await addDoc(userPeriods, data);
    console.log("Document written with ID: ", docRef.id);
  } catch(e){
    console.error("errorrrrr: ", e)
  }
}

const periods = useCollection(collection(db, "users", auth.currentUser.uid, "periods"))


</script>
<template>
  <div class="user-home-container">
    <div class="log-period">
      <h2>Log Period</h2>
      <p>Start Date</p>
      <input type="datetime-local" v-model="startDate">
      <p>End Date</p>
      <input type="datetime-local" v-model="endDate">
      <p><button @click="submitPeriodBtn">Submit</button></p>
    </div>

    <h2>Past Periods</h2>
    <ul>
      <li v-for="period in periods" :key="period.id">
        {{ period.startDate }} - {{ period.endDate }}
      </li>
    </ul>
  </div>
</template>
