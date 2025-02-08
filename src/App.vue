<script setup>
import { useFirestore } from 'vuefire'
import { useRouter } from 'vue-router'
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

const db = useFirestore()
const router = useRouter()

const isLoggedIn = ref(false);

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if(user){
      isLoggedIn.value = true;
    } else{
      isLoggedIn.value = false;
    }
  })
})

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  })
}
</script>

<template>
  <nav>
    <router-link to="/"><p class="nav-link">Home</p></router-link>
    <router-link to="/feed"><p class="nav-link">Feed</p></router-link>
    <router-link to="/tracker"><p class="nav-link">Tracker</p></router-link>
    <router-link to="/login"><p class="account" v-if="!isLoggedIn">Log In</p></router-link>
    <router-link to="/signup"><p class="account" v-if="!isLoggedIn">Sign Up</p></router-link>
    <button class="account" @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
  </nav>
  <router-view />
</template>

