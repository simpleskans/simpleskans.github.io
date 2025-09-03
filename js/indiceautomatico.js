(function () {
  const HEADER_OFFSET_PX = 96; // 6rem fixo

  function buildTOC() {
    const content = document.getElementById("content");
    const toc = document.getElementById("toc");
    if (!toc) return;

    // H1 externo
    const h1Extra = document.getElementById("tituloaventura");
    // headers dentro do article (ignora h5/h6)
    const contentHeaders = content ? content.querySelectorAll("h2,h3,h4") : [];

    // combina H1 externo com os headers do article
    const headers = [];
    if (h1Extra) headers.push(h1Extra);
    contentHeaders.forEach((h) => headers.push(h));

    const ulRoot = document.createElement("ul");
    toc.appendChild(ulRoot);

    const map = new Map(); // id -> { link, subUl?, parentKey?, li, hasIndicator }
    let lastH2Key = null;
    let lastH3Key = null;

    headers.forEach((h, i) => {
      const level = parseInt(h.tagName[1], 10);
      const id = h.id || `section-${i}`;
      h.id = id;

      if (level <= 2) {
        // ==== H1 (extra) ou H2: item principal ====
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
        lastH2Key = id;
        lastH3Key = null;

        a.addEventListener("click", (e) => {
          e.preventDefault();
          openOnly(subUl);
          scrollToSection(h);
          setActiveLink(id);
        });
      } else if (level === 3) {
        // ==== H3: dentro do último H2 ====
        if (!lastH2Key) return;
        const parent = map.get(lastH2Key);
        if (!parent) return;

        const subLi = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = h.textContent;
        a.href = `#${id}`;
        subLi.appendChild(a);

        const subUl = document.createElement("ul");
        subUl.className = "sublist";
        subLi.appendChild(subUl);

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
          openOnly(subUl);
          scrollToSection(h);
          setActiveLink(id);
        });

        map.set(id, { link: a, subUl, parentKey: lastH2Key, li: subLi, hasIndicator: false });
        lastH3Key = id;
      } else if (level === 4) {
        // ==== H4: dentro do último H3 ====
        if (!lastH3Key) return;
        const parent = map.get(lastH3Key);
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
          scrollToSection(h);
          setActiveLink(id);
        });

        map.set(id, { link: a, parentKey: lastH3Key });
      }
      // H5 e H6 são ignorados
    });

    // Fecha TOC no mobile ao clicar em um link
    document.querySelectorAll("#toc a").forEach((a) => {
      a.addEventListener("click", () => {
        const toc = document.getElementById("toc");
        const tocToggle = document.getElementById("toc-toggle");

        if (toc.classList.contains("mobile-aberto")) {
          toc.classList.remove("mobile-aberto");
          document.body.classList.remove("no-scroll");
          tocToggle.classList.remove("open");
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

      // abre todos os pais recursivamente
      let current = node;
      while (current?.parentKey) {
        const parent = map.get(current.parentKey);
        if (parent?.subUl) parent.subUl.classList.add("open");
        if (parent?.link) parent.link.classList.add("open-sublist");
        current = parent;
      }

      // se o próprio tem subUl (ex.: H2 com H3 dentro)
      if (node.subUl) {
        node.subUl.classList.add("open");
        if (node.link) node.link.classList.add("open-sublist");
      }
    }

    // função para scroll instantâneo
    function scrollToSection(target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET_PX;
      window.scrollTo(0, y);
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

      // limpa classes
      document.querySelectorAll("#toc a").forEach((a) => {
        a.classList.remove("active");
        a.classList.remove("open-sublist");
      });
      document.querySelectorAll("#toc .sublist").forEach((ul) => ul.classList.remove("open"));

      const node = map.get(currentId);
      if (!node) return;

      if (node.link) node.link.classList.add("active");

      // abre todos os pais recursivamente
      let current = node;
      while (current?.parentKey) {
        const parent = map.get(current.parentKey);
        if (parent?.subUl) parent.subUl.classList.add("open");
        if (parent?.link) parent.link.classList.add("open-sublist");
        current = parent;
      }

      // se o próprio tem subUl
      if (node.subUl) {
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
