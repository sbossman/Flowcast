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
    <h1>Flowcast</h1>
    <div class="home-options">
      <p><button @click="routeToLogin">Log In</button></p>
      <p><button @click="routeToSignup">Sign Up</button></p>
    </div>

  </div>
</template>