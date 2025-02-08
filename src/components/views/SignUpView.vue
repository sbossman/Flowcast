<script setup>
import { ref } from "vue"
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { useRouter } from 'vue-router'
const email = ref("email");
const password = ref("password");
const router = useRouter()
const register = () => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log("Successfully registered!");
        router.push("/feed");
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
      .then((result) => {
        console.log(result.user);
        router.push("/feed");
      })
      .catch((error) => {
        // handle error
      })
}

const routeToLogin = () =>{
  router.push("/login");
}
</script>
<template>
  <div class="login-container">
    <h1>Flowcast</h1>
    <div class="account-input">
      <h2>Create an Account</h2>
      <div class="login-input-block">
        <p>Email</p>
        <input class="login" type="text"  v-model="email" />
      </div>
      <div class="login-input-block">
        <p>Password</p>
        <input class="login" type="password" v-model="password" />
      </div>
      <div class="submit">
        <p><button @click="register">Sign Up</button></p>
        <p><button @click="signInWithGoogle">Use Google</button></p>
      </div>
    </div>
    <p class="diff-sign-in">Already have an account? <a @click="routeToLogin">Log In</a></p>
  </div>
</template>
