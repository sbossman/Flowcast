<script setup>
import { useCollection } from 'vuefire'
import { doc, getFirestore, collection } from "firebase/firestore";
import { useFirestore } from 'vuefire'
import { firebaseApp } from "@/firebase.js";

// const db = useFirestore()
const db = getFirestore(firebaseApp)
const todos = useCollection(collection(db, "todos"))

console.log(todos);

defineProps({
  msg: {
    type: String,
    required: true,
  },
})


</script>

<template>
  <div class="greetings">
    <ul>
      <li v-for="todo in todos" :key="todo.id" >
        <span>TASK: {{ todo.title }}</span>
      </li>
    </ul>

  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
