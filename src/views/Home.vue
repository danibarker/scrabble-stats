<template>
  <div class="home container">
    <div style="text-align:center" class="row">
      <div style="text-align:center" class="col-12">
      </div>

    </div>
    <div style="width:100%; text-align:center" class="row mb-2">
      <div style="text-align:center" class="col-12">
        <h1 style="margin:1rem;font-size:4em; display: inline-block" class="mb-5 row">Scrabble Club Stats</h1>
      </div>
    </div>
    <ScrabbleStats />
  </div>
</template>

<script>
// @ is an alias to /src
import ScrabbleStats from '@/components/ScrabbleStats.vue';


export default {
  name: 'Home',
  components: {
    ScrabbleStats
    }
};
</script>
