document.addEventListener("DOMContentLoaded", () => {
  // Находим все изображения с классом zoom-img
  const images = document.querySelectorAll(".zoom-img");

  images.forEach(img => {
    img.addEventListener("click", () => {
      // создаём затемнённый фон (оверлей)
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

      // создаём увеличенную копию изображения
      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.style.maxWidth = "100%";
      fullImg.style.maxHeight = "100%";
      fullImg.style.cursor = "grab";
      fullImg.style.touchAction = "none"; // важно для pinch-zoom
      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);

      // активируем Panzoom
      const panzoom = Panzoom(fullImg, {
        maxScale: 4, // можно увеличить до 5–6, если хочешь
        contain: "outside"
      });

      // двойной тап — сброс масштаба
      fullImg.addEventListener("dblclick", () => panzoom.reset());

      // тап по фону — закрыть
      overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
      });
    });
  });
});
