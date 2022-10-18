<template>
  <div class="hello container-flex flex-sm">
    
    <div class="mb-5">
      <div class="row justify-content-between">
        <div class="p-5 col-sm-3">
          <!-- Choose Clubs -->
          <div class="btn-group mb-1 mr-1">
            <button type="button" class="btn btn-success dropdown-toggle capitalize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {{currentClub ? `Club: ${currentClub}` : "Choose club"}}
            </button>
            <div class="dropdown-menu">
              <a @click="setClub(club)" v-for="club in clubs" class="dropdown-item capitalize">{{club}}</a>
            </div>
          </div><br />

          <!-- Choose Player -->

          <div class="btn-group dropright mb-1">
            <button type="button" class="btn btn-success dropdown-toggle capitalize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {{currentPlayer ? `Player: ${currentPlayer}` : "Choose player"}}
            </button>
            <div id="nameDropdown" class="dropdown-menu">
              <input tabindex='1' type="text" class="dropdown-item text-center" placeholder="Search.." id="nameSearch" @keyup="filterFunc()">
              <a @click="currentPlayer=false;getPage(1)" class="dropdown-item capitalize">All</a>
              <a @click="setPlayer(player)" v-for="player in players" class="dropdown-item capitalize">{{player}}</a>
            </div>
          </div><br />
          <div class="btn-group dropright mb-1">
            <button type="button" class="btn btn-success dropdown-toggle capitalize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {{eventType ? `Event Type: ${eventType}` : "Event Type"}}
            </button>
            <div id="nameDropdown" class="dropdown-menu">
              <a @click="eventType=false;getPage(1)" class="dropdown-item">All</a>
              <a @click="setEvent(type)" v-for="type in eventTypes" class="dropdown-item capitalize">{{type}}</a>
            </div>
          </div><br />
        </div>

        <div id="details" v-if="currentPlayer" class="p-2 col-sm-6">
          <h3 class="capitalize">Stats for {{currentPlayer}}:</h3>
          Number of games: {{numResults}}<br />
          Wins: {{numWins}}<br />
          Points scored: {{pointsFor}}<br />
          Average game score: {{parseInt(pointsFor/numResults)}}<br />
          Current streak: {{currentStreaks}}<br />
          Longest win streak: {{longestStreaks}} {{(streakDate ? "- " + streakDate : "")}}<br />
          Longest losing streak: {{-1*longestBadStreaks}} {{(badStreakDate ? "- " + badStreakDate : "")}}<br />
          <router-link :to="{ name: 'About', params: { player: currentPlayer, club: currentClub } }">
            <button class="m-2 btn btn-primary">Head-to-head stats</button>
          </router-link>
        </div>
        <div id="details" v-else class="col-sm-6">

          <h3  class="capitalize">Stats for {{currentClub}}:</h3>
          <div class="row justify-content-left">
            <p class="mt-2 col-md-6">
              Number of games: {{numResults}}<br />
              Points scored: {{pointsFor}}<br />
              Average game score: {{parseInt(pointsFor/numResults)}}<br />
            </p>
            <router-link :to="{ name: 'Team', params: { club: currentClub } }">
              <button id="teamBtn" class="col-md-6 m-2 btn btn-primary">Set up a team game</button>
            </router-link>
          </div>
          

        </div>
        
      </div>
    </div>
    <div><h3 class="text-center">Individual Games:</h3></div>
    <nav aria-label="Page navigation" class="text-center">
      
      <ul class="pagination">
        <li class="page-item">
          <button @click="getPage(1)" class="page-link"><<</button>
        </li>
        <li v-for="page in [currentPage-1,currentPage,currentPage+1]" class="page-item">
          <button @click="getPage(Math.min(Math.max(page,1),numPages))" class="page-link">
            {{page==currentPage ? "Page "+page+" of "+numPages : page==currentPage-1 ? '<' : '>'}}
          </button>
        </li>
        <li class="page-item">
          <button @click="getPage(numPages)" class="page-link">>></button>
        </li>
      </ul>
    </nav>
    <table class="table-striped table-bordered table-hover table capitalize">
      <thead class="table-primary">
        <tr>
          <th v-if="currentOrder == 'Chronological'"
              @click="setOrder('Reverse Chronological')" class="btn-primary" scope="col">
            Date   ▲
          </th>
          <th v-else-if="currentOrder == 'Reverse Chronological'"
              @click="setOrder('Chronological')" class="btn-primary" scope="col">
            Date   ▼
          </th>
          <th v-else
              @click="setOrder('Reverse Chronological')" class="btn-primary" scope="col">
            Date
          </th>
          <th v-if="currentOrder == 'Player Name'"
              @click="setOrder('Player Name R')" class="btn-primary" scope="col">
            Player   ▲
          </th>
          <th v-else-if="currentOrder == 'Player Name R'"
              @click="setOrder('Player Name')" class="btn-primary" scope="col">
            Player   ▼
          </th>
          <th v-else
              @click="setOrder('Player Name')" class="btn-primary" scope="col">
            Player
          </th>
          <th v-if="currentOrder == 'High Winner'"
              @click="setOrder('Low Winner')" class="btn-primary" scope="col">
            Score   ▼
          </th>
          <th v-else-if="currentOrder == 'Low Winner'"
              @click="setOrder('High Winner')" class="btn-primary" scope="col">
            Score   ▲
          </th>
          <th v-else
              @click="setOrder('High Winner')" class="btn-primary" scope="col">
            Score
          </th>
          <th v-if="currentOrder == 'Opp Name'"
              @click="setOrder('Opp Name R')" class="btn-primary" scope="col">
            Player 2   ▲
          </th>
          <th v-else-if="currentOrder == 'Opp Name R'"
              @click="setOrder('Opp Name')" class="btn-primary" scope="col">
            Player 2  ▼
          </th>
          <th v-else
              @click="setOrder('Opp Name')" class="btn-primary" scope="col">
            Player 2
          </th>
          <th v-if="currentOrder == 'High Loser'"
              @click="setOrder('Low Loser')" class="btn-primary" scope="col">
            Score   ▼
          </th>
          <th v-else-if="currentOrder == 'Low Loser'"
              @click="setOrder('High Loser')" class="btn-primary" scope="col">
            Score   ▲
          </th>
          <th v-else
              @click="setOrder('High Loser')" class="btn-primary" scope="col">
            Score
          </th>
          <th v-if="currentOrder == 'High Spread'"
              @click="setOrder('Low Spread')" class="btn-primary" scope="col">
            Spread   ▼
          </th>
          <th v-else-if="currentOrder == 'Low Spread'"
              @click="setOrder('High Spread')" class="btn-primary" scope="col">
            Spread   ▲
          </th>
          <th v-else
              @click="setOrder('High Spread')" class="btn-primary" scope="col">
            Spread
          </th>
          <th class="btn-primary disabled" scope="col">Round</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games">
          <td scope="row">
            {{game.date.substr(0,10)}}
            <button id="quacklebtn" class="btn btn-primary" v-if="isQuackle(game.player,game.opp,game.date,game.round)" @click="findQuackle(game.player,game.opp,game.date,game.round)">Quackle</button>
          </td>
          <td class="playerLink" @click="setPlayer(game.player)">{{game.player}}</td>
          <td>{{game.score}}</td>
          <td class="playerLink" @click="setPlayer(game.opp)">{{game.opp}}</td>
          <td>{{game.oppscore}}</td>
          <td>{{game.score-game.oppscore}}</td>
          <td>{{game.round}}</td>

        </tr>
      </tbody>
    </table>
    <!--<div class="card-deck flex-wrap container">
    <div class="card gamedata capitalize" v-for="game in games">
      Date: {{game.date.substr(0,10)}}
      <br />Winner: {{game.player}}
      <br />Score: {{game.score}}
      <br />Loser: {{game.opp}}
      <br />Score: {{game.oppscore}}
    </div>
  </div>-->
  </div>
