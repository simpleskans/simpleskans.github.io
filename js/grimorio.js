// assets/js/filtros-magias.js
document.addEventListener("DOMContentLoaded", function () {
    // 1. Seleção de elementos
    const magias = document.querySelectorAll(".carta-magia");
    const filtros = {
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

    let primeiraCarga = true;
    const ALTURA_CABECALHO = 10; // em rem

    // 2. Função principal de filtragem (MODIFICADA)
    function aplicarFiltros() {
        // Obter valores dos filtros
        const termoBusca = filtros.busca.value.toLowerCase();
        const nivelSelecionado = filtros.nivel.value;
        const escolaSelecionada = filtros.escola.value;
        const ritualAtivo = filtros.ritual.checked;
        const concentracaoAtiva = filtros.concentracao.checked;
        const classeSelecionada = filtros.classe.value;

        const componentesSelecionados = Array.from(filtros.componentes)
            .filter((c) => c.checked)
            .map((c) => c.value);

        // Aplicar filtros
        magias.forEach((magia) => {
            const nome = magia.dataset.nome;
            const original = magia.dataset.original;
            const nivel = magia.dataset.nivel;
            const escola = magia.dataset.escola;
            const ritual = magia.dataset.ritual === "true";
            const concentracao = magia.dataset.concentracao === "true";
            const componentes = magia.dataset.componentes;
            const classesMagia = magia.dataset.classes.split(",").map((c) => c.trim().toLowerCase());

            // Critérios de filtro (MODIFICADO - removido magia.textContent)
            const correspondeBusca = termoBusca === "" || 
                                  nome.includes(termoBusca) || 
                                  original.includes(termoBusca);
            const correspondeNivel = !nivelSelecionado || nivel === nivelSelecionado;
            const correspondeEscola = !escolaSelecionada || escola === escolaSelecionada;
            const correspondeRitual = !ritualAtivo || ritual;
            const correspondeConcentracao = !concentracaoAtiva || concentracao;
            const correspondeComponentes =
                componentesSelecionados.length === 0 || componentesSelecionados.every((c) => componentes.includes(c));
            const correspondeClasse = !classeSelecionada || classesMagia.includes(classeSelecionada.toLowerCase());

            // Exibir/ocultar
            if (
                correspondeBusca &&
                correspondeNivel &&
                correspondeEscola &&
                correspondeRitual &&
                correspondeConcentracao &&
                correspondeComponentes &&
                correspondeClasse
            ) {
                magia.style.display = "block";
            } else {
                magia.style.display = "none";
            }
        });

        ordenarMagias();
        scrollParaTopo();
    }

    // 3. Função de ordenação (mantida igual)
    function ordenarMagias() {
        const ordenacao = filtros.ordenar.value;
        const container = document.getElementById("lista-magias");
        const magiasVisiveis = Array.from(magias).filter((m) => m.style.display !== "none");

        magiasVisiveis.sort((a, b) => {
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

        // Reorganizar no DOM
        magiasVisiveis.forEach((magia) => {
            container.appendChild(magia);
        });
    }

    // 4. Função para scroll ao topo (mantida igual)
    function scrollParaTopo() {
        if (primeiraCarga) return;
        
        const listaMagias = document.getElementById("filtros");
        const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const offset = ALTURA_CABECALHO * remToPx;
        
        window.scrollTo({
            top: listaMagias.offsetTop - offset,
            behavior: "smooth"
        });
    }

    // 5. Limpar filtros (mantida igual)
    function limparFiltros() {
        filtros.busca.value = "";
        filtros.nivel.value = "";
        filtros.escola.value = "";
        filtros.ritual.checked = false;
        filtros.concentracao.checked = false;
        filtros.classe.value = "";
        filtros.ordenar.value = "nome-asc";

        filtros.componentes.forEach((c) => (c.checked = false));

        aplicarFiltros();
    }

    // 6. Event listeners (mantidos iguais)
    filtros.busca.addEventListener("input", aplicarFiltros);
    filtros.nivel.addEventListener("change", aplicarFiltros);
    filtros.escola.addEventListener("change", aplicarFiltros);
    filtros.ritual.addEventListener("change", aplicarFiltros);
    filtros.concentracao.addEventListener("change", aplicarFiltros);
    filtros.componentes.forEach((c) => c.addEventListener("change", aplicarFiltros));
    filtros.classe.addEventListener("change", aplicarFiltros);
    filtros.ordenar.addEventListener("change", ordenarMagias);
    filtros.limpar.addEventListener("click", limparFiltros);

    // 7. Inicialização (mantida igual)
    aplicarFiltros();
    primeiraCarga = false;
});