document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < 900) {
    const images = document.querySelectorAll(".zoom-img");

    images.forEach(img => {
      img.addEventListener("click", () => {
        // Создаём затемнённый фон (оверлей)
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          overflow: hidden;
        `;

        // Создаём увеличенное изображение
        const fullImg = document.createElement("img");
        fullImg.src = img.src;
        fullImg.style.cssText = `
          max-width: 90%;
          max-height: 90%;
          cursor: grab;
          touch-action: none;
          transition: transform 0.3s ease;
        `;

        overlay.appendChild(fullImg);
        document.body.appendChild(overlay);

        // Инициализация Panzoom с поддержкой pinch, scroll, move
        const panzoom = Panzoom(fullImg, {
          maxScale: 5,
          contain: 'outside',
          pinchSpeed: 1,       // чувствительность масштабирования
          panOnlyWhenZoomed: false
        });

        // Разрешаем жесты пальцами
        fullImg.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
        fullImg.parentElement.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });

        // Сброс масштаба по двойному тапу
        let lastTap = 0;
        fullImg.addEventListener("touchend", e => {
          const now = new Date().getTime();
          if (now - lastTap < 300) {
            panzoom.reset();
          }
          lastTap = now;
        });

        // Закрытие по тапу на фон
        overlay.addEventListener("click", e => {
          if (e.target === overlay) overlay.remove();
        });
      });
    });
  }
});
