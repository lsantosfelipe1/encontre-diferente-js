// telas
const paginaInicial = document.getElementById("paginaInicial");
const paginaJogo = document.getElementById("paginaJogo");
const paginaFinal = document.getElementById("paginaFinal");

// outros campos
const input = document.getElementById("input");
const btnJogar = document.getElementById("btnJogar");
const nome = document.getElementById("nomeJogador");
const grid = document.getElementById("gridJogo");
const btnAgain = document.getElementById("btnAgain");

//dados da rodada atual do jogador
const vidasJogador = document.getElementById("vidasJogador");
const pontosJogador = document.getElementById("pontosJogador");
const rodadaJogador = document.getElementById("rodadaJogador");
const tempoRestante = document.getElementById("tempoRestante");

// dados para exibicao na tela final
const pontuacaoFinal = document.getElementById("pontuacaoFinal");
const rodadasVencidas = document.getElementById("rodadasVencidas");
const vidasRestantes = document.getElementById("vidasRestantes");
const melhorTempoFinal = document.getElementById("melhorTempo");
const mensagemFinal = document.getElementById("mensagemFinal");

// numero de rodadas maximas
const rodadaTotal = 10;
const tempoTotal = 10;

//array de objetos com os emojis para cada rodada, aumentando a dificuldade de acordo com o indice
const emojiRodada = [
    { padrao: "🍕", diferente: "🍔" },
    { padrao: "🍟", diferente: "🌭" },
    { padrao: "🥐", diferente: "🥨" },
    { padrao: "🥞", diferente: "🧇" },
    { padrao: "🍣", diferente: "🍛" },
    { padrao: "🍧", diferente: "🧁" },
    { padrao: "🥤", diferente: "🥫" },
    { padrao: "🍪", diferente: "🍩" },
    { padrao: "🍗", diferente: "🍖" },
    { padrao: "🍎", diferente: "🍅" },
];

// variaveis para as informacoes de cada rodada
let pontos = 0;
let vidas = 3;
let rodadaAtual = 1;
let contador = 10;
let contadorInterval;
let melhorTempo = null;
let jogador = "";

//criei a funcao para iniciar o jogo: pegar o nome do jogador, esconder e mostrar as telas e gerar o grid do jogo
function iniciarJogo() {
    //usei trim para remover espacos do inicio e final se houver
    let nomeJogador = input.value.trim();

    if (nomeJogador === "") {
        alert("⚠️ Digite seu nome para iniciar!");
        return;
    }
    //atualizei a variavel para exibir o nome na tela final
    jogador = nomeJogador;

    nome.textContent = nomeJogador;

    // usei a propriedade classList para controlar a exibicao das telas
    paginaInicial.classList.add("hidden");
    paginaJogo.classList.remove("hidden");

    gerarGrid();
}

// criei a funcao para gerar o grid, tamanho dinamico e com todos os cards sendo botoes
// para serem clicáveis
function gerarGrid() {
    // usei replaceChildren para limpar o grid, pois a cada rodada os novos cards estavam sendo gerados abaixo dos anteriores
    grid.replaceChildren();

    const tamanho = calcularGrid();
    const cardTotal = tamanho * tamanho;
    const emoji = pegarEmoji();

    // Usei o js para mudar o numero de colunas do grid de acordo com a dificuldade da rodada
    grid.style.gridTemplateColumns = "repeat(" + tamanho + ", 1fr)";

    const posicaoDiferente = Math.floor(Math.random() * cardTotal);

    for (let i = 0; i < cardTotal; i++) {
        const card = criarCard(i, posicaoDiferente, emoji);
        //inserindo dentro do grid
        grid.appendChild(card);
    }
    iniciarTempo();
}

//funcao para criar um card do grid e retorna-lo
function criarCard(indice, posicao, emoji) {
    const card = document.createElement("button");
    let cardCorreto = false;

    //colocando o conteudo nos botoes, se o indice for igual ao numero sorteado o emoji sera diferente dos outros
    if (indice === posicao) {
        cardCorreto = true;
        card.textContent = emoji.diferente;
    } else card.textContent = emoji.padrao;

    card.classList.add("cardGrid");

    // evento de clique em cada botao para verificar se o lanche esta correto ou nao
    card.addEventListener("click", function () {
        verificarClique(cardCorreto);
    });

    return card;
}

