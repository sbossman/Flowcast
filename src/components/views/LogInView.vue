<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useRouter } from 'vue-router'
const email = ref("email");
const password = ref("password");
const errMsg = ref()
const router = useRouter()
const register = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log("Successfully registered!");
        router.push("/home");
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code){
          case "auth/invalid-email":
            errMsg.value = "Invalid email";
            break;
          case "auth/user-not-found":
            errMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            errMsg.value = "Incorrect password";
            break;
          default:
            errMsg.value = "Email or password was incorrect";
            break;
        }
        // alert(error.message);
      })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
      .then((result) => {
        console.log(result.user);
        router.push("/home");
      })
      .catch((error) => {
        // handle error
      })
}

const routeToSignUp = () => {
  router.push("/signup");
}

</script>
<template>
  <div class="login-container">
    <h1 class="flowcast-title">Flowcast</h1>
    <div class = "account-input">
      <h2>Log In to your Account</h2>
      <div class="login-input-block">
        <p>Email</p>
        <input class="login" type="text" v-model="email" />
      </div>
      <div class="login-input-block">
        <p>Password</p>
        <input class="login" type="password" v-model="password" />
      </div>
      <p v-if="errMsg">{{ errMsg }}</p>
      <div class ="submit">
        <p><button @click="register">Log In</button></p>
        <p><button @click="signInWithGoogle">Use Google</button></p>
      </div>
    </div>
    <p class="diff-sign-in">Don't have an account? <a @click="routeToSignUp">Sign Up</a></p>
  </div>
</template>
