(function () {
  const HEADER_OFFSET_PX = 96; // 6rem fixo

  function buildTOC() {
    const content = document.getElementById("content");
    const toc = document.getElementById("toc");
    if (!toc) return;

    // H1 externo
    const h1Extra = document.getElementById("tituloaventura");
    // headers dentro do article
    const contentHeaders = content ? content.querySelectorAll("h2,h3,h4,h5,h6") : [];

    // combina H1 externo com os headers do article
    const headers = [];
    if (h1Extra) headers.push(h1Extra);
    contentHeaders.forEach((h) => headers.push(h));

    const ulRoot = document.createElement("ul");
    toc.appendChild(ulRoot);

    const map = new Map(); // id do heading -> { link, subUl?, parentKey?, li, hasIndicator }
    let lastTopKey = null;

    headers.forEach((h, i) => {
      const level = parseInt(h.tagName[1], 10);
      const id = h.id || `section-${i}`;
      h.id = id;

      if (level <= 2) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = h.textContent;
        a.href = `#${id}`;
        if (h.id === "tituloaventura") {
          a.classList.add("titulomenu");
        }
        li.appendChild(a);

        const subUl = document.createElement("ul");
        subUl.className = "sublist";
        li.appendChild(subUl);

        ulRoot.appendChild(li);

        map.set(id, { link: a, subUl, li, hasIndicator: false });
        lastTopKey = id;

        a.addEventListener("click", (e) => {
          e.preventDefault();
          openOnly(subUl);
          scrollToSection(h); // scroll instantâneo
          setActiveLink(id);
        });
      } else {
        if (!lastTopKey) return;
        const parent = map.get(lastTopKey);
        if (!parent) return;

        const subLi = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = h.textContent;
        a.href = `#${id}`;
        subLi.appendChild(a);
        parent.subUl.appendChild(subLi);

        if (!parent.hasIndicator) {
          const indicator = document.createElement("span");
          indicator.className = "sublist-indicator";
          indicator.textContent = "❯";
          parent.link.appendChild(indicator);
          parent.hasIndicator = true;
        }

        a.addEventListener("click", (e) => {
          e.preventDefault();
          openOnly(parent.subUl);
          scrollToSection(h); // scroll instantâneo
          setActiveLink(id);
        });

        map.set(id, { link: a, parentKey: lastTopKey });
      }
    });

    // Depois de construir todos os links do TOC
    document.querySelectorAll("#toc a").forEach((a) => {
      a.addEventListener("click", () => {
        const toc = document.getElementById("toc");
        const tocToggle = document.getElementById("toc-toggle");

        if (toc.classList.contains("mobile-aberto")) {
          toc.classList.remove("mobile-aberto"); // fecha menu
          document.body.classList.remove("no-scroll"); // desbloqueia scroll atrás
          tocToggle.classList.remove("open"); // seta volta para hambúrguer
        }
      });
    });

    function openOnly(targetSubUl) {
      document.querySelectorAll("#toc .sublist.open").forEach((el) => {
        el.classList.remove("open");
        const parentLink = el.parentElement.querySelector("a");
        if (parentLink) parentLink.classList.remove("open-sublist");
      });
      if (targetSubUl) {
        targetSubUl.classList.add("open");
        const parentLink = targetSubUl.parentElement.querySelector("a");
        if (parentLink) parentLink.classList.add("open-sublist");
      }
    }

    function setActiveLink(id) {
      document.querySelectorAll("#toc a").forEach((a) => {
        a.classList.remove("active");
        a.classList.remove("open-sublist");
      });
      document.querySelectorAll("#toc .sublist").forEach((ul) => ul.classList.remove("open"));

      const node = map.get(id);
      if (!node) return;

      if (node.link) node.link.classList.add("active");

      if (node.parentKey) {
        const parent = map.get(node.parentKey);
        if (parent?.subUl) parent.subUl.classList.add("open");
        if (parent?.link) parent.link.classList.add("open-sublist");
      } else if (node.subUl) {
        node.subUl.classList.add("open");
        if (node.link) node.link.classList.add("open-sublist");
      }
    }

    // função para scroll instantâneo
    function scrollToSection(target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET_PX;
      window.scrollTo(0, y); // scroll instantâneo
    }

    const allHeaders = headers;

    function updateOnScroll() {
      let currentId = null;
      let bestTop = -Infinity;
      for (const el of allHeaders) {
        const top = el.getBoundingClientRect().top - HEADER_OFFSET_PX;
        if (top <= 10 && top > bestTop) {
          bestTop = top;
          currentId = el.id;
        }
      }
      if (!currentId && allHeaders.length) currentId = allHeaders[0].id;
      if (!currentId) return;

      // remove classes ativas e seta girada
      document.querySelectorAll("#toc a").forEach((a) => {
        a.classList.remove("active");
        a.classList.remove("open-sublist");
      });
      document.querySelectorAll("#toc .sublist").forEach((ul) => ul.classList.remove("open"));

      const node = map.get(currentId);
      if (!node) return;

      if (node.link) node.link.classList.add("active");

      if (node.parentKey) {
        const parent = map.get(node.parentKey);
        if (parent?.subUl) parent.subUl.classList.add("open");
        if (parent?.link) parent.link.classList.add("open-sublist");
      } else if (node.subUl) {
        node.subUl.classList.add("open");
        if (node.link) node.link.classList.add("open-sublist");
      }
    }

    updateOnScroll();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("hashchange", updateOnScroll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildTOC);
  } else {
    buildTOC();
  }
})();