// criei uma funcao para verificar o clique do jogador, se foi lanche correto(diferente) ou nao, e atualizar os dados de cada rodada
function verificarClique(cardCorreto) {
    if (cardCorreto) {
        pararTempo();
        atualizarMelhorTempo();

        pontos += 100;
        rodadaAtual++;
        atualizarDados();

        if (verificarFim()) return;

        gerarGrid();
    } else {
        penalizarJogador();

        if (verificarFim()) return;
    }
}

//funcao para penalizar o jogador e evitar da pontuacao ficar negativa (criei outra funcao para nao ficar muito extenso)
function penalizarJogador() {
    vidas--;
    pontos -= 50;

    if (pontos < 0) {
        pontos = 0;
    }

    atualizarDados();
}

//funcao para atualizar os dados em cada rodada
function atualizarDados() {
    pontosJogador.textContent = pontos;
    vidasJogador.textContent = "♥️".repeat(vidas);
    rodadaJogador.textContent = rodadaAtual + "/" + rodadaTotal;
}

//funcao para verificar fim de jogo e mostrar a tela final
function verificarFim() {
    if (rodadaAtual > rodadaTotal) {
        pararTempo();
        atualizarFim();
        paginaJogo.classList.add("hidden");
        paginaFinal.classList.remove("hidden");
        return true;
    }
    if (vidas === 0) {
        pararTempo();
        atualizarFim();
        paginaJogo.classList.add("hidden");
        paginaFinal.classList.remove("hidden");
        return true;
    }

    return false;
}

//funcao para atualizar os dados do jogador na tela final
function atualizarFim() {
    mensagemFinal.textContent = jogador + ", veja seus resultados abaixo!";
    pontuacaoFinal.textContent = pontos;
    rodadasVencidas.textContent = rodadaAtual - 1 + "/" + rodadaTotal;
    vidasRestantes.textContent = "♥️".repeat(vidas);

    if (melhorTempo === null) {
        melhorTempoFinal.textContent = "--";
    } else {
        melhorTempoFinal.textContent = melhorTempo + "s";
    }
}

// funcao para reiniciar os dados e comecar de novo
function jogarNovamente() {
    pontos = 0;
    vidas = 3;
    rodadaAtual = 1;
    melhorTempo = null;

    atualizarDados();

    paginaFinal.classList.add("hidden");

    iniciarJogo();
}

//funcao para definir o tamanho do grid de acordo com a rodada
function calcularGrid() {
    if (rodadaAtual <= 3) return 5;
    else if (rodadaAtual <= 6) return 6;
    else return 7;
}

//funcao para retornar um objeto do array de emojis
function pegarEmoji() {
    return emojiRodada[rodadaAtual - 1];
}

// funcao para atualizar o melhor tempo quando o jogador acerta uma rodada
function atualizarMelhorTempo() {
    const tempoGasto = tempoTotal - contador;

    // atualizo o melhor tempo se ainda nao existir um ou se o novo tempo for menor
    if (melhorTempo === null || tempoGasto < melhorTempo) {
        melhorTempo = tempoGasto;
    }
}

// criei essa funcao para iniciar o tempo de cada rodada e evitar que timers antigos continuem rodando
// usei clearInterval antes de iniciar um novo timer para impedir que mais de um contador rode ao mesmo tempo
function iniciarTempo() {
    clearInterval(contadorInterval);

    contador = tempoTotal;
    tempoRestante.textContent = contador;

    contadorInterval = setInterval(atualizarTempo, 1000);
}

//funcao para atualizar o tempo, penalizar o jogador caso o tempo acabe e gerar novo grid na msm rodada
function atualizarTempo() {
    contador--;
    tempoRestante.textContent = contador;
    //verifico se o contador chegou a 0, se sim o jogador perde uma vida
    if (contador === 0) {
        pararTempo();
        penalizarJogador();

        //verifico se o jogo acabou
        if (verificarFim()) return;
        else gerarGrid();
    }
}

// criei essa funcao para parar o tempo quando o jogador acerta ou quando o jogo termina
function pararTempo() {
    clearInterval(contadorInterval);
}

//listener para o botao de iniciar o jogo
btnJogar.addEventListener("click", iniciarJogo);
//listener para iniciar o jogo ao apertar Enter
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        iniciarJogo();
    }
});
//listener para o botao de jogar novamente
btnAgain.addEventListener("click", jogarNovamente);
