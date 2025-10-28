// zoom.js — простое увеличение картинки по тапу (с возможностью масштабирования пальцами)

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".project img");

  images.forEach(img => {
    img.addEventListener("click", () => {
      // создаём затемнение поверх страницы
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
      fullImg.style.cursor = "zoom-out";
      fullImg.style.touchAction = "none"; // чтобы можно было масштабировать и двигать пальцами

      // вставляем изображение в оверлей
      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);

      // подключаем Panzoom (если есть)
      if (window.Panzoom) {
        const panzoom = Panzoom(fullImg, { contain: 'outside', maxScale: 4 });
        // отключаем клики внутри изображения (чтобы не закрывалось)
        fullImg.addEventListener("click", e => e.stopPropagation());
      }

      // закрытие по тапу на фоне
      overlay.addEventListener("click", () => overlay.remove());
    });
  });
});
