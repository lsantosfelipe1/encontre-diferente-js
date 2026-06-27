/*
    pegar o nome do jogador ao clicar no botao jogar agora -
    esconder a tela inicial e mostrar a tela do jogo -
    atualizar o nome na tela do jogo -
    criar o grid com js -
    aumentar o tamanho do grid de acordo com a rodada
    sortear uma posição diferente e colocar um emoji diferente nessa posicao - 
    trocar os emojis a cada rodada
    verificar o clique do jogador - 
    atualizar pontos, vidas e rodada: com novo grid 
    mostrar a tela final quando o jogo acabar com os dados do jogador -
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

// dados para exibicao na tela final
const pontuacaoFinal = document.getElementById("pontuacaoFinal");
const rodadasVencidas = document.getElementById("rodadasVencidas");
const vidasRestantes = document.getElementById("vidasRestantes");

// numero de rodadas maximas
const rodadaTotal = 10;

// variaveis para as informacoes de cada rodada
let pontos = 0;
let vidas = 3;
let rodadaAtual = 1;

//criei a funcao para iniciar o jogo: pegar o nome do jogador, esconder e mostrar as telas e gerar o grid do jogo
function iniciarJogo() {
    let nomeJogador = input.value;

    nome.textContent = nomeJogador;

    // usei a propriedade classList para controlar a exibicao das telas
    paginaInicial.classList.add("hidden");
    paginaJogo.classList.remove("hidden");

    gerarGrid();
}

// criei a funcao para gerar o grid, inicialmente com 16 elementos, 4x4, com todos os cards sendo botoes
// para serem clicáveis
function gerarGrid() {
    // usei replaceChildren para limpar o grid, pois a cada rodada os novos cards estavam sendo gerados abaixo dos anteriores
    grid.replaceChildren();
    //grid 4x4
    const cardTotal = 16;
    const posicaoDiferente = Math.floor(Math.random() * cardTotal);

    for (let i = 0; i < cardTotal; i++) {
        const card = document.createElement("button");
        let cardCorreto = false;

        //colocando o conteudo nos botoes, se o indice for igual ao numero sorteado o emoji sera diferente dos outros
        if (i === posicaoDiferente) {
            cardCorreto = true;
            card.textContent = "🍔";
        } else card.textContent = "🍕";

        card.classList.add("cardGrid");

        // evento de clique em cada botao para verificar se o esta correto ou nao
        card.addEventListener("click", function () {
            verificarClique(cardCorreto);
        });

        //inserindo dentro do grid
        grid.appendChild(card);
    }
}

// criei uma funcao para verificar o clique do jogador, se foi lanche correto(diferente) ou nao, e atualizar os dados de cada rodada
function verificarClique(cardCorreto) {
    if (cardCorreto) {
        pontos += 100;
        rodadaAtual++;
        atualizarDados();

        if (fimJogo()) return;

        gerarGrid();
    } else {
        vidas--;
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
        atualizarFim();
        paginaJogo.classList.add("hidden");
        paginaFinal.classList.remove("hidden");
        return true;
    }
    if (vidas === 0) {
        atualizarFim();
        paginaJogo.classList.add("hidden");
        paginaFinal.classList.remove("hidden");
        return true;
    }
}

//funcao para atualizar os dados do jogador na tela final
function atualizarFim() {
    pontuacaoFinal.textContent = pontos;
    rodadasVencidas.textContent = rodadaAtual - 1 + "/" + rodadaTotal;
    vidasRestantes.textContent = "♥️".repeat(vidas);
}

// funcao para reiniciar os dados e comecar de novo
function jogarNovamente() {
    pontos = 0;
    vidas = 3;
    rodadaAtual = 1;

    atualizarDados();

    paginaFinal.classList.add("hidden");

    iniciarJogo();
}

//listener para o botao de iniciar o jogo
btnJogar.addEventListener("click", iniciarJogo);
//listener para o botao de jogar novamente
btnAgain.addEventListener("click", jogarNovamente);
