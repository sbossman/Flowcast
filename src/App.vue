<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
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
    <router-link to="/">Home</router-link>
    <router-link to="/feed">Feed</router-link>
    <router-link to="/login">Log In</router-link>
    <router-link to="/signup">Sign Up</router-link>
    <button @click="handleSignOut" >Sign Out</button>
  </nav>
  <router-view />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
