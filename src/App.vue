<template>
  <ContentComponent />

</template>

<script>
import ContentComponent from './components/layout/ContentComponent.vue'

export default {
  name: 'App',
  components: {
    ContentComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
