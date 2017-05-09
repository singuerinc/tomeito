<template>
  <div><h1>{{appName}}</h1></div>
</template>

<script>
  import router from '../router'

  export default {
    name: 'intro',
    router,
    data () {
      return {
        appName: 'TOMEITO',
        isFade: false
      }
    },
    created () {
      let iterations = 0
      const interval = setInterval(() => {
        const alpha = '23456789'
        const arr = []

        let idx = 0
        const r = Math.floor(iterations * 0.1)

        do {
          if (idx < r) {
            arr.push('TOMEITO'[idx])
          } else {
            arr.push(alpha.charAt(Math.floor(Math.random() * alpha.length)))
          }
          idx++
        }
        while (idx < 7)
        this.appName = arr.join('')
        iterations++

        if (iterations === 80) {
          clearInterval(interval)
          setTimeout(() => {
            router.push('/tomatoes')
          }, 1000)
        }
      }, 15)
    }
  }
</script>
<style scoped>
  div {
    position: absolute;
    top: 0;
    display: block;
    width: 100%;
    height: 30px;
    background: #242424;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 1000ms;
  }

  div h1 {
    position: absolute;
    font-size: 16px;
    top: 5px;
    left: 8px;
    color: #999;
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  div small {
    color: #333;
  }
</style>
