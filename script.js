var leitorDeCSV = new FileReader();
var Cartas = new Map();
var CartaAtual = null;
var vistas = [];
var Times = [];
var TimeAtual = 0;
var UltimoJogar = 0;

function Carta( data ){
    this.descricao = data.shift().trim();
    this.categoria = data.pop().trim();
    this.dicas = data;
}
function Time(nome){
    this.pontos = 0;
    this.nome = nome;
}

function LeCSV( file ){
    const CSV = document.getElementById('csv');
    
    leitorDeCSV.readAsText(file);

    leitorDeCSV.onload = function(e){
        var db =  leitorDeCSV.result.split('\n');
        
        db.shift();

        db.map((data)=>{
            
            var aux = data.replace(/"/g,"");
            aux = aux.split(',')
            aux.shift();

            aux2 = new Carta(aux);

            Cartas.set(Cartas.size,aux2);
        })
    }
    entrada = document.getElementById('nmTime');
    entrada.remove();
    CSV.remove();
}

function pCarta(){
    // Confere se chegou ao fim
    if(Cartas.size === 0){
        Fim();
        return;
    }

    var alvo = document.getElementById(Times[TimeAtual].nome);
    alvo.style.setProperty('background-color', 'rgb(231,231,231)' ) ;

    TimeAtual = UltimoJogar++;

    if(UltimoJogar>=Times.length){
        UltimoJogar = 0;
    }

    TrocaTime();

    // Inicializando Contadores
    vistas = [];
    console.log(vistas);
    var div = document.getElementById('Carta');
    var chave = null;
    var i = 0;
    var r = Math.floor(Math.random() * Cartas.size);

    // Selecionando elementos
    var titulo = document.getElementById('Palavra');
    var categoria = document.getElementById('Categoria');
    var dicas = document.getElementById('Dicas');

    // Ocultando a Palavra
    titulo.style.setProperty('filter', 'blur(80px)');

    // Sorteando carta
    for (var key of Cartas.keys()) {
        if (i++ === r) {
            chave =  key;
        }
    }

    // Selecionando carta
    var carta = Cartas.get(chave);
    CartaAtual = carta;

    // Resetando Dicas
    dicas.remove();
    dicas = document.createElement('ul');
    dicas.id = 'Dicas';
    dicas.className = 'Dicas';

    titulo.innerHTML = carta.descricao;
    categoria.innerHTML = "Diga aos jogadores que sou da categoria\n" + carta.categoria;
    
    titulo.addEventListener('click',revelaPalavra);
    
    var i = 0;
    for (var dica of carta.dicas){
        var item = document.createElement('li');
        item.id = i++;
        item.appendChild(document.createTextNode("DICA " + i));
        item.addEventListener('click', (id)=>{verDica(id.target)});
        dicas.appendChild(item);
    }

    div.appendChild(dicas);
    const lista = document.querySelector('li');

    // Eliminando Carta selecionada da pilhar
    Cartas.delete(chave);
    window.history.pushState("", "Title", CartaAtual.descricao);
}

function revelaPalavra(){
    var titulo = document.getElementById('Palavra');
    titulo.style.setProperty('filter', 'blur(0)');
    addPonto();
}

function verDica( dica ){
    var status = document.getElementById('DicaAtual');
    if(!vistas.includes(dica.id)){
        vistas.push(dica.id);
        TrocaTime();
    }
    console.log(vistas);
    dica.innerHTML = CartaAtual.dicas[dica.id];
    status.innerHTML = CartaAtual.dicas[dica.id];

}

function addTime(e){
    if(e.key === "Enter"){
        nome = document.getElementById('nmTime');
        var time = new Time(nome.value);
        Times.push(time);

        var Tabuleiro = document.getElementById('Tabuleiro');
        var div = document.createElement('div');
        var nome = document.createElement('h1');
        var label = document.createElement('h2');
        var pontuação = document.createElement('h3');

        nome.innerHTML = time.nome;
        label.innerHTML = "Pontuação:";
        pontuação.innerHTML = "0"; 
        pontuação.id = time.nome;

        div.className = 'Time';
        pontuação.addEventListener('wheel', (e)=>{rmPonto(e.target.id)});
        div.appendChild(nome);
        div.appendChild(label);
        div.appendChild(pontuação);

        Tabuleiro.appendChild(div);
    }

}

function addPonto(){
    console.log(Times[TimeAtual].pontos);
    Times[TimeAtual].pontos += 11 - vistas.length ;
    console.log(Times[TimeAtual].pontos);
    var alvo = document.getElementById(Times[TimeAtual].nome);
    alvo.innerHTML = Times[TimeAtual].pontos;
    
}

function rmPonto( nome ){
    for(var i = 0 ; i< Times.length;i++){
        if(Times[i].nome === nome){
            Times[i].pontos -= 1 ;
            var alvo = document.getElementById(nome);
            alvo.innerHTML = Times[i].pontos;
        }
    }
    
}

function TrocaTime(){
    var alvo = document.getElementById(Times[TimeAtual].nome);
    alvo.style.setProperty('background-color', 'rgb(231,231,231)' ) ;

    if(++TimeAtual >= Times.length){
        TimeAtual = 0;
    }
    
    var alvo = document.getElementById(Times[TimeAtual].nome);
    alvo.style.setProperty('background-color', 'rgb(255,104,93)');
    
}

function Fim(){
    var titulo = document.getElementById('Palavra');
    var categoria = document.getElementById('Categoria');
    var dicas = document.getElementById('Dicas');
    var bt = document.getElementById('btPCarta');
    bt.remove();
    categoria.remove();
    dicas.remove();
    titulo.innerHTML = "Acabou!";
    titulo.style.setProperty('filter', 'blur(0)');
}
