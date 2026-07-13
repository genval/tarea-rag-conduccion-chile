/* Navegación de paneles — teclado (← → ↑ ↓ espacio PgUp PgDn Home End),
   barra de progreso, contador y reveal escalonado. Sin dependencias. */
(function () {
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  if (!panels.length) return;
  var prog = document.querySelector(".deck-progress");
  var count = document.querySelector(".deck-top .count");
  var current = 0;

  function update() {
    if (prog) prog.style.width = ((current + 1) / panels.length) * 100 + "%";
    if (count) count.textContent = current + 1 + " / " + panels.length;
  }

  // reveal + seguimiento del panel visible
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          var i = panels.indexOf(e.target);
          if (i >= 0) { current = i; update(); }
        }
      });
    }, { threshold: 0.5 });
    panels.forEach(function (p) { io.observe(p); });
  } else {
    panels.forEach(function (p) { p.classList.add("in"); });
  }

  function go(i) {
    current = Math.max(0, Math.min(panels.length - 1, i));
    panels[current].scrollIntoView({ behavior: "smooth" });
    update();
  }

  var NEXT = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, " ": 1 };
  var PREV = { ArrowLeft: 1, ArrowUp: 1, PageUp: 1 };

  window.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && t.matches && t.matches("input,textarea,select,button,a")) return;
    if (NEXT[e.key]) { e.preventDefault(); go(current + 1); }
    else if (PREV[e.key]) { e.preventDefault(); go(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(panels.length - 1); }
  });

  update();
})();
