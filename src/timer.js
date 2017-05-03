const INTERVAL = 1000
const TYPE_TOMATO = 1000 * 10
const TYPE_BREAK = 1000 * 5
// const TYPE_TOMATO = 1000 * 60 * 25
// const TYPE_BREAK = 1000 * 60 * 5

export default class Timer {
  constructor ({bus, type}) {
    this.type = type
    this.bus = bus
    this.completed = false
    this.time = this.type
    this.progress = 0
    this.initTime = null
    this.currentTime = null
    this.endTime = null
    this._isRunning = false
    this._interval = null
  }

  isRunning () {
    return this._isRunning
  }

  play () {
    if (this.completed) return
    if (!this._isRunning) {
      this._isRunning = true
      this._interval = setInterval(this.tick.bind(this), INTERVAL)
      this.bus.$emit('started', this)
    }

    if (!this.initTime) {
      this.reset()
    }
  }

  pause () {
    if (this._isRunning) {
      this._isRunning = false
      this._interval = clearInterval(this._interval)
      this.bus.$emit('paused', this)
    }
  }

  reset () {
    if (this.completed) return
    this.time = this.type
    this.progress = 0
    this.initTime = new Date().getTime()
    this.currentTime = this.initTime
    this.endTime = this.initTime + this._getTotal()
  }

  complete () {
    this.pause()
    this.completed = true
    this.bus.$emit('completed', this)
  }

  skip () {
    this.pause()
    this.completed = false
    this.bus.$emit('skipped', this)
  }

  tick () {
    this.time -= INTERVAL
    this.currentTime = this.initTime + this.time
    this.progress = (this._getTotal() - this.time) / this._getTotal()
    this.bus.$emit('tick', this)
    if (this.time <= 0) {
      this.complete()
    }
  }

  _getTotal () {
    return this.type
  }
}

Timer.TYPE_TOMATO = TYPE_TOMATO
Timer.TYPE_BREAK = TYPE_BREAK
