<template lang="pug">

div
  Enter

div(v-if='logged')
  button(@click='toggleOptions()') Options

  Options(v-if='showOptions' :toggleOptions='toggleOptions')

</template>

<script>
import Enter from "@/components/Enter.vue";
import Options from "@/components/Options.vue";
import { useCommonStore } from "@/stores/CommonStore";

export default {
  components: {
    Enter,
    Options,
  },
  data() {
    return {
      showOptions: false,
    };
  },
  computed: {
    logged() {
      return useCommonStore().logged;
    },
  },
  methods: {
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
  },
};
</script>
