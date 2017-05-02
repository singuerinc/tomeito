const INTERVAL = 1000
const TYPE_TOMATO = 1000 * 60 * 25
const TYPE_BREAK = 1000 * 60 * 5

export default class Timer {
  constructor ({bus, type}) {
    this.type = type
    this.bus = bus
    this.complete = false
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
    if (this.complete) return
    if (!this._isRunning) {
      this._isRunning = true
      this._interval = setInterval(this.tick.bind(this), INTERVAL)
    }

    if (!this.initTime) {
      this.reset()
    }
  }

  pause () {
    if (this._isRunning) {
      this._isRunning = false
      this._interval = clearInterval(this._interval)
    }
  }

  reset () {
    if (this.complete) return
    this.time = this.type
    this.progress = 0
    this.initTime = new Date().getTime()
    this.currentTime = this.initTime
    this.endTime = this.initTime + this._getTotal()
  }

  tick () {
    this.time -= INTERVAL
    this.currentTime = this.initTime + this.time
    this.progress = (this._getTotal() - this.time) / this._getTotal()
    if (this.time <= 0) {
      this.pause()
      this.complete = true
      this.bus.$emit('complete', this)
    }
  }

  _getTotal () {
    return this.type
  }
}

Timer.TYPE_TOMATO = TYPE_TOMATO
Timer.TYPE_BREAK = TYPE_BREAK
