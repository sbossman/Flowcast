import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("../components/views/HomeView.vue") },
        {
            path: "/login",
            component: () => import("../components/views/LogInView.vue") },
        {
            path: "/signup",
            component: () => import("../components/views/SignUpView.vue") },
        {
            path: "/feed",
            component: () => import("../components/views/FeedView.vue"),
            meta: {
                requiresAuth: true,
            },
        },
    ]
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
}


router.beforeEach(async (to, from, next) =>{
    if(to.matched.some((record) => record.meta.requiresAuth)){
        if(await getCurrentUser()) {
            next();
        }
        else{
            alert("You don't have access!")
            next("/");
        }
    } else{
        next();
    }
})

export default router;