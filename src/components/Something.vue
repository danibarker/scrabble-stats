<template>
  <div class="hello">
    <h1>Something</h1>
  </div>
</template>

<script>

export default {
  name: 'Something',
  data() {
    return {
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .gamedata {
    text-transform: capitalize;
  }
</style>
