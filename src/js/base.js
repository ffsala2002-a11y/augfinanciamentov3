import { parseProdutos, parseGarantias } from './parser.js';



export function carregarBase(fileProdutos, fileGarantias, callback){

  if(!fileProdutos || !fileGarantias) return alert("Envie os dois arquivos");

  

  const r1 = new FileReader();

  r1.onload = e => {

    const prod = parseProdutos(e.target.result);

    localStorage.setItem("produtos", JSON.stringify(prod));



    const r2 = new FileReader();

    r2.onload = ev => {

      localStorage.setItem("garantias", JSON.stringify(parseGarantias(ev.target.result)));

      if(callback) callback(prod.length);

    };

    r2.readAsText(fileGarantias);

  };

  r1.readAsText(fileProdutos);

}



export function limparBase(){
  localStorage.removeItem("produtos");
  localStorage.removeItem("garantias");
}




