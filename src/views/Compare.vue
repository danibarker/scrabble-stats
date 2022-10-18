<template>
  <div class="hello container-flex">
    <div>
      <a @click="removePlayer(player)" v-for="player in comparePlayers">{{player}}<br /></a>
    </div>
   </div>
</template>

<script>
  import router from '../router'
  import gamedata from '../assets/json/by_player.json';
  import { filterFunction, orders } from '@/lib/orders.js';
  export default {
    name: 'Compare',
    mounted() {
      this.load();
    },
    data() {
      return {
        players: [],
        comparePlayers: [],
      }
    },
    created() {
    },
    methods: {
      filterFunc() {
        filterFunction();
      },
      navigate() {
        router.go(-1);
      },
      load() {
        this.comparePlayers=Object.keys(gamedata)
      },
      addPlayer(p) {
        this.comparePlayers.push(p);
        this.players = this.players.filter((player) => player != p);
      },
      removePlayer(p) {
        this.comparePlayers = this.comparePlayers.filter((player) => player != p);
        this.players.push(p);
      },
    }
  }
</script>

<style scoped>
  .capitalize {
    text-transform: capitalize;
  }
</style>
