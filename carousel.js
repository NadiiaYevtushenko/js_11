function Carousel() {

}

Carousel.prototype = {

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = '<div id="pause-btn" class="control pause control-pause">Pause</div>'
    const NEXT = '<div id="next-btn" class="control next control-next"><i class="fa-solid fa-arrow-right"></i></div>'
    const PREV = '<div id="prev-btn" class="control prev control-prev"><i class="fa-solid fa-arrow-left"></i></div>'
    
    controls.setAttribute('id', 'controls-container');
    controls.classList.add('controls');

    controls.innerHTML = PAUSE + NEXT + PREV
    this.container.append(controls)

    const indicators = document.createElement('div');
    const ZERO = '<div class="indicator active" data-slide-to="0"></div>'
    const ONE = '<div class="indicator" data-slide-to="1"></div>'
    const TWO = '<div class="indicator" data-slide-to="2"></div>'
    const THREE = '<div class="indicator" data-slide-to="3"></div>'
    const FOUR = '<div class="indicator" data-slide-to="4"></div>'
    const FIVE = '<div class="indicator" data-slide-to="5"></div>'
    const SIX = '<div class="indicator" data-slide-to="6"></div>'

    indicators.setAttribute('id', 'indicators-container');
    indicators.classList.add('indicators');

    indicators.innerHTML = ZERO + ONE + TWO + THREE + FOUR + FIVE + SIX
    this.container.append(indicators)
  
    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicatorItems = this.container.querySelectorAll('.indicator');
  },

  _initProps() {
    this.body = document.body;
    this.container = document.querySelector('#carousel');
    this.slides = this.container.querySelectorAll('.slide');
    this.SLIDES_COUNT = this.slides.length
    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_SPACE = 'Space'
    
    this.currentSlide = 0;
    this.timerId = null;
    this.isPlaying = true;
    this.interval = 2000;
  },

  _goToNth: function (n) {
    this.slides[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT
    this.slides[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
  },

  _setBgToBody: function () {
    this.body.style.backgroundImage = this.slides[this.currentSlide].style.backgroundImage
  },

  _goToNext: function () {
    this._goToNth(this.currentSlide + 1)
    this._setBgToBody()
  },
  
  _goToPrev: function () {
    this._goToNth(this.currentSlide - 1)
    this._setBgToBody()
  },
  
  _tick: function () {
    this.timerId = setInterval(this._goToNext.bind(this), this.interval);
  },
  //*pause
  pause: function () {
    if (!this.isPlaying) return
    clearInterval(this.timerId)
    this.pauseBtn.innerHTML = 'Play'
    this.isPlaying = false
  },
  //*play
  play: function () {
    this._tick()
    this.pauseBtn.innerHTML = 'Pause'
    this.isPlaying = true
  },

  pausePlay: function () {
    this.isPlaying ? this.pause() : this.play()
  },

  next: function () {
    this.pause()
    this._goToNext()
    this._setBgToBody()
  },

  prev: function () {
    this.pause()
    this._goToPrev()
    this._setBgToBody()
  },
 
  _indicateHandler: function (e) {
    const { target } = e
    if (target && target.classList.contains('indicator')) {
      this.pause()
      this._goToNth(+target.dataset.slideTo)
      this._setBgToBody()
    }
  },
  
  _pressKeyHandler: function (e) {
    const { code } = e
    e.preventDefault()
    if (code === this.CODE_ARROW_LEFT) this.prev()
    if (code === this.CODE_ARROW_RIGHT) this.next()
    if (code === this.CODE_SPACE) this.pausePlay()
  },
  
  _initListeners: function () {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this))
    this.nextBtn.addEventListener('click', this.next.bind(this))
    this.prevBtn.addEventListener('click', this.prev.bind(this))
    this.indicatorsContainer.addEventListener('click', this._indicateHandler.bind(this))
    document.addEventListener('keydown', this._pressKeyHandler.bind(this))
  },
  
  init() {
    this._initProps()
    this._initControls()
    this._tick()
    this._initListeners()
  },
}