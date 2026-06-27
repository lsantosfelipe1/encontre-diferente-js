/*
    pegar o nome do jogador ao clicar no botao jogar agora -
    esconder a tela inicial e mostrar a tela do jogo -
    atualizar o nome na tela do jogo -
    criar o grid com js -
    aumentar o tamanho do grid de acordo com a rodada
    sortear uma posição diferente e colocar um emoji diferente nessa posicao - 
    trocar os emojis a cada rodada
    verificar o clique do jogador 
    atualizar pontos, vidas e rodada: com novo grid
    mostrar a tela final quando o jogo acabar com os dados do jogador
*/

// passar os objetos html para o js
// telas
const paginaInicial = document.getElementById("paginaInicial");
const paginaJogo = document.getElementById("paginaJogo");
const paginaFinal = document.getElementById("paginaFinal");

//outros campos
const input = document.getElementById("input");
const btnJogar = document.getElementById("btnJogar");
const nome = document.getElementById("nomeJogador");
const grid = document.getElementById("gridJogo");

//criei a funcao para iniciar o jogo: pegar o nome do jogador, esconder e mostrar as telas
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
    //grid 4x4
    const cardTotal = 16;
    const posicaoDiferente = Math.floor(Math.random() * cardTotal);

    for (let i = 0; i < cardTotal; i++) {
        const card = document.createElement("button");

        //colocando o conteudo nos botoes, se o indice for igual ao numero sorteado o emoji sera diferente dos outros
        if (i === posicaoDiferente) card.textContent = "🍔";
        else card.textContent = "🍕";
        card.classList.add("cardGrid");

        //inserindo dentro do grid
        grid.appendChild(card);
    }
}

//listener para o botao de iniciar o jogo
btnJogar.addEventListener("click", iniciarJogo);
