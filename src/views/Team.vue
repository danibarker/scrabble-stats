<template>
  <div class="hello container-flex">
    
    <button class="btn btn-primary" v-on:click="navigate()">Back to main page</button>

    <div class="btn-group dropright ml-4">
      <button v-if="!teams.length>0" type="button" class="btn btn-success dropdown-toggle capitalize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Choose Players to Add
      </button>
      <button v-else type="button" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Reset to make new teams" disabled>
        Choose Players to Add
      </button>
      <div id="nameDropdown" class="dropdown-menu">
        <input tabindex='1' type="text" class="dropdown-item text-center" placeholder="Search.." id="nameSearch" @keyup="filterFunc()">
        <a @click="addPlayer(player)" v-for="player in players" class="dropdown-item capitalize">{{player}}</a>
      </div>
      <div>
        <button v-if="teams.length==0 && teamPlayers.length%4==0 && teamPlayers.length>0" @click="makeTeams()" class="ml-4 btn btn-primary">Make Teams</button>
        <button v-else class="ml-4 btn btn-primary" disabled data-toggle="tooltip" data-placement="top" title="You must add a multiple of 4 players to make teams">Make Teams</button>
      </div>
      <div>
        <button v-if="teamPlayers.length>0" @click="load()" class="ml-4 btn btn-danger">Reset</button>
        <button v-else class="ml-4 btn btn-danger" disabled>Reset</button>
      </div>
    </div>
    
    <ol class="mt-5">
      <li class="capitalize" v-for="player in teamPlayers">{{player}} </li>
    </ol>
    <ol>
      <li class="capitalize" v-for="team in teams">
        {{team[0]}}
      </li>
    </ol>
  </div>

 
</template>

<script>
  import router from '../router'
  import gamedata from '../assets/json/by_club.json';
  import { filterFunction, orders } from '@/lib/orders.js';
  export default {
    name: 'Team',
    mounted() {
      this.load();
    },
    data() {
      return {
        players: [],
        teamPlayers: [],
        teams: [],
        winsPerGame: {},
      }
    },
    created() {
      this.club = this.$route.params.club
    },
    methods: {
      filterFunc() {
        filterFunction();
      },
      navigate() {
        router.go(-1);
      },
      load() {
        this.players = [];
        this.teamPlayers = [];
        this.winsPerGame = {};
        this.teams = [];
        this.players = [...new Set(gamedata[this.club].reduce(function (p, currentGame) {
          p.push(currentGame.player)
          return p
        }, []))];
      },
      addPlayer(p) {
        this.teamPlayers.push(p);
        this.players = this.players.filter((player) => player != p);
      },
      calculateScores() {
        for (let player of this.teamPlayers) {
          this.winsPerGame[player] = 0;
          let allGames = gamedata[this.club].filter((game)=>game.date>'2016-10-25')
          let playerGames = allGames.filter((game) => game.player == player || game.opp == player);
          for (let player2 of this.teamPlayers) {
            if (player != player2) {
              let vsGames = playerGames.filter((game) => game.player == player2 || game.opp == player2)

              this.winsPerGame[player] += (vsGames.length > 0 ? (vsGames
                .reduce(function (score, currentGame) {
                  score += (player == currentGame.player ? 1 : 0);
                  return score;
                }, 0) / vsGames.length) : 0.5)
            }
          }
          console.log(player, this.winsPerGame[player])
          this.winsPerGame[player] /= this.teamPlayers.length - 1;
        }
        
      },
      makeTeams() {
        this.calculateScores();
        let wpgArr = []
        for (let [player, playerWPG] of Object.entries(this.winsPerGame)) {
          wpgArr.push([player, playerWPG]);
        }
        wpgArr.sort((player1, player2) => player1[1] - player2[1])
        let pairs = [];
        for (let n = 0; n < wpgArr.length/2; n++) {
          pairs.push([wpgArr[n], wpgArr[wpgArr.length - 1 - n]]);
        }
        pairs = pairs.map((pair) => [`${pair[0][0]}, ${pair[1][0]}`,(pair[0][1]+pair[1][1])/2])
        pairs.sort((pair1,pair2)=>pair1[1]-pair2[1])
        for (let n = 0; n < pairs.length / 2; n++) {
          this.teams.push([pairs[n], pairs[pairs.length - 1 - n]]);
        }
        this.teams = this.teams.map((team) => [`${team[0][0]}, ${team[1][0]}`, (team[0][1] + team[1][1]) / 2])
        console.log(wpgArr, this.teams, pairs);
      },
    }
  }
</script>

<style scoped>
  .capitalize {
    text-transform: capitalize;
  }
</style>
