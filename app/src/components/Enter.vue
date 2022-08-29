<template>
  <div></div>
</template>

<script>
const axios = require("axios");

export default {
  methods: {
    async loginUser() {
      let res = await axios.post("/api/login", {
        username: "12345",
        password: "',.',.',.",
      });
      Cookies.set("jwttoken", res.data, { expires: 7 });
    },
  },
};
</script>