</template>

<script>
  import gamedata from '../assets/json/by_club.json';
  import { filterFunction, orders } from '@/lib/orders.js';
  import { saveAs } from 'file-saver';
  import quackle from '../assets/json/quackle.json';
  export default {
    name: 'ScrabbleStats',
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
        clubs: ['calgary scrabble club',
          'golden triangle scrabble club',
          'brantford scrabble club',
          'brantford online', 'cambridge online'],
        eventTypes: ['Blitz', 'Regular', 'Sunday', 'Tournament'],
        eventType: false,
        currentClub: 'calgary scrabble club',
        totalScore: 0,
        currentOrder: false,
        orders: ['Reverse Chronological', 'Chronological', 'High Score', 'High Spread'],
        numWins: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        currentStreaks: 0,
        longestBadStreaks: 0,
        longestStreaks: 0,
        streakDate: false,
        badStreakDate: false,
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
      filterFunc() {
        filterFunction();
      },
      getPage(page) {
        const p = page - 1;
        this.currentPage = page;
        this.games = (this.currentClub ? gamedata[this.currentClub] : gamedata['calgary scrabble club'])
          .filter((game) => (game.score > this.minScore || game.oppscore > this.minScore) &&
            (game.score < this.maxScore || game.oppscore < this.maxScore));
        if (this.currentPlayer) {
          this.games = this.games.filter((game) => game.player == this.currentPlayer || game.opp == this.currentPlayer);
        } else {
          this.getPlayers();
        }
        if (this.eventType) {
          if (this.eventType == 'Blitz') {
            this.games = this.games.filter((game) => game.format == 'tuesday');
          } else if (this.eventType == 'Tournament') {
            this.games = this.games.filter((game) => game.format == 'tournament');
          } else if (this.eventType == 'Sunday') {
            this.games = this.games.filter((game) => game.format == 'sunday');
          } else {
            this.games = this.games.filter((game) => game.format != 'tournament' && game.format != 'tuesday')
          }
        }
        this.numWins = this.games.filter((game) => game.player == this.currentPlayer).length
        this.pointsFor = this.games.filter((game) => game.player == this.currentPlayer)
          .reduce((total, game) => total += game.score, 0) +
          this.games.filter((game) => game.player != this.currentPlayer)
            .reduce((total, game) => total += game.oppscore, 0)
        this.numResults = this.games.length;
        this.findStreaks();
        this.numPages = Math.ceil(this.numResults / 20);
        this.currentOrder ? this.games.sort((a, b) => orders(a, b, this.currentOrder)) : this.games.sort((a, b) => orders(a, b, 'Reverse Chronological'));
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
        this.players = [...this.players]
        this.players.sort();
      },
      setPlayer(player) {
        this.currentPlayer = player;
        
        this.getPage(1);
      
      },
      setClub(club) {
        this.currentClub = club;
        this.currentPlayer = false;
        this.eventType = false;
        this.getPlayers();
        this.getPage(1);
      },
      setOrder(order) {
        this.currentOrder = order;
        this.getPage(1);
      },
      findQuackle(player1, player2, date, round) {
        player1 = player1.split(' ').join('')
        player2 = player2.split(' ').join('')
        if (quackle[date][`${player1}_vs_${player2}${round}.gcg`] || quackle[date][`${player2}_vs_${player1}${round}.gcg`]) {
          if (!quackle[date][`${player2}_vs_${player1}${round}.gcg`]) {
            [player1, player2] = [player2, player1];
          }
          let str = quackle[date][`${player1}_vs_${player2}${round}.gcg`]
          let blob = new Blob([str])
          saveAs(blob, `${player1}-${player2}.gcg`);
        }
        else {
          if (!quackle[date][`${player2}_vs_${player1}.gcg`]) {
            [player1, player2] = [player2, player1];
          }
          let str = quackle[date][`${player1}_vs_${player2}.gcg`]
          let blob = new Blob([str])
          saveAs(blob, `${player1}-${player2}.gcg`);
        }
      },
      isQuackle(player1, player2, date, round) {
        player1 = player1.split(' ').join('')
        player2 = player2.split(' ').join('')

        if (quackle[date]) {
          if (quackle[date][`${player1}_vs_${player2}.gcg`] ||
            quackle[date][`${player2}_vs_${player1}.gcg`] ||
            quackle[date][`${player1}_vs_${player2}${round}.gcg`] ||
            quackle[date][`${player2}_vs_${player1}${round}.gcg`]) {
            return true
          }
        }
        return false;
      },
      setEvent(type) {
        this.eventType = type;
        this.getPage(1)
        
      },
      findStreaks() {
        if (this.currentPlayer) {
          this.games.sort((game1, game2) =>
            game2.date == game1.date ?
              game2.round < game1.round ?
                1 : -1 : game2.date < game1.date ?
                1 : -1);
          this.longestStreaks = 0;
          this.longestBadStreaks = 0;
          this.currentStreaks = 0;
          for (let game of this.games) {
            if (game.player == this.currentPlayer && game.score > game.oppscore) {
              if (this.currentStreaks > 0) {
                this.currentStreaks += 1
              } else {
                
                this.currentStreaks = 1;
              }
              if (this.currentStreaks > this.longestStreaks) {
                this.longestStreaks = this.currentStreaks;
                this.streakDate = game.date
              }
            } else if (game.opp == this.currentPlayer && game.score > game.oppscore) {
              if (this.currentStreaks < 0) {
                this.currentStreaks -= 1
              } else {
                
                this.currentStreaks = -1
              }
              if (this.currentStreaks < this.longestBadStreaks) {
                this.longestBadStreaks = this.currentStreaks;
                this.badStreakDate = game.date
              }
            } else {
              this.currentStreaks = 0;
            }
          }
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  th, td {
      font-size: large;
  }
  th {
    position: sticky;
    top: -5px;
  }
  .page-item {
      display:block;
      text-align: center;
  }
  .page-link {
      width: auto;
  }
  .card-group {
      width: 100%
  }
  .gamedata {
      margin-bottom:2rem;
      display:inline-block;
      min-width:10rem;
  }
  nav {
      width: 18rem;
      margin: auto;
  }
  .capitalize {
      text-transform: capitalize;
  }
  #details {
      font-size: medium;
      padding:1rem 1px 1px 1px;
  }
  .dropdown-toggle {
      font-size:medium;
  }
  #quacklebtn {
      position: relative;
      left: 3em;
  }
  .playerLink:hover {
      color: blue;
      cursor:pointer;
  }
  
</style>
