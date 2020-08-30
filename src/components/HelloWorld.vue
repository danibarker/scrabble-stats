<template>
  <div class="hello">
    <div class="mb-5">
      <!-- Example single danger button -->
      <div class="btn-group">
        <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{currentPlayer ? currentPlayer : "Choose player"}}
        </button>
        <div class="dropdown-menu">
          <a @click="setPlayer(player)" v-for="player in players" class="dropdown-item" href="#">{{player}}</a>
        </div>
      </div><br />
      <label for="minScore">Minimum winning score</label>
      <br />
      <input id="minScore" @change="setMinScore(minScore)" v-model="minScore" type="text" value="300"><br />
      <label for="maxScore">Maximum losing score</label><br />
      <input id="maxScore" @change="setMaxScore(maxScore)" v-model="maxScore" type="text" value="300">
    </div>
    <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item">
            <button @click="getPage(1)" class="page-link">1</button>
          </li>
          <li v-for="page in [currentPage-1,currentPage,currentPage+1]" class="page-item">
            <button @click="getPage(Math.min(Math.max(page,1),numPages))" class="page-link">
              {{page==currentPage ? page : page==currentPage-1 ? 'Prev' : 'Next'}}
            </button>
          </li>
          <li class="page-item">
            <button @click="getPage(numPages)" class="page-link">Last ({{numPages}})</button>
          </li>
        </ul>
    </nav>
    <div class="container">
      <div class="row gamedata" v-for="game in games">Date: {{game.date.substr(0,10)}}
        <br />Player: {{game.score>game.oppscore ? game.player : game.opp}}
        <br />Score: {{game.score>game.oppscore ? game.score : game.oppscore}}
        <br />Opponent: {{game.score>game.oppscore ? game.opp : game.player}}
        <br />Opp Score: {{game.score>game.oppscore ? game.oppscore : game.score}}
      </div>
    </div>
      
  </div>
  
</template>

<script>
import gamedata from '../assets/json/by_club.json';

export default {
  name: 'HelloWorld',
  data() {
    return {
      games: [],
      numResults: 0,
      numPages: 0,
      minScore: -100,
      maxScore: 1000,
      currentPage: 1,
      players: [],
      currentPlayer: false,
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.getPage(1);
      this.currentPage = 1;
    },
    getPage(page) {
      const p = page - 1;
      this.currentPage = page;
      this.games = gamedata['calgary scrabble club']
        .filter((game) => (game.score > this.minScore || game.oppscore > this.minScore) &&
          (game.score < this.maxScore || game.oppscore < this.maxScore));
      if (this.currentPlayer) {
        this.games = this.games.filter((game) => game.player == this.currentPlayer || game.opp == this.currentPlayer);
      } else {
        this.getPlayers();
      }
      this.numResults = this.games.length;
      this.numPages = Math.ceil(this.numResults / 20);
      this.games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
      
      this.games = this.games.slice(p * 20, p * 20 + 20);
    },
    setMinScore(score) {
      this.minScore = score;
      this.getPage(1);
    },
    setMaxScore(score) {
      this.maxScore = score;
      this.getPage(1);
    },
    getPlayers() {
      this.players = new Set(this.games.map((game) => game.player).concat(this.games.map((game) => game.opp)));
      console.log([...this.players])
      this.players = [...this.players]
      this.players.sort();
      console.log(this.players[0]);
    },
    setPlayer(player) {
      this.currentPlayer = player;
      this.getPage(1);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  .page-item {
      display:block;
  }
  .gamedata {
      text-align: left;
      max-width:18rem;
      margin-bottom:2rem;
  }
  nav {
      width: 18rem;
      margin: auto;
  }
</style>
