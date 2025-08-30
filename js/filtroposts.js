document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filtro-btn');
    const postItems = document.querySelectorAll('.post-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove a classe 'active' de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            this.classList.add('active');

            const categoria = this.getAttribute('data-categoria');

            postItems.forEach(item => {
                if (categoria === 'todos' || item.classList.contains(categoria)) {
                    item.style.display = 'list-item'; // Ou 'block' ou 'flex', dependendo do seu CSS
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
