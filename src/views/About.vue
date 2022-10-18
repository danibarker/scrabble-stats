<template>
  <div>
    <button class="m-4 btn btn-primary" v-on:click="navigate()">Back to main page</button>
    <div class="card-deck flex-wrap container">
      <h1>Head-to-head stats for {{player}} at {{club}}</h1>
      <table class="mt-4 table-striped table-bordered table-hover table capitalize">
        <thead class="table-primary">
          <tr>
            <th class="table-primary" style="width:20%" scope="col">Opponent</th>
            <th class="table-primary" style="width:8%" scope="col">Total Games</th>
            <th class="table-primary" style="width:8%" scope="col">Wins</th>
            <th class="table-primary" style="width:8%" scope="col">Losses</th>
            <th class="table-primary" style="width:8%" scope="col">Ties</th>
            <th class="table-primary" style="width:8%" scope="col">Spread</th>
            <th class="table-primary" style="width:8%" scope="col">Average Spread</th>
            <th class="table-primary" style="width:8%" scope="col">Current Streak</th>
            <th class="table-primary" style="width:8%" scope="col">Longest Win Streak</th>
            <th class="table-primary" style="width:8%" scope="col">Longest Losing Streak</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="opponent in opponents">
            <td class="capitalize" scope="row">{{opponent}}</td>
            <td>{{h2h[opponent].numGames}}</td>
            <td>{{h2h[opponent].wins}}</td>
            <td>{{h2h[opponent].losses}}</td>
            <td>{{h2h[opponent].ties}}</td>
            <td>{{h2h[opponent].spread}}</td>
            <td>{{parseInt(h2h[opponent].spread/h2h[opponent].numGames)}}</td>
            <td>{{currentStreaks[opponent]}}</td>
            <td>{{longestStreaks[opponent]}}</td>
            <td>{{longestBadStreaks[opponent]}}</td>
          </tr>
        </tbody>
      </table>
      
    </div>
  </div>


</template>

<script>
  import router from '../router'
  import gamedata from '../assets/json/by_club.json';
  export default {
    name: 'Detailed-Stats',
    mounted() {
      this.load();
    },
    data() {
      return {
        player: '',
        opponents: [],
        games: [],
        oppGames: {},
        currentStreaks: {},
        longestStreaks: {},
        longestBadStreaks: {},
      }
    },
    created() {
      this.player = this.$route.params.player;
      this.club = this.$route.params.club
    },
    methods: {
      navigate() {
        router.go(-1);
      },
      load() {
        this.games = gamedata[this.club].filter((game) => game.opp == this.player || game.player == this.player)
        this.opponents = [...new Set(this.games.map((game) => game.opp==this.player ? game.player : game.opp))];
        this.h2h = {};
        for (let opponent of this.opponents) {
          
          this.oppGames[opponent] = this.games.filter((game) => game.opp == opponent || game.player == opponent);
          let wonGames = this.oppGames[opponent].filter((game) => game.player == this.player && game.oppscore != game.score)
          let lostGames = this.oppGames[opponent].filter((game) => game.opp == this.player && game.oppscore!=game.score)
          let tieGames = this.oppGames[opponent].filter((game) => game.oppscore == game.score)
          let numGames = this.oppGames[opponent].length
          let wins = wonGames.length
          let losses = lostGames.length
          let ties = tieGames.length
          let spread = wonGames.reduce((spread, currentGame) => spread += currentGame.score - currentGame.oppscore,0) +
            lostGames.reduce((spread, currentGame) => spread += currentGame.oppscore - currentGame.score,0)
          this.h2h[opponent] = {
            "numGames": numGames,
            "wins": wins,
            "losses": losses,
            "ties": ties,
            "spread": spread
          };
          this.findStreaks(opponent);
          
        }
      },
      findStreaks(opponent) {
        this.oppGames[opponent].sort((game1, game2) =>
          game2.date == game1.date ?
            game2.round < game1.round ?
              1 : -1 : game2.date < game1.date ?
              1 : -1);
        this.longestStreaks[opponent] = 0;
        this.longestBadStreaks[opponent] = 0;
        this.currentStreaks[opponent] = 0;
        for (let game of this.oppGames[opponent]) {
          if (game.player == this.player && game.score > game.oppscore) {
            if (this.currentStreaks[opponent] > 0) {
              this.currentStreaks[opponent] += 1
            } else {
              this.currentStreaks[opponent] = 1;
            }
            if (this.currentStreaks[opponent] > this.longestStreaks[opponent]) {
              this.longestStreaks[opponent] = this.currentStreaks[opponent];
            }
          } else if (game.opp == this.player && game.score > game.oppscore) {
            if (this.currentStreaks[opponent] < 0) {
              this.currentStreaks[opponent] -= 1
            } else {
              this.currentStreaks[opponent] = -1
            }
            if (this.currentStreaks[opponent] < this.longestBadStreaks[opponent]) {
              this.longestBadStreaks[opponent] = this.currentStreaks[opponent];
            }
          } else {
            this.currentStreaks[opponent] = 0;
          }
        }
        
      },
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
    text-transform: capitalize;
  }
  td {
      text-align: right;
  }
  th {
    position: sticky;
    top: -5px;
  }
  th, td {
      font-size: large;
  }
  .card-group {
    width: 100%
  }
  .gamedata {
    margin-bottom: 2rem;
    display: inline-block;
    min-width: 10rem;
    text-transform:capitalize;
  }
  .gamedata h3 {
    font-size: medium;
    text-align: center;
  }
  .capitalize {
    text-transform: capitalize;
  }
</style>
