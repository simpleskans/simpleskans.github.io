const tocToggle = document.getElementById("toc-toggle");
const toc = document.getElementById("toc");

tocToggle.addEventListener("click", () => {
    const isOpen = toc.classList.contains("mobile-aberto");

    if (isOpen) {
        // fecha menu
        toc.classList.remove("mobile-aberto");
        document.body.classList.remove("no-scroll");
        tocToggle.textContent = "☰ ÍNDICE"; // volta para hambúrguer
    } else {
        // abre menu
        toc.classList.add("mobile-aberto");
        document.body.classList.add("no-scroll");
        tocToggle.textContent = "×"; // seta de voltar

        // abre automaticamente todas as sublistas
        document.querySelectorAll("#toc .sublist").forEach((ul) => ul.classList.add("open"));
        document.querySelectorAll("#toc a").forEach((a) => a.classList.add("open-sublist"));
    }
});
