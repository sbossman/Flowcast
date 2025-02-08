import './assets/main.css'

import { createApp } from 'vue'
import router from "./router"
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import { firebaseApp, todosRef } from './firebase'

console.log(todosRef);

const app = createApp(App)
app.use(router)
app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp ,
    modules: [
        // we will see other modules later on
        VueFireAuth(),
    ],
})

app.mount('#app')
