import { createRouter, createWebHistory } from "vue-router";
import MainMenuView from "../views/MainMenuView.vue";
import AttackView from "../views/AttackView.vue";
import StoryView from "../views/StoryView.vue";
const Cookies = require("js-cookie");

const routes = [
  {
    path: "/",
    name: "main-menu",
    component: MainMenuView,
  },
  {
    path: "/attack",
    name: "attack",
    component: AttackView,
  },
  {
    path: "/story",
    name: "story",
    component: StoryView,
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
