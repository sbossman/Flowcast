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
    <div class="pages">
      <router-link to="/home" class="nav-link">Home</router-link>
      <router-link to="/tracker" class="nav-link">Tracker</router-link>
      <router-link to="/advice" class="nav-link">Advice</router-link>
    </div>
    <router-link to="/" class="header">Flowcast</router-link>
    <div class="acct">
      <router-link to="/login" class="account" v-if="!isLoggedIn">Log In</router-link>
      <router-link to="/signup" class="account" v-if="!isLoggedIn">Sign Up</router-link>
      <button class="account" @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
    </div>
  </nav>
  <router-view />
</template>

