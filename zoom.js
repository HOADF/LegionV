document.addEventListener("DOMContentLoaded", () => {
  // Активируем только на мобильных
  if (window.innerWidth < 900) {
    const images = document.querySelectorAll(".zoom-img");

    images.forEach(img => {
      img.addEventListener("click", () => {
        // Создаём оверлей
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          touch-action: none;
          overflow: hidden;
        `;

        // Картинка
        const fullImg = document.createElement("img");
        fullImg.src = img.src;
        fullImg.style.cssText = `
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          cursor: grab;
          touch-action: none;
          transform-origin: center center;
          transition: transform 0.25s ease;
        `;

        overlay.appendChild(fullImg);
        document.body.appendChild(overlay);
        document.body.classList.add("modal-open");

        // Инициализация Panzoom
        const panzoom = Panzoom(fullImg, {
          contain: 'outside',
          maxScale: 6,
          startScale: 1,
          pinchSpeed: 1.5,
          step: 0.25,
          panOnlyWhenZoomed: false,
        });

        // Поддержка масштабирования колесом мыши и pinch на телефоне
        overlay.addEventListener('wheel', panzoom.zoomWithWheel);
        overlay.addEventListener('gesturestart', e => e.preventDefault());

        // === Двойной тап (сброс масштаба) ===
        let lastTap = 0;
        fullImg.addEventListener('touchend', e => {
          const now = new Date().getTime();
          if (now - lastTap < 300) {
            panzoom.reset();
          }
          lastTap = now;
        });

        // === Закрытие по тапу на фон ===
        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            overlay.remove();
            document.body.classList.remove("modal-open");
          }
        });

        // === Разрешаем перетаскивание одним пальцем ===
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        fullImg.addEventListener("touchstart", e => {
          if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
          }
        });

        fullImg.addEventListener("touchmove", e => {
          if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            panzoom.pan(dx, dy);
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
          }
        });

        fullImg.addEventListener("touchend", () => (isDragging = false));
      });
    });
  }
});
