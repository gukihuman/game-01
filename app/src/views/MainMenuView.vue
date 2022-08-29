<template lang="pug">
form(@submit.prevent="register()")
  div
    label Username
    input(
      name="username"
      type="text"
      v-model="username"
      placeholder="username"
      autocomplete="off")
  div
    label Password
    input(
      name="username"
      type="text"
      v-model="password"
      placeholder="password"
      autocomplete="off")
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
};
</script>
