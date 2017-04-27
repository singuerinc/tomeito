const INTERVAL = 1000
// const TOTAL = 1000 * 60 * 25
const TOTAL = 1000 * 5

export default class {
  constructor ({bus}) {
    console.log('new timer')
    this.bus = bus
    this.complete = false
    this.time = 0
    this.progress = 0
    this.initTime = null
    this.currentTime = null
    this.endTime = null
    this.isRunning = false
    this._interval = null
  }

  play () {
    if (this.complete) return
    if (!this.isRunning) {
      console.log('tomato start')
      this.isRunning = true
      this._interval = setInterval(this.tick.bind(this), INTERVAL)
    }

    if (!this.initTime) {
      this.reset()
    }
  }

  pause () {
    if (this.isRunning) {
      console.log('tomato pause')
      this.isRunning = false
      this._interval = clearInterval(this._interval)
    }
  }

  reset () {
    if (this.complete) return
    console.log('tomato reset')
    this.time = 0
    this.progress = 0
    this.initTime = new Date().getTime()
    this.currentTime = this.initTime
    this.endTime = this.initTime + TOTAL
  }

  tick () {
    this.time += INTERVAL
    this.currentTime = this.initTime + this.time
    this.progress = this.time / TOTAL
    if (this.time >= TOTAL) {
      this.pause()
      this.complete = true
      console.log('tomato completed!')
      this.bus.$emit('complete', this)
    }
  }
}
