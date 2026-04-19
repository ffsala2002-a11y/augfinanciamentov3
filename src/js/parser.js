import { parsePrecoSeguro } from './util.js';

export function parseProdutos(txt) {
  
  const linhas = txt.split("\n");
  
  const produtos = [];
  
  let grupoAtual = "";
  
  for (let linha of linhas) {
    
    if (!linha.trim().startsWith("*")) continue;
    
    
    
    try {
      
      // colunas por posição fixa
      
      const grupo = linha.substring(3, 5).trim() || grupoAtual;
      
      const nce = linha.substring(6, 12).trim();
      
      const cor = linha.substring(18, 38).trim();
      
      const descricaoBruta = linha.substring(39, 90).trim();
      
      const valores = extrairValoresFinais(linha);
      
      console.log("SALDO:", valores.saldo, "PRECO:", valores.preco);
      
      const saldo = valores.saldo;
      
      const preco = valores.preco;
      
      
      
      if (grupo) grupoAtual = grupo;
      
      
      
      produtos.push({
        
        descricao: limparDescricao(descricaoBruta),
        
        nce,
        
        grupo: grupoAtual,
        
        cor,
        
        saldo: Number(saldo) || 0,
        
        preco: Number(preco) || 0
        
      });
      
      
      
    } catch (err) {
      
      console.log("Erro parse linha:", linha);
      
    }
    
  }
  
  return produtos;
  
}

function extrairValoresFinais(linha) {
  if (!linha) return { saldo: 0, preco: 0 };

  // aceita milhar com ponto OU vírgula, mas exige 2 casas decimais no final
  const matches = linha.match(/\d+(?:[.,]\d{3})*\.\d{2}\b/g);

  if (!matches || matches.length < 2) {
    return { saldo: 0, preco: 0 };
  }

  // 🔹 saldo = primeiro valor monetário (2 casas)
  const saldo = parseFloat(matches[0]) || 0;

  // 🔹 preço = último valor monetário
  const precoBruto = matches[matches.length - 1];

  // remove vírgula ou ponto de milhar
  const precoLimpo = precoBruto.replace(/[.,](?=\d{3}\.)/g, "");

  const preco = Number(precoLimpo) || 0;

  return { saldo, preco };
}

function limparDescricao(desc) {
  
  if (!desc) return "";
  
  return desc
    
    // remove cubagem/medidas
    
    .replace(/\d+(\,\d+)?\s?(L|ML|KG|GR|W|V)/gi, "")
    
    .replace(/\s{2,}/g, " ")
    
    .trim();
  
}

export function parseGarantias(txt) {
  
  return txt
    
    .split(/\r?\n/)
    
    .map(l => {
      
      
      
      const nceMatch = l.match(/\b(\d{4,})\b/);
      
      if (!nceMatch) return null;
      
      
      
      const valores = [...l.matchAll(/(\d+[.,]\d{2})/g)]
        
        .map(v => parsePrecoSeguro(v[1]));
      
      
      
      if (valores.length === 0) return null;
      
      
      
      return {
        
        nce: nceMatch[1].trim(),
        
        g1: valores[0] || 0,
        
        g2: valores[1] || 0
        
      };
      
      
      
    })
    
    .filter(Boolean);
  
}