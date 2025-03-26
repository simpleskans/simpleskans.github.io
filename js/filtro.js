document.addEventListener('DOMContentLoaded', function() {
    const filterRadios = document.querySelectorAll('input[name="level-filter"]');
    const allPosts = document.querySelectorAll('.post-item');

    function filterPosts() {
        const selectedValue = document.querySelector('input[name="level-filter"]:checked').value;
        const isAllLevels = selectedValue === 'todos';
        
        allPosts.forEach(post => {
            if (isAllLevels) {
                post.style.display = '';
                return;
            }

            const postTags = post.dataset.tags.split(',').map(tag => tag.trim());
            const exactMatch = postTags.some(tag => tag === selectedValue);
            
            post.style.display = exactMatch ? '' : 'none';
        });
    }

    // Inicializa os filtros
    filterRadios.forEach(radio => {
        radio.addEventListener('change', filterPosts);
    });
    
    // Filtra inicialmente (opcional)
    filterPosts();
});