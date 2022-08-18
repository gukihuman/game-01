<template lang="pug">

Canvas(ref='canvas-wrapper')
  Village(
    :update = "gameFrame"
    )
  Character(
    :update = "gameFrame"
  )
  Enemy(
    :update = 'gameFrame'
    v-for ='(enemy, index) in enemies'
    :key = 'index'
    :pointX ='enemy.pointX'
    :pointY ='enemy.pointY'
    :status='enemy.status'
  )


</template>

<script>
import Village from "@/components/Village.vue";
import Canvas from "@/components/Canvas.vue";
import Enemy from "@/components/Enemy.vue";
import Character from "@/components/Character.vue";
import { useCommonStore } from "@/stores/CommonStore";
import { useVillageStore } from "@/stores/VillageStore";
import { useEnemiesStore } from "@/stores/EnemiesStore";
import { useCharacterStore } from "@/stores/CharacterStore";

export default {
  components: {
    Village,
    Canvas,
    Enemy,
    Character,
  },
  data() {
    return {
      gameFrame: 0,
      gameSpeed: 1,
      center: {
        pointX: null,
        pointY: null,
      },
    };
  },
  computed: {
    enemies() {
      return useEnemiesStore().enemies;
    },
  },
  methods: {
    clearCanvas() {
      if (!this.$refs["canvas-wrapper"]) return;
      this.$refs["canvas-wrapper"].provider.context.clearRect(
        0,
        0,
        this.$el.clientWidth,
        this.$el.clientHeight
      );
    },
  },
  mounted() {
    this.center.pointX = this.$el.clientWidth / 2;
    this.center.pointY = this.$el.clientHeight / 2;

    useCommonStore().centerPoint.x = useCommonStore().canvas.width / 2;
    useCommonStore().centerPoint.y = useCommonStore().canvas.height / 2;

    //main draw loop
    setInterval(() => {
      this.gameFrame++;
      useCommonStore().gameFrame++;

      useEnemiesStore().move();

      if (
        useCharacterStore().status === "idle" ||
        useCharacterStore().status === "move"
      ) {
        useCharacterStore().move();
      }

      this.clearCanvas();
      if (
        (this.gameFrame % 500 === 0 && this.gameFrame < 1100) ||
        this.gameFrame === 120
      ) {
        useEnemiesStore().generateEnemy();
        useVillageStore().updateClosestEnemyPoint();
      }
    }, 1000 / (60 * this.gameSpeed));
  },
};
</script>
