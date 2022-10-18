<template>
  <div class="container">
    <button class="m-4 btn btn-primary" v-on:click="navigate()">Back to main page</button>
    <form action="upload.php" method="post" enctype="multipart/form-data">
      Select JSON to upload:
      <input type="file" name="fileToUpload" id="fileToUpload">
      <input type="submit" value="Upload File" name="submit">
    </form>
  </div>
</template>
<script>
  import router from '../router'
  
  export default {
    name: 'Upload',
    mounted() {},
    data() {},
    methods: {
      
      navigate() {
        router.go(-1);
      },     
    }
  }
</script>

<style scoped>
</style>
