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

    useEnemiesStore().generateEnemy();
    useVillageStore().updateClosestEnemyPoint();

    //main draw loop
    setInterval(() => {
      // return;

      this.gameFrame++;
      useCommonStore().gameFrame++;

      if (this.gameFrame % 3 === 0) {
        useEnemiesStore().move();
        useCharacterStore().move();
      }

      this.clearCanvas();
      if (this.gameFrame % 180 === 0 && this.gameFrame < 700) {
        useEnemiesStore().generateEnemy();
        useVillageStore().updateClosestEnemyPoint();
      }
    }, 1000 / 60);
  },
};
</script>
