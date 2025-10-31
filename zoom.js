document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < 1024) {
    const images = document.querySelectorAll(".zoom-img");

    images.forEach(img => {
      img.addEventListener("click", () => {
        // создаём затемнённый фон
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          touch-action: none;
          overflow: hidden;
        `;
        document.body.appendChild(overlay);
        document.body.classList.add("modal-open");

        // создаём контейнер Panzoom
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          touch-action: none;
        `;
        overlay.appendChild(wrapper);

        // создаём изображение
        const fullImg = document.createElement("img");
        fullImg.src = img.src;
        fullImg.style.cssText = `
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          cursor: grab;
          user-select: none;
          touch-action: none;
          transition: transform 0.2s ease;
        `;
        wrapper.appendChild(fullImg);

        // инициализируем Panzoom
        const panzoom = Panzoom(fullImg, {
          maxScale: 6,
          contain: 'none',       // полная свобода перемещения
          startScale: 1,
          startX: 0,
          startY: 0
        });

        // подключаем жесты
        wrapper.addEventListener('wheel', panzoom.zoomWithWheel);
        wrapper.addEventListener('pointerdown', e => e.stopPropagation());
        wrapper.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

        // двойной тап для сброса
        let lastTap = 0;
        fullImg.addEventListener("touchend", e => {
          const now = Date.now();
          if (now - lastTap < 300) {
            panzoom.reset();
          }
          lastTap = now;
        });

        // тап по фону — закрытие
        overlay.addEventListener("click", e => {
          if (e.target === overlay) {
            overlay.remove();
            document.body.classList.remove("modal-open");
          }
        });
      });
    });
  }
});

// двойной тап — либо сброс зума, либо закрытие
let lastTap = 0;
fullImg.addEventListener('touchend', e => {
  const now = Date.now();
  const tapInterval = now - lastTap;

  if (tapInterval < 300) {
    // узнаём текущий масштаб
    const currentScale = panzoom.getScale ? panzoom.getScale() : 1;

    if (currentScale > 1.2) {
      // если увеличено — сбрасываем
      panzoom.reset();
    } else {
      // если нет — закрываем
      overlay.remove();
      document.body.classList.remove('modal-open');
    }
  }
  lastTap = now;
});

