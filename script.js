document.addEventListener("DOMContentLoaded", async () => {

    // --- Lógica para a página principal (index.html) ---
    if (document.querySelector(".card-container")) {
        const cardContainer = document.querySelector(".card-container");
        const loadingIndicator = document.getElementById('loading-indicator');
        const searchInput = document.getElementById("search-input");
        const genderFilter = document.getElementById("filter-gender");
        const colorFilter = document.getElementById("filter-color");
        const clearFiltersBtn = document.getElementById("clear-filters-btn");
        let allCats = [];

        const showLoading = (show) => {
            if (show) {
                cardContainer.style.display = 'none';
                loadingIndicator.classList.add('visible');
            } else {
                loadingIndicator.classList.remove('visible');
                cardContainer.style.display = 'grid';
            }
        };

        async function carregarDados() {
            try {
                const resposta = await fetch("data.json");
                allCats = await resposta.json();
                populateFilters(allCats);
                applyFilters(); // Renderiza os cards iniciais
            } catch (error) {
                console.error("Erro ao carregar os dados:", error);
                cardContainer.innerHTML = `<p class="no-results">Oops! Algo deu errado ao buscar nossos gatinhos. Tente recarregar a página. 🐾</p>`;
            }
        }

        function populateFilters(gatos) {
            const generos = [...new Set(gatos.map(g => g.genero))];
            const cores = [...new Set(gatos.map(g => g.cor))];

            generos.forEach(genero => genderFilter.innerHTML += `<option value="${genero}">${genero}</option>`);
            cores.forEach(cor => colorFilter.innerHTML += `<option value="${cor}">${cor}</option>`);
        }

        // --- Lógica do carregamento ---
        function applyFilters() {
            showLoading(true);

            setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                const selectedGender = genderFilter.value;
                const selectedColor = colorFilter.value;

                const filteredCats = allCats.filter(gato => {
                    const matchesName = gato.nome.toLowerCase().includes(searchTerm);
                    const matchesGender = !selectedGender || gato.genero === selectedGender;
                    const matchesColor = !selectedColor || gato.cor === selectedColor;
                    return matchesName && matchesGender && matchesColor;
                });

                renderCards(filteredCats);
                showLoading(false);
            }, 1000); 
        }

        function renderCards(gatinhos) {
            cardContainer.innerHTML = "";
            if (gatinhos.length === 0) {
                cardContainer.innerHTML = `<p class="no-results">Nenhum gatinho encontrado com esses critérios. 😿</p>`;
                return;
            }
            for (const gatinho of gatinhos) {
                const article = document.createElement("article");
                article.classList.add("card");
                article.innerHTML = `
                    <img src="${gatinho.imagem}" alt="Foto de ${gatinho.nome}" class="card-image" loading="lazy">
                    <h2>${gatinho.nome}</h2>
                    <p>${gatinho.descricao}</p>
                    <a href="detalhes.html?nome=${encodeURIComponent(gatinho.nome)}" class="card-link">Conheça ${gatinho.nome}</a>
                `;
                cardContainer.appendChild(article);
            }
        }

        searchInput.addEventListener("input", applyFilters);
        genderFilter.addEventListener("change", applyFilters);
        colorFilter.addEventListener("change", applyFilters);
        clearFiltersBtn.addEventListener("click", () => {
            searchInput.value = "";
            genderFilter.value = "";
            colorFilter.value = "";
            applyFilters();
        });

        carregarDados();
    }

    // --- Lógica para a página de detalhes (detalhes.html) ---
    if (document.getElementById("gatinho-content")) {
        const params = new URLSearchParams(window.location.search);
        const nomeGatinho = params.get('nome');
        const gatinhoContent = document.getElementById('gatinho-content');

        if (!nomeGatinho || !gatinhoContent) {
            gatinhoContent.innerHTML = "<p>Gatinho não encontrado!</p>";
            return;
        }

        const resposta = await fetch('data.json');
        const dados = await resposta.json();
        const gatinho = dados.find(g => g.nome === nomeGatinho);

        if (gatinho) {
            document.title = `${gatinho.nome} - Gatinhos Lovers`;
            gatinhoContent.innerHTML = `
                <img src="${gatinho.imagem}" alt="Foto de ${gatinho.nome}" class="detalhe-image">
                <h2>${gatinho.nome}</h2>
                <div class="info-grid">
                        <p><strong>Gênero:</strong> ${gatinho.genero}</p>
                        <p><strong>Cor:</strong> ${gatinho.cor}</p>
                        <p><strong>Personalidade:</strong> ${gatinho.personalidade}</p>
                        <p><strong>Curiosidade:</strong> ${gatinho.curiosidade}</p>
                    </div>
                    <h3>Um pouco sobre mim...</h3>
                    <p>${gatinho.descricao}</p>
                    <h3>Minha história</h3>
                    <p>${gatinho.historia}</p>
                <a href="https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20em%20adotar%20o(a)%20${gatinho.nome}!" target="_blank" class="adopt-button">Quero adotar!</a>
            `;
        } else {
            gatinhoContent.innerHTML = "<p>Gatinho não encontrado!</p>";
        }
    }

    // --- Lógica do botão "Voltar ao Topo" (para ambas as páginas) ---
    const backToTopButton = document.getElementById("back-to-top");

    const handleScroll = () => {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
            backToTopButton.style.transform = 'translateY(0)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
            backToTopButton.style.transform = 'translateY(20px)';
        }
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', handleScroll);
});
