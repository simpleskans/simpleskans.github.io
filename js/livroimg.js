document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#content img").forEach(img => {
    const alt = img.getAttribute("alt") || "";

    // adiciona a classe de zoom (seu outro JS já usa ela)
    img.classList.add("zoom-img");

    // float esquerda
    if (alt.includes("flue")) {
      img.classList.add("flue");
      img.alt = alt.replace("flue", "").trim();
    }

    // float direita
    if (alt.includes("flud")) {
      img.classList.add("flud");
      img.alt = alt.replace("flud", "").trim();
    }
  });
});