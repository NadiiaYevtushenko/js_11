class Carousel {
  constructor(params) {
    const settings = this._initConfig(params);
    this.container = document.querySelector(settings.containerId);
    this.slideItems = this.container.querySelectorAll(settings.slideId);
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
  }

  _initConfig(objectWithInnerParams) {
    const defaultSettings = {
      containerId: "#carousel",
      slideId: ".slide",
      interval: 5000,
      isPlaying: false
    };
    console.log(objectWithInnerParams);
    const resultObject = {};

    if (typeof objectWithInnerParams === "undefined") {
      return defaultSettings;
    }

    resultObject.containerId =
      objectWithInnerParams.containerId || defaultSettings.containerId;
    resultObject.slideId =
      objectWithInnerParams.slideId || defaultSettings.slideId;
    resultObject.interval =
      objectWithInnerParams.interval || defaultSettings.interval;
    resultObject.isPlaying =
      objectWithInnerParams.isPlaying || defaultSettings.isPlaying;
    return resultObject;
  }

  _initProps() {
    this.body = document.body;
    this.slideItems_COUNT = this.slideItems.length;
    this.CODE_ARROW_LEFT = "ArrowLeft";
    this.CODE_ARROW_RIGHT = "ArrowRight";
    this.CODE_SPACE = "Space";
    this.FA_PAUSE = '<i class="fa fa-regular fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="fa fa-regular fa-play-circle"></i>';
    this.FA_PREV = '<i class="fa fa-solid fa-arrow-left"></i>';
    this.FA_NEXT = '<i class="fa fa-solid fa-arrow-right"></i>';

    this.currentSlide = 0;
    this.timerId = null;
  }

  _initControls() {
    const controls = document.createElement("div");
    const PAUSE = `<div id="pause-btn" class="control pause control-pause">
    <div id='fa-pause-icon'>${this.FA_PAUSE}</div>
    <div id='fa-play-icon'>${this.FA_PLAY}</div>
    </div>`;
    const PLAY = `<div id="play-btn" class="control play control-play">${this.FA_PLAY}</div>`;
    const NEXT = `<div id="next-btn" class="control next control-next">${this.FA_NEXT}</div>`;
    const PREV = `<div id="prev-btn" class="control prev control-prev">${this.FA_PREV}</div>`;

    controls.setAttribute("id", "controls-container");
    controls.classList.add("controls");

    controls.innerHTML = PAUSE + NEXT + PREV;
    this.container.append(controls);

    const indicators = document.createElement("div");
    const ZERO = '<div class="indicator active" data-slide-to="0"></div>';
    const ONE = '<div class="indicator" data-slide-to="1"></div>';
    const TWO = '<div class="indicator" data-slide-to="2"></div>';
    const THREE = '<div class="indicator" data-slide-to="3"></div>';
    const FOUR = '<div class="indicator" data-slide-to="4"></div>';
    const FIVE = '<div class="indicator" data-slide-to="5"></div>';
    const SIX = '<div class="indicator" data-slide-to="6"></div>';

    indicators.setAttribute("id", "indicators-container");
    indicators.classList.add("indicators");

    indicators.innerHTML = ZERO + ONE + TWO + THREE + FOUR + FIVE + SIX;
    this.container.append(indicators);

    this.pauseBtn = this.container.querySelector("#pause-btn");
    this.prevBtn = this.container.querySelector("#prev-btn");
    this.nextBtn = this.container.querySelector("#next-btn");
    this.pauseIcon = this.container.querySelector("#fa-pause-icon");
    this.playIcon = this.container.querySelector("#fa-play-icon");
    this.isPlaying ? this._pauseVisible() : this._playVisible();

    this.indicatorsContainer = this.container.querySelector(
      "#indicators-container"
    );
    this.indicatorItems = this.container.querySelectorAll(".indicator");
  }
  _setBgToBody() {
    this.body.style.backgroundImage =
      this.slideItems[this.currentSlide].style.backgroundImage;
  }

  _goToNth(n) {
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indicatorItems[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.slideItems_COUNT) % this.slideItems_COUNT;
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indicatorItems[this.currentSlide].classList.toggle("active");
  }

  _goToNext() {
    this._goToNth(this.currentSlide + 1);
    this._setBgToBody();
  }

  _goToPrev() {
    this._goToNth(this.currentSlide - 1);
    this._setBgToBody();
  }

  _tick() {
    if (!this.isPlaying) return;
    this.timerId = setInterval(this._goToNext.bind(this), this.interval);
  }

  _pauseVisible(isVisible = true) {
    this.pauseIcon.style.opacity = isVisible ? 1 : 0;
    this.playIcon.style.opacity = isVisible ? 0 : 1;
  }

  _playVisible() {
    this._pauseVisible(false);
  }
  //*pause
  pause() {
    if (!this.isPlaying) return;
    clearInterval(this.timerId);
    this._playVisible();
    this.isPlaying = false;
    this._setBgToBody();
  }
  //*play
  play() {
    if (this.isPlaying) return;
    this._pauseVisible();
    this.isPlaying = true;
    this._setBgToBody();
    this._tick();
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  next() {
    this.pause();
    this._goToNext();
    this._setBgToBody();
  }

  prev() {
    this.pause();
    this._goToPrev();
    this._setBgToBody();
  }

  _indicateHandler(e) {
    const { target } = e;
    if (target && target.classList.contains("indicator")) {
      this.pause();
      this._goToNth(+target.dataset.slideTo);
      this._setBgToBody();
    }
  }

  _pressKeyHandler(e) {
    const { code } = e;
    e.preventDefault();
    if (code === this.CODE_ARROW_LEFT) this.prev();
    if (code === this.CODE_ARROW_RIGHT) this.next();
    if (code === this.CODE_SPACE) this.pausePlay();
  }

  _initListeners() {
    this.pauseBtn.addEventListener("click", this.pausePlay.bind(this));
    this.nextBtn.addEventListener("click", this.next.bind(this));
    this.prevBtn.addEventListener("click", this.prev.bind(this));
    this.indicatorsContainer.addEventListener(
      "click",
      this._indicateHandler.bind(this)
    );
    document.addEventListener("keydown", this._pressKeyHandler.bind(this));
    this.container.addEventListener("mouseenter", this.pause.bind(this));
    this.container.addEventListener("mouseleave", this.play.bind(this));
  }

  init() {
    this._initProps();
    this._initControls();
    this._tick();
    this._initListeners();
  }
}

export default Carousel;