import { createRouter, createWebHistory } from "vue-router";
import GameView from "../views/GameView.vue";
import MainMenuView from "../views/MainMenuView.vue";
const Cookies = require("js-cookie");

const routes = [
  {
    path: "/",
    name: "main-menu",
    component: MainMenuView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (!Cookies.get("jwttoken") && to.name != "main-menu") {
    return { name: "main-menu" };
  }
});

export default router;
