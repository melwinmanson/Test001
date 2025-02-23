import gsap from "gsap";

export class Marquee {
  constructor(rootElement) {
    console.log("Marquee initialized");
    this.marquee = rootElement;
    this.marqueeInner = this.marquee.querySelector(".marquee_inner");
    this.animation = null;

    // Скрываем переполнение, чтобы не было горизонтального скроллбара
    this.marquee.style.overflow = "hidden";

    this.updateDimensions();
    this.setup();
    this.animate();

    // Наблюдаем за изменением размеров
    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(this.handleResize.bind(this));
    });
    this.resizeObserver.observe(this.marquee);

    this.marquee.addEventListener("mouseenter", this.stopAnimation.bind(this));
    this.marquee.addEventListener("mouseleave", this.resumeAnimation.bind(this));
  }

  sanitizeElement(element) {
    element.innerHTML = element.innerHTML.replace(/\n/g, "");
    element.style.whiteSpace = "nowrap";
  }

  updateDimensions() {
    this.marqueeInnerWidth = this.marqueeInner.offsetWidth;
    this.marqueeWidth = this.marquee.offsetWidth;
    this.gap = parseFloat(getComputedStyle(this.marquee).gap) || 0;
  }

  setup() {
    // Удаляем старые клоны, оставляем только оригинальный элемент
    this.marquee
      .querySelectorAll(".marquee_inner:not(:first-child)")
      .forEach(clone => clone.remove());

    // Определяем необходимое количество копий (учитывая оригинальный элемент)
    const numCopies = Math.ceil(this.marqueeWidth / this.marqueeInnerWidth) + 1;

    // Удаляем существующий контейнер, если он уже есть
    if (this.wrapper) {
      this.wrapper.remove();
    }

    // Создаем новый контейнер с flex-раскладкой и отключенным переносом текста
    this.wrapper = document.createElement("div");
    Object.assign(this.wrapper.style, {
      display: "flex",
      gap: `${this.gap}px`,
      whiteSpace: "nowrap"
    });

    // Добавляем оригинальный элемент в контейнер
    this.wrapper.appendChild(this.marqueeInner);

    // Добавляем необходимые клоны
    for (let i = 1; i < numCopies; i++) {
      const clone = this.marqueeInner.cloneNode(true);
      this.sanitizeElement(clone);
      this.wrapper.appendChild(clone);
    }

    this.marquee.appendChild(this.wrapper);
  }

  animate() {
    // Вычисляем ширину одного элемента с учетом промежутка Gap
    const itemWidth = this.marqueeInnerWidth + this.gap;

    // Запускаем анимацию для бесконечного эффекта прокрутки
    this.animation = gsap.to(this.wrapper, {
      x: -itemWidth,
      duration: 5,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        // Сбрасываем позицию для плавного повторения анимации
        gsap.set(this.wrapper, { x: 0 });
      }
    });
  }

  handleResize() {
    // Обновляем размеры элементов
    this.updateDimensions();

    // Останавливаем текущую анимацию, если она активна
    if (this.animation) {
      this.animation.kill();
    }

    // Перестраиваем marquee и перезапускаем анимацию
    this.setup();
    this.animate();
  }
  
  stopAnimation() {
    if (this.animation) {
      // Замедляем анимацию
      this.animation.timeScale(0.25);
    }
  }

  resumeAnimation() {
    if (this.animation) {
      // Возвращаем к нормальной скорости
      this.animation.timeScale(1);
    }
  }
}
