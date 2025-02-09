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

    <h1 class = 'kinda-title'>Past Periods</h1>

    <Calendar  />

  </div>
</template>

<style scoped>
.user-home-container h1{
  font-size:42px;
  color: black;
  font-weight: bold;
}
.kinda-title{
  font-family:'Montserrat Alternates', sans-serif;
}
</style>