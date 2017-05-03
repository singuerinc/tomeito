<template>
  <div>TOMEITO</div>
</template>

<script>
  import router from '../router'

  export default {
    name: 'intro',
    router,
    data () {
      return {
        isFade: false
      }
    },
    created () {
      setTimeout(() => {
        router.push('/tomatoes')
      }, 2000)
    }
  }
</script>
<style scoped>
  div {
    margin: 0;
    padding-left: 8px;
    line-height: 30px;
    color: #999;
    background: black;
    height: 100%;
    font-size: 16px;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 1000ms;
  }

  div small {
    color: #333;
  }
</style>
