import { carrinho } from './carrinho.js';
import { entradaNumero } from './util.js';
import { calcularGarantiaTotal } from './garantias.js';

export function calcularTotal(entradaStr, parcelas, taxa, arredondar) {
  let entrada = entradaNumero(entradaStr);

  // Total dos produtos no carrinho
  let totalProdutos = 0;
  carrinho.forEach(p => {
    totalProdutos += p.preco * p.quantidade;
  });

  // Total das garantias
  const totalGarantia = calcularGarantiaTotal(carrinho);
  const total = totalProdutos + totalGarantia;

  // Ajuste caso a entrada seja maior que o total
  if (entrada > total) entrada = total;

  const financiado = total - entrada;
  const n = Number(parcelas);
  const i = Number(taxa) / 100;

  // Cálculo da parcela
  const coef =
    i === 0
      ? 1 / n
      : (i * Math.pow(1 + i, n)) /
        (Math.pow(1 + i, n) - 1);

  let valorParcela = financiado * coef;
  if (arredondar) valorParcela = Math.round(valorParcela * 100) / 100;

  const totalComJuros = valorParcela * n;
  const jurosAplicado = totalComJuros - financiado; // 🔥 juros que está sendo aplicado

  return {
    total,
    financiado,
    entrada,
    valorParcela,
    parcelas: n,
    totalComJuros,
    jurosAplicado 
  };
}