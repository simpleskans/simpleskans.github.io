// assets/js/filtros-magias.js
document.addEventListener("DOMContentLoaded", function () {
    // ============= CONFIGURAÇÕES =============
    const MAGIAS_POR_CARGA = 30;
    const ALTURA_CABECALHO = 10; // 10rem
    const DEBOUNCE_TIME = 300; // ms

    // ============= ESTADO =============
    let todasMagias = [];
    let magiasFiltradas = [];
    let indiceAtual = 0;
    let carregando = false;
    let primeiraCarga = true;

    // ============= ELEMENTOS DOM =============
    const elementos = {
        listaMagias: document.getElementById("lista-magias"),
        scrollTrigger: document.getElementById("scroll-trigger"),
        busca: document.getElementById("busca"),
        nivel: document.getElementById("filtro-nivel"),
        escola: document.getElementById("filtro-escola"),
        ritual: document.getElementById("filtro-ritual"),
        concentracao: document.getElementById("filtro-concentracao"),
        componentes: document.querySelectorAll(".componente"),
        ordenar: document.getElementById("ordenar-por"),
        classe: document.getElementById("filtro-classe"),
        limpar: document.getElementById("limpar-filtros")
    };

    // ============= FUNÇÕES PRINCIPAIS =============

    // 1. Inicialização
    function inicializar() {
        carregarBaseMagias();
        configurarObservador();
        configurarEventListeners();
        aplicarFiltros();
        primeiraCarga = false;
    }

    // 2. Carrega todas as magias uma vez
    function carregarBaseMagias() {
        todasMagias = Array.from(document.querySelectorAll(".carta-magia"));
        todasMagias.forEach((m) => (m.style.display = "none"));
        ordenarOpcoesSelect();
    }

    // 3. Carregamento progressivo automático
    function carregarMagias() {
        if (carregando || indiceAtual >= magiasFiltradas.length) return;

        carregando = true;
        mostrarLoader(true);

        // Simula um pequeno delay para melhor UX
        setTimeout(() => {
            const fragment = document.createDocumentFragment();
            const fim = Math.min(indiceAtual + MAGIAS_POR_CARGA, magiasFiltradas.length);

            for (let i = indiceAtual; i < fim; i++) {
                const clone = magiasFiltradas[i].cloneNode(true);
                clone.style.display = "block";
                fragment.appendChild(clone);
            }

            elementos.listaMagias.appendChild(fragment);
            indiceAtual = fim;
            carregando = false;
            mostrarLoader(false);
        }, 150);
    }

    // 4. Filtragem otimizada
    function aplicarFiltros() {
        const termoBusca = elementos.busca.value.toLowerCase();
        const nivelSelecionado = elementos.nivel.value;
        const escolaSelecionada = elementos.escola.value;
        const ritualAtivo = elementos.ritual.checked;
        const concentracaoAtiva = elementos.concentracao.checked;
        const classeSelecionada = elementos.classe.value;

        const componentesSelecionados = Array.from(elementos.componentes)
            .filter((c) => c.checked)
            .map((c) => c.value);

        magiasFiltradas = todasMagias.filter((magia) => {
            const nome = magia.dataset.nome.toLowerCase();
            const original = magia.dataset.original.toLowerCase();
            const nivel = magia.dataset.nivel;
            const escola = magia.dataset.escola;
            const ritual = magia.dataset.ritual === "true";
            const concentracao = magia.dataset.concentracao === "true";
            const componentes = magia.dataset.componentes;
            const classesMagia = magia.dataset.classes.split(",").map((c) => c.trim().toLowerCase());

            return (
                (termoBusca === "" || nome.includes(termoBusca) || original.includes(termoBusca)) &&
                (nivelSelecionado === "" || nivel === nivelSelecionado) &&
                (escolaSelecionada === "" || escola === escolaSelecionada) &&
                (!ritualAtivo || ritual) &&
                (!concentracaoAtiva || concentracao) &&
                (componentesSelecionados.length === 0 ||
                    componentesSelecionados.every((c) => componentes.includes(c))) &&
                (classeSelecionada === "" || classesMagia.includes(classeSelecionada.toLowerCase()))
            );
        });

        // Reseta a paginação
        elementos.listaMagias.innerHTML = "";
        indiceAtual = 0;

        // Ordena e carrega a primeira página
        ordenarMagias();
        carregarMagias();

        if (!primeiraCarga) scrollParaTopo();
    }

    // 5. Ordenação
    function ordenarMagias() {
        const ordenacao = elementos.ordenar.value;

        magiasFiltradas.sort((a, b) => {
            switch (ordenacao) {
                case "nome-asc":
                    return a.dataset.nome.localeCompare(b.dataset.nome);
                case "nome-desc":
                    return b.dataset.nome.localeCompare(a.dataset.nome);
                case "original-asc":
                    return a.dataset.original.localeCompare(b.dataset.original);
                case "original-desc":
                    return b.dataset.original.localeCompare(a.dataset.original);
                case "nivel-asc":
                    return parseInt(a.dataset.nivel) - parseInt(b.dataset.nivel);
                case "nivel-desc":
                    return parseInt(b.dataset.nivel) - parseInt(a.dataset.nivel);
                default:
                    return 0;
            }
        });
    }

    // ============= FUNÇÕES AUXILIARES =============

    function scrollParaTopo() {
        const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const offset = ALTURA_CABECALHO * remToPx;

        window.scrollTo({
            top: elementos.listaMagias.offsetTop - offset,
            behavior: "smooth"
        });
    }

    function mostrarLoader(mostrar) {
        elementos.scrollTrigger.innerHTML = mostrar ? '<div class="loading">Carregando mais magias...</div>' : "";
    }

    function ordenarOpcoesSelect() {
        const select = elementos.classe;
        const options = Array.from(select.options);
        const valoresUnicos = new Set();

        // Garante que sempre vai existir a opção "todas"
        let opcaoTodas = options.find((opt) => opt.value.trim() === "");
        if (!opcaoTodas) {
            opcaoTodas = new Option("Classes", "");
        }

        // Remove duplicadas (menos a opção vazia)
        for (let i = options.length - 1; i >= 0; i--) {
            const value = options[i].value.trim();
            if (value === "") continue; // mantém a opção "Classes"
            if (valoresUnicos.has(value)) {
                select.remove(i);
            } else {
                options[i].value = value;
                options[i].textContent = value;
                valoresUnicos.add(value);
            }
        }

        // Ordena alfabeticamente (sem a opção vazia)
        const sorted = Array.from(select.options)
            .filter((opt) => opt.value.trim() !== "")
            .sort((a, b) => a.text.localeCompare(b.text, "pt-BR"));

        // Reconstrói o select do zero
        select.innerHTML = "";
        select.add(opcaoTodas);
        sorted.forEach((opt) => select.add(opt));

        // 🔒 Garante reset inicial SEMPRE
        select.value = "";
    }

    // ============= OBSERVADOR DE SCROLL =============
    function configurarObservador() {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !carregando) {
                    carregarMagias();
                }
            }, {
                rootMargin: "100px",
                threshold: 0.1
            }
        );

        observer.observe(elementos.scrollTrigger);
    }

    // ============= EVENT LISTENERS =============
    function configurarEventListeners() {
        // Debounce para busca
        let timeoutBusca;
        elementos.busca.addEventListener("input", () => {
            clearTimeout(timeoutBusca);
            timeoutBusca = setTimeout(aplicarFiltros, DEBOUNCE_TIME);
        });

        // Filtros imediatos
        elementos.nivel.addEventListener("change", aplicarFiltros);
        elementos.escola.addEventListener("change", aplicarFiltros);
        elementos.ritual.addEventListener("change", aplicarFiltros);
        elementos.concentracao.addEventListener("change", aplicarFiltros);
        elementos.classe.addEventListener("change", aplicarFiltros);
        elementos.ordenar.addEventListener("change", aplicarFiltros);

        // Componentes
        elementos.componentes.forEach((c) => c.addEventListener("change", aplicarFiltros));

        // Limpar filtros
        elementos.limpar.addEventListener("click", function () {
            elementos.busca.value = "";
            elementos.nivel.value = "";
            elementos.escola.value = "";
            elementos.ritual.checked = false;
            elementos.concentracao.checked = false;
            elementos.classe.value = "";
            elementos.ordenar.value = "nome-asc";
            elementos.componentes.forEach((c) => (c.checked = false));
            aplicarFiltros();
        });
    }

    // ============= INICIALIZAÇÃO =============
    inicializar();

    // ========== BOTÃO DE IMPRESSÃO DEFINITIVO ==========
    document.getElementById("btn-imprimir")?.addEventListener("click", async function () {
        // 1. Salvar estado atual
        const estadoOriginal = {
            indiceAtual: indiceAtual,
            carregando: carregando,
            magiasExibidas: document.querySelectorAll('.carta-magia[style="display: block;"]').length
        };

        // 2. Forçar carregamento completo
        indiceAtual = 0;
        carregando = false;
        elementos.listaMagias.innerHTML = "";

        // 3. Carregar todas de uma vez (sem limite)
        while (indiceAtual < magiasFiltradas.length) {
            const fragment = document.createDocumentFragment();
            const fim = magiasFiltradas.length; // Carrega todas

            for (let i = indiceAtual; i < fim; i++) {
                const clone = magiasFiltradas[i].cloneNode(true);
                clone.style.display = "block";
                fragment.appendChild(clone);
            }

            elementos.listaMagias.appendChild(fragment);
            indiceAtual = fim;

            // Pequeno delay para renderização
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // 4. Preparar para impressão
        document.documentElement.classList.add("modo-impressao");

        // 5. Esperar renderização completa
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 6. Imprimir
        window.print();

        // 7. Restaurar estado original
        document.documentElement.classList.remove("modo-impressao");
        elementos.listaMagias.innerHTML = "";
        indiceAtual = 0;
        carregando = false;

        // Recarregar o estado original
        for (let i = 0; i < estadoOriginal.magiasExibidas && i < magiasFiltradas.length; i++) {
            const clone = magiasFiltradas[i].cloneNode(true);
            clone.style.display = "block";
            elementos.listaMagias.appendChild(clone);
        }

        indiceAtual = estadoOriginal.magiasExibidas;
        carregando = estadoOriginal.carregando;
    });
});
