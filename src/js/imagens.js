export async function iniciarBancoImagens() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/ffsala2002-a11y/produtos-imagens/refs/heads/main/data/imagens.json");
    if (!res.ok) throw new Error("Erro ao carregar JSON de imagens do GitHub");
    
    const imagensPadrao = await res.json();
    localStorage.setItem("imagens", JSON.stringify(imagensPadrao));
    
    return imagensPadrao;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function pegarImagens(nce) {
  let banco = JSON.parse(localStorage.getItem("imagens")) || {};
  
  if (!banco[nce]) {
    banco = await iniciarBancoImagens();
  }
  
  let imagens = banco[nce] || [];
  
  imagens = imagens.filter(img => img && img !== "null" && img.trim() !== "");
  
  if (!imagens.length) {
    return [
      "https://raw.githubusercontent.com/ffsala2002-a11y/produtos-imagens/main/img-produtos/sem_img.png"
    ];
  }
  
  return imagens.slice(0, 4);
}