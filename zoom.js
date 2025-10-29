document.addEventListener("DOMContentLoaded", () => {
  // Проверяем: если ширина экрана меньше 900px, активируем зум
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
        fullImg.style.maxWidth = "100%";
        fullImg.style.maxHeight = "100%";
        fullImg.style.cursor = "grab";
        fullImg.style.touchAction = "none"; // важно для pinch-zoom
        overlay.appendChild(fullImg);
        document.body.appendChild(overlay);

        // Активируем Panzoom — поддержка масштабирования и перемещения пальцами
        const panzoom = Panzoom(fullImg, {
          maxScale: 4, // максимальный зум
          contain: "outside"
        });

        // Двойной тап (или двойной клик) — сброс масштаба
        fullImg.addEventListener("dblclick", () => panzoom.reset());

        // Тап по фону — закрыть просмотр
        overlay.addEventListener("click", e => {
          if (e.target === overlay) overlay.remove();
        });
      });
    });
  }
});
