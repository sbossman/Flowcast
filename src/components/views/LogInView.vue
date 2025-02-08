<template>
  <div class="login-container">
    <h1>Log In to an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p v-if="errMsg">{{ errMsg }}</p>
    <p><button @click="register">Submit</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>
  </div>
</template>
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
        router.push("/feed");
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
</script>
