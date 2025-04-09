document.addEventListener("DOMContentLoaded", () => {
    const tituloInput = document.getElementById("titulo");
    const artistaInput = document.getElementById("artista");
    const generoInput = document.getElementById("genero");
    const linkInput = document.getElementById("link");
    const adicionarBtn = document.getElementById("adicionarBtn");
    const listaMusicas = document.getElementById("listaMusicas");

    async function buscarMusicas() {
        const resposta = await fetch("/musicas");
        const musicas = await resposta.json();

        listaMusicas.innerHTML = "";

        musicas.forEach(musica => {
            const li = document.createElement("li");

            const tituloElement = document.createElement("strong");
            if (musica.link) {
                const link = document.createElement("a");
                link.href = musica.link;
                link.target = "_blank";
                link.textContent = musica.titulo;
                link.style.color = "#1DB954";
                link.style.textDecoration = "none";
                link.style.fontWeight = "bold";
                tituloElement.appendChild(link);
            } else {
                tituloElement.textContent = musica.titulo;
            }

            li.appendChild(tituloElement);
            li.innerHTML += ` - ${musica.artista} [${musica.genero}]`;

            const removerBtn = document.createElement("button");
            removerBtn.textContent = "Remover";
            removerBtn.className = "remover-btn";

            removerBtn.addEventListener("click", async () => {
                await fetch(`/musicas/${musica.id}`, {
                    method: "DELETE"
                });
                buscarMusicas();
            });

            li.appendChild(removerBtn);
            listaMusicas.appendChild(li);
        });
    }

    adicionarBtn.addEventListener("click", async () => {
        const novaMusica = {
            id: Date.now(),
            titulo: tituloInput.value,
            artista: artistaInput.value,
            genero: generoInput.value,
            link: linkInput.value
        };

        const resposta = await fetch("/musicas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaMusica)
        });

        if (resposta.ok) {
            tituloInput.value = "";
            artistaInput.value = "";
            generoInput.value = "";
            linkInput.value = "";
            buscarMusicas();
        } else {
            alert("Erro ao adicionar música.");
        }
    });

    buscarMusicas();
})
// Função para exibir a notificação
function exibirNotificacao(mensagem) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = mensagem;

    // Adiciona a notificação na tela
    document.body.appendChild(toast);

    // Exibe a notificação
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    // Esconde a notificação após 3 segundos
    setTimeout(() => {
        toast.classList.remove("show");
        // Remove a notificação do DOM depois de 4 segundos
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}
adicionarBtn.addEventListener("click", async () => {
    const novaMusica = {
        id: Date.now(),
        titulo: tituloInput.value,
        artista: artistaInput.value,
        genero: generoInput.value,
        link: linkInput.value
    };

    const resposta = await fetch("/musicas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaMusica)
    });

    if (resposta.ok) {
        tituloInput.value = "";
        artistaInput.value = "";
        generoInput.value = "";
        linkInput.value = "";
        buscarMusicas();
        exibirNotificacao("Música adicionada com sucesso!");
    } else {
        alert("Erro ao adicionar música.");
    }
});
removerBtn.addEventListener("click", async () => {
    await fetch(`/musicas/${musica.id}`, {
        method: "DELETE"
    });
    buscarMusicas();
    exibirNotificacao("Música removida com sucesso!");
});
