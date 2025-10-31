// zoom.js — заменяет предыдущие фрагменты. Работает с panzoom (подключён через CDN).
document.addEventListener("DOMContentLoaded", () => {
  // Включаем поведение на устройствах с экраном меньше 1024px (можно подстроить)
  if (window.innerWidth >= 1024) return;

  const images = document.querySelectorAll(".zoom-img");
  if (!images.length) return;

  images.forEach(img => {
    img.addEventListener("click", () => {
      // --- Создаём overlay и wrapper ---
      const overlay = document.createElement("div");
      overlay.className = "zoom-overlay";
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
        -webkit-tap-highlight-color: transparent;
      `;
      document.body.appendChild(overlay);
      document.body.classList.add("modal-open");

      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        width: 100%;
        height: 100%;
        display:flex;
        justify-content:center;
        align-items:center;
        overflow:hidden;
        touch-action: none;
      `;
      overlay.appendChild(wrapper);

      // --- Создаём full image ---
      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.alt = img.alt || "";
      fullImg.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        cursor: grab;
        user-select: none;
        touch-action: none;
        will-change: transform;
        transition: transform 0.15s ease;
        display: block;
        margin: auto;
      `;
      wrapper.appendChild(fullImg);

      // Инициализация Panzoom
      const panzoom = Panzoom(fullImg, {
        maxScale: 6,
        contain: 'outside',      // позволяем двигаться за границы, но не ломать поведение
        startScale: 1
      });

      // Подключаем жесты wheel (для теста на десктопе) — безопасно
      // (если не нужен, можно убрать)
      wrapper.addEventListener('wheel', panzoom.zoomWithWheel);

      // Отключаем пробрасывание указательных событий к overlay, чтобы клик мимо картинки работал корректно
      wrapper.addEventListener('pointerdown', e => e.stopPropagation());
      fullImg.addEventListener('pointerdown', e => e.stopPropagation());

      // Позволяем тач-перетаскивание без прокрутки страницы
      wrapper.addEventListener('touchmove', e => e.stopPropagation(), { passive: false });
      wrapper.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });

      // --- Двойной тап: если увеличено — сбросить, иначе закрыть ---
      let lastTap = 0;
      fullImg.addEventListener('touchend', (ev) => {
        const now = Date.now();
        const delta = now - lastTap;
        lastTap = now;

        if (delta < 300) {
          // это двойной тап
          // getScale поддерживается у Panzoom-инстанса
          const currentScale = typeof panzoom.getScale === 'function' ? panzoom.getScale() : 1;
          if (currentScale > 1.05) {
            // сбрасываем масштаб, оставляем overlay, затем плавно закрываем
            panzoom.reset();
            // небольшая задержка чтобы сброс был видим
            setTimeout(() => closeOverlay(), 250);
          } else {
            // просто закрываем
            closeOverlay();
          }
        }
      });

      // --- Тап по фону (overlay) закрывает ---
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeOverlay();
        }
      });

      // --- Функция закрытия (плавно) ---
      function closeOverlay() {
        overlay.classList.add('fade-out');
        // небольшая пауза чтобы увидеть анимацию
        setTimeout(() => {
          try { overlay.remove(); } catch (err) {}
          document.body.classList.remove("modal-open");
        }, 220);
      }

      // --- При destroy: отцепляем обработчики и панзум ---
      // Добавим слушатель на удаление overlay (на всякий случай)
      overlay.addEventListener('transitionend', (ev) => {
        if (ev.propertyName === 'opacity' && overlay.parentNode == null) {
          try { panzoom.destroy && panzoom.destroy(); } catch (err) {}
        }
      });

      // Для безопасности: если пользователь сделает gesture на изображении, Panzoom сохранит позицию/масштаб.
      // Никакой дополнительной логики не нужно — Panzoom хранит состояние.
    });
  });
});
