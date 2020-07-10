var leitorDeCSV = new FileReader();
var Cartas = new Map();
var CartaAtual = null;
var vistas = [];
var Times = [];

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
    vistas = [];
    var div = document.getElementById('Carta');

    if(Cartas.size === 0){
        var titulo = document.getElementById('Palavra');
        var categoria = document.getElementById('Categoria');
        var dicas = document.getElementById('Dicas');
        var bt = document.getElementById('btPCarta');
        bt.remove();
        categoria.remove();
        dicas.remove();
        titulo.innerHTML = "Acabou!";
        titulo.style.setProperty('filter', 'blur(0)');
        return;
    }

    var titulo = document.getElementById('Palavra');
    titulo.style.setProperty('filter', 'blur(80px)');

    var chave = null;
    var i = 0;
    var r = Math.floor(Math.random() * Cartas.size);

    for (var key of Cartas.keys()) {
        if (i++ === r) {
            chave =  key;
        }
    }

    var carta = Cartas.get(chave);
    CartaAtual = carta;

    var titulo = document.getElementById('Palavra');
    var categoria = document.getElementById('Categoria');

    var dicas = document.getElementById('Dicas');
    dicas.remove();
    
    dicas = document.createElement('ul');
    dicas.id = 'Dicas';
    dicas.className = 'Dicas';

    titulo.innerHTML = carta.descricao;
    categoria.innerHTML = "Diga aos jogadores que sou da categoria\n" + carta.categoria;
    
    titulo.addEventListener('click',(e)=>{
        var titulo = document.getElementById('Palavra');
        titulo.style.setProperty('filter', 'blur(0)');
    })
    
    var i = 0;

    for (var dica of carta.dicas){
        var item = document.createElement('li');
        item.id = i++;
        item.appendChild(document.createTextNode("DICA " + i));
        item.addEventListener('click', (id)=>{verDica(id.target)})
        dicas.appendChild(item);
    }

    div.appendChild(dicas);
    const lista = document.querySelector('li');

    Cartas.delete(chave);
    window.history.pushState("", "Title", CartaAtual.descricao);
}

function verDica( dica ){
    var status = document.getElementById('DicaAtual');
    if(!vistas.includes(dica.id)){
        vistas.push(dica.id);
    }

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
        pontuação.addEventListener('click', (e)=>{addPonto(e.target.id)});
        pontuação.addEventListener('wheel', (e)=>{rmPonto(e.target.id)});
        div.appendChild(nome);
        div.appendChild(label);
        div.appendChild(pontuação);

        Tabuleiro.appendChild(div);
    }

}

function addPonto( nome ){
    
    for(var i = 0 ; i< Times.length;i++){
        console.log(Times[i]);
        if(Times[i].nome === nome){
            Times[i].pontos += 11 - vistas.length ;
            var alvo = document.getElementById(nome);
            console.log(alvo);
            alvo.innerHTML = Times[i].pontos;
        }
    }
    
}
function rmPonto( nome ){
    for(var i = 0 ; i< Times.length;i++){
        console.log(Times[i]);
        if(Times[i].nome === nome){
            Times[i].pontos -= 1 ;
            var alvo = document.getElementById(nome);
            console.log('SEGUNDO');
            alvo.innerHTML = Times[i].pontos;
        }
    }
    
}