<template lang="pug">

button(@click='toggleRegister()' v-if='!logged') Register
button(@click='toggleLogin()' v-if='!logged') Login
button(@click='logout()' v-if='logged') Logout

form(@submit.prevent='login()' v-if='showLogin')
  div
    label(htmlFor="loginUsername") Username
    input(
      id='loginUsername'
      name="username"
      type="text"
      v-model="loginInput.username"
      placeholder="username"
      autocomplete="off"
    )
  div
    label(htmlFor="LoginPassword") Password
    input(
      id='LoginPassword'
      name="username"
      type="password"
      v-model="loginInput.password"
      placeholder="password"
      autocomplete="off"
    )
  button(type='submit') Submit
  
form(@submit.prevent="register()" v-if='showRegister')
  div
    label(htmlFor="registerUsername") Username
    input(
      id='username'
      name="registerUsername"
      type="text"
      v-model="registerInput.username"
      placeholder="username"
      autocomplete="off"
    )
  div
    label(htmlFor="registerPassword") Password
    input(
      id='registerPassword'
      name="username"
      type="password"
      v-model="registerInput.password"
      placeholder="password"
      autocomplete="off"
    )
  div
    label(htmlFor="registerEmail") Email
    input(
      id='registerEmail'
      name="username"
      type="text"
      v-model="registerInput.email"
      placeholder="email"
      autocomplete="off"
    )
  button(type='submit') Submit

p(v-if="!logged") Welcome guest!
p(v-if='logged') Welcome, {{username}}
div(v-if='showMessage')
  p(v-for="(item, index) in message" :key="index") {{item}}
  button(@click='message=""') OK

</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { useCommonStore as cs } from "@/stores/CommonStore";
import { getGameData } from "@/js/common";
import { updateGameData } from "@/js/common";

export default {
  watch: {
    logged(newValue) {
      cs().logged = newValue;
    },
  },
  data() {
    return {
      username: "",
      logged: false,
      message: [],
      registerInput: {
        username: "",
        password: "",
        email: "",
      },
      loginInput: {
        username: "",
        password: "",
      },
      showRegister: false,
      showLogin: false,
    };
  },
  computed: {
    showMessage() {
      if (this.message != "") {
        return true;
      }
    },
  },
  methods: {
    toggleRegister() {
      this.showRegister = !this.showRegister;
      this.showLogin = false;
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
      this.showRegister = false;
    },
    async register() {
      let res = await axios.post("/api/register", {
        username: this.registerInput.username,
        password: this.registerInput.password,
        email: this.registerInput.email,
      });
      if (res.data == "OK") {
        this.message = [];
        this.message.push("Successfull!");
        this.toggleRegister();
        Object.keys(this.registerInput).forEach((key) => {
          this.registerInput[key] = "";
        });
        console.log("Registeration successful! Empty gameData is set.");
      } else {
        this.message = [];
        res.data.forEach((error) => {
          this.message.push(error);
        });
        console.log("Registeration failed.");
      }
    },
    async login() {
      let res = await axios.post("/api/login", {
        username: this.loginInput.username,
        password: this.loginInput.password,
      });
      if (res.data.jwttoken) {
        this.logged = true;
        this.username = this.loginInput.username;
        this.message = [];
        this.message.push("Successful!");
        this.toggleLogin();
        Object.keys(this.loginInput).forEach((key) => {
          this.loginInput[key] = "";
        });
        Cookies.set("username", this.username, { expires: 7 });
        Cookies.set("jwttoken", res.data.jwttoken, { expires: 7 });

        localStorage.setItem(
          "enemy-coordinates",
          JSON.stringify(generateEnemyCoordinates())
        );
        getGameData();
        console.log("Login successful! gameData is fetched.");
      } else {
        this.message = [];
        this.message.push(res.data);
        console.log("Login failed.");
      }
    },
    logout() {
      Cookies.remove("jwttoken");
      Cookies.remove("username");
      Cookies.remove("outside-brightness");
      localStorage.removeItem("loading-background");
      localStorage.removeItem("loading-ring-1");
      localStorage.removeItem("loading-ring-2");
      localStorage.removeItem("loading-ring-3");
      localStorage.removeItem("loading-ring-4");
      localStorage.removeItem("enemy-coordinates");
      this.logged = false;
      this.$router.push("/");
    },
  },
  mounted() {
    if (Cookies.get("jwttoken") && Cookies.get("username")) {
      this.username = Cookies.get("username");
      this.logged = true;
    }
  },
};
</script>
