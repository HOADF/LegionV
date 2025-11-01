// zoom.js — реалистичный зум и перемещение на мобильных
document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth >= 1024) return;

  const images = document.querySelectorAll(".zoom-img");
  if (!images.length) return;

  images.forEach(img => {
    img.addEventListener("click", () => {
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
      `;
      document.body.appendChild(overlay);
      document.body.classList.add("modal-open");

      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        touch-action: none;
      `;
      overlay.appendChild(wrapper);

      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.alt = img.alt || "";
      fullImg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        cursor: grab;
        user-select: none;
        touch-action: none;
        will-change: transform;
        transition: transform 0.15s ease;
      `;
      wrapper.appendChild(fullImg);

      const panzoom = Panzoom(fullImg, {
        maxScale: 6,
        contain: "outside",
        startScale: 1,
        startX: 0,
        startY: 0,
      });

      wrapper.addEventListener("wheel", panzoom.zoomWithWheel);
      wrapper.addEventListener("pointerdown", e => e.stopPropagation());
      wrapper.addEventListener("touchmove", e => e.stopPropagation(), { passive: false });
      wrapper.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });

      let lastTap = 0;
      fullImg.addEventListener("touchend", e => {
        const now = Date.now();
        const delta = now - lastTap;
        lastTap = now;

        if (delta < 300) closeOverlay();
      });

      overlay.addEventListener("click", e => {
        if (e.target === overlay) closeOverlay();
      });

      function closeOverlay() {
        overlay.classList.add("fade-out");
        setTimeout(() => {
          overlay.remove();
          document.body.classList.remove("modal-open");
        }, 220);
      }
    });
  });
});
