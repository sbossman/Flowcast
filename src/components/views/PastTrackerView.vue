<script setup>
import { ref } from "vue"
import { useCollection } from "vuefire";
import { doc, getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirestore } from 'vuefire'
import { firebaseApp } from "@/firebase.js";
import  Calendar from "@/components/calendar/Calendar.vue";

// const db = useFirestore()
const db = getFirestore(firebaseApp)

const auth = getAuth();

const periods = useCollection(collection(db, "users", auth.currentUser.uid, "periods"))


</script>
<template>
  <div class="user-home-container">

    <h2>Past Periods</h2>
    <ul>
      <li v-for="period in periods" :key="period.id">
        {{ period.startDate }} - {{ period.endDate }}
      </li>
    </ul>

    <Calendar  />

  </div>
</template>
<style scoped>
</style>