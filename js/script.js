/*
    pegar o nome do jogador ao clicar no botao jogar agora -
    esconder a tela inicial e mostrar a tela do jogo -
    atualizar o nome na tela do jogo -
    criar o grid com js -
    aumentar o tamanho do grid de acordo com a rodada - 
    sortear uma posição diferente e colocar um emoji diferente nessa posicao - 
    trocar os emojis a cada rodada - 
    verificar o clique do jogador - 
    atualizar pontos, vidas e rodada: com novo grid -
    mostrar a tela final quando o jogo acabar com os dados do jogador -
    adicionar tempo a cada rodada-
        comecar a contagem assim que a rodada comeca-
        parar o timer caso o jogador acerte, e comecar a contagem na proxima rodada-
        caso errar o erro é penalizado e o tempo continua -
    adicionar validacao de dados
    entender o que a atividade quer dizer com variaveis soltas
*/

// passar os objetos html para o js
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

// numero de rodadas maximas
const rodadaTotal = 10;
const tempoTotal = 10;

//array de objetos com os emojis para cada rodada, aumentando a dificuldade de acordo com o indice
// usei objeto ao inves de array para  ficar mais facil de entender na chamada do emoji
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

//criei a funcao para iniciar o jogo: pegar o nome do jogador, esconder e mostrar as telas e gerar o grid do jogo
function iniciarJogo() {
    let nomeJogador = input.value;

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

        if (fimJogo()) return;

        gerarGrid();
    } else {
        vidas--;
        pontos -= 50;
        atualizarDados();
        if (fimJogo()) return;
    }
}

//funcao para atualizar os dados em cada rodada
function atualizarDados() {
    pontosJogador.textContent = pontos;
    vidasJogador.textContent = "♥️".repeat(vidas);
    rodadaJogador.textContent = rodadaAtual + "/" + rodadaTotal;
}

//funcao para verificar fim de jogo e mostrar a tela final
function fimJogo() {
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

//funcao para retornar um indice do array de emojis
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
        vidas--;
        pontos -= 50;
        atualizarDados();

        //verifico se o jogo acabou
        if (fimJogo()) return;
        else gerarGrid();
    }
}

// criei essa funcao para parar o tempo quando o jogador acerta ou quando o jogo termina
function pararTempo() {
    clearInterval(contadorInterval);
}

//listener para o botao de iniciar o jogo
btnJogar.addEventListener("click", iniciarJogo);
//listener para o botao de jogar novamente
btnAgain.addEventListener("click", jogarNovamente);
