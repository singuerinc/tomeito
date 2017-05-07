<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Nunito', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  top: 4px;
  position: absolute;
  height: 30px;
  left: 0;
  width: 100%;
}

html, body {
  height: 30px;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>
