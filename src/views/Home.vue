<template>
  <div class="home container" style="width:100%">
    <img style="width:10%"alt="Vue logo" src="@/assets/images/A.png"><h1 class="mb-5">Scrabble Club Stats</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';


export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
