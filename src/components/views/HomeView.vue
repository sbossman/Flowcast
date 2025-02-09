<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const routeToLogin = () => {
  router.push("/login")
}
const routeToSignup = () => {
  router.push("/signup")
}
</script>
<template>
  <div class="home-container">
    <h1 class="flowcast-title">Flowcast</h1>
    <p class="subtitle">Sync Your Lifestyle to Your Cycle!</p>
    <div class="home-options">
      <p><button @click="routeToLogin">Log In</button></p>
      <p><button @click="routeToSignup">Sign Up</button></p>
    </div>

  </div>
</template>