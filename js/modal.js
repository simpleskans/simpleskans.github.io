document.addEventListener("DOMContentLoaded", function () {
    const modal = document.createElement("div");
    modal.id = "img-modal";
    modal.className = "closeable";
    modal.innerHTML = "<img src=''>";
    document.body.appendChild(modal);

    const modalImg = modal.querySelector("img");

    document.querySelectorAll(".zoom-img").forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = img.src;
        });
    });

    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });
});
