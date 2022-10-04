<template lang="pug">

div
  p(class='absolute top-40 right-5 z-20') {{counter}}
  button(
    @click='buttonAction'
    class='absolute top-48 right-5 z-20 bg-slate-400 opacity-50 w-7 h-7 \
    rounded'
  )
  form(@submit.prevent='takeInput' v-if='false')
    input(
      v-model='input'
      class='absolute top-64 right-5 z-20 w-8 opacity-50 text-center'
    )

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import { useAttackStore as as } from "@/stores/AttackStore";

export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    takeInput() {
      cs().gameData.story.step = this.input;
      this.input = "";
    },
    buttonAction() {
      as().drawObjects.forEach((d) => {
        if (d.type == "enemy") {
          console.log(
            d.dangerPosition,
            d.remainingFrames,
            d.defender,
            d.clockDirection,
            d.readyToDefend,
            d.lifeTime,
            d.deathTime
          );
        }
      });
      // as().drawObjects.forEach((object) => {
      //   console.log(object.name, object.pointY);
      // });
      // cs().gameData.story.step = 0;
      // cs().gameData.story.scene = "loading";
      // this.$router.push("/");
      console.log("Button activated");
    },
  },
  computed: {
    counter() {
      return cs().gameFrame;
    },
  },
};
</script>
