export function Carta( data ){
    this.descricao = data.shift();
    this.categoria = data.pop();
    this.dicas = data;
}