<template>
  <div>
    <h1>Hello, World!</h1>
    <button @click="count++">count is: {{count}}</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 0,
      };
    },
  };
</script>

<style scoped>
  a {
    color: #42b983;
  }
  
  p {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
</style>
