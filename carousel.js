class Carousel {
  constructor(params) {
    const settings = {
      containerId: "#carousel",
      slideId: ".slide",
      interval: 5000,
      isPlaying: true,
      ...params
    };

    this.container = document.querySelector(settings.containerId);
    this.slideItems = this.container.querySelectorAll(settings.slideId);
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
    this.currentSlide = 0;
    this.timerId = null;

    this._initControls();
    this._initIndicators();
    this._initListeners();
    this._tick();
  }

  _initControls() {
    const controls = document.createElement("div");
    controls.setAttribute("id", "controls-container");
    controls.classList.add("controls");
    
    controls.innerHTML = `
      <div id="pause-btn" class="control pause control-pause">
        <div id='fa-pause-icon'><i class="fa fa-regular fa-pause-circle"></i></div>
        <div id='fa-play-icon'><i class="fa fa-regular fa-play-circle"></i></div>
      </div>
      <div id="next-btn" class="control next control-next"><i class="fa fa-solid fa-arrow-right"></i></div>
      <div id="prev-btn" class="control prev control-prev"><i class="fa fa-solid fa-arrow-left"></i></div>
    `;
    this.container.append(controls);

    this.pauseBtn = this.container.querySelector("#pause-btn");
    this.nextBtn = this.container.querySelector("#next-btn");
    this.prevBtn = this.container.querySelector("#prev-btn");
    this.pauseIcon = this.container.querySelector("#fa-pause-icon");
    this.playIcon = this.container.querySelector("#fa-play-icon");

    this.isPlaying ? this._pauseVisible() : this._playVisible();
  }

  _initIndicators() {
    const indicators = document.createElement("div");
    indicators.setAttribute("id", "indicators-container");
    indicators.classList.add("indicators");
    for (let i = 0; i < this.slideItems.length; i++) {
      const indicator = document.createElement("div");
      indicator.setAttribute("class", i === 0 ? "indicator active" : "indicator");
      indicator.dataset.slideTo = i;
      indicators.append(indicator);
    }
    this.container.append(indicators);
    this.indicatorsContainer = this.container.querySelector("#indicators-container");
    this.indicatorItems = this.container.querySelectorAll(".indicator");
  }

  _initListeners() {
    document.addEventListener("keydown", this._pressKey.bind(this));
    this.pauseBtn.addEventListener("click", this.pausePlay.bind(this));
    this.nextBtn.addEventListener("click", this.next.bind(this));
    this.prevBtn.addEventListener("click", this.prev.bind(this));
    this.indicatorsContainer.addEventListener("click", this._indicateHandler.bind(this));
    this.container.addEventListener("mouseenter", this.pause.bind(this));
    this.container.addEventListener("mouseleave", this.play.bind(this));
  }

  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indicatorItems[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.slideItems.length) % this.slideItems.length;
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indicatorItems[this.currentSlide].classList.toggle("active");
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _indicateHandler(e) {
    if (e.target && e.target.matches(".indicator")) {
      this.pause();
      this._gotoNth(+e.target.dataset.slideTo);
    }
  }

  _pressKey(e) {
    e.preventDefault();
    if (e.code === "ArrowLeft") this.prev();
    if (e.code === "ArrowRight") this.next();
    if (e.code === "Space") this.pausePlay();
  }

  _tick() {
    if (!this.isPlaying) return;
    if (this.timerId) return;
    this.timerId = setInterval(() => this._gotoNext(), this.interval);
  }

  _pauseVisible(isVisible = true) {
    this.pauseIcon.style.opacity = isVisible ? 1 : 0;
    this.playIcon.style.opacity = isVisible ? 0 : 1;
  }

  _playVisible() {
    this._pauseVisible(false);
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  pause() {
    if (!this.isPlaying) return;
    this._playVisible();
    this.isPlaying = false;
    clearInterval(this.timerId);
    this.timerId = null;
  }

  play() {
    if (this.isPlaying) return;
    this._pauseVisible();
    this.isPlaying = true;
    this._tick();
  }

  next() {
    this.pause();
    this._gotoNext();
  }

  prev() {
    this.pause();
    this._gotoPrev();
  }
}

export default Carousel;
