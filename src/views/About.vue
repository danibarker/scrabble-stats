<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>// @ is an alias to /src
import Something from '@/components/Something.vue';

export default {
  name: 'About',
  components: {
    Something,
  },
};
</script>
