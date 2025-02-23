export class Clock {
    constructor(selector) {
      this.element = document.querySelector(selector);
      if (!this.element) {
        throw new Error(`Element with selector "${selector}" not found.`);
      }
      this.updateTime();
      this.start();
    }
  
    // Форматирует время в HH:MM:SS
    formatTime(date) {
      const pad = (num) => String(num).padStart(2, "0");
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      return `${hours}:${minutes}:${seconds}`;
    }
  
    // Обновляет элемент часов с текущим временем
    updateTime() {
      const now = new Date();
      this.element.textContent = this.formatTime(now);
    }
  
    // Запускает часы и обновляет каждую секунду
    start() {
      this.interval = setInterval(() => this.updateTime(), 1000);
    }
  
    // Останавливает часы
    stop() {
      clearInterval(this.interval);
    }
  }
  