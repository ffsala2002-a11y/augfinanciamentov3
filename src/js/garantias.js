// garantias.js
export function calcularGarantiaTotal(carrinho) {
  const garantias = JSON.parse(localStorage.getItem("garantias") || "[]");
  let total = 0;

  carrinho.forEach(p => {
    const g = garantias.find(k => k.nce === p.nce);
    if (!g) return;

    if (p.garantia === 1) total += (g.g1 || 0) * p.quantidade;
    if (p.garantia === 2) total += (g.g2 || 0) * p.quantidade;
  });

  return total;
}
