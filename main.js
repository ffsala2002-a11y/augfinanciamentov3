import { iniciarBancoImagens, pegarImagens } from './src/js/imagens.js';
import { carregarBase, limparBase } from './src/js/base.js';
import { adicionarCarrinho, limparCarrinho, carrinho } from './src/js/carrinho.js';
import { calcularTotal } from './src/js/calculo.js';
import uploadLateral from './src/js/uploadLateral.js';
import { lupaMovie } from './src/js/lupaMovie.js';
import { popupMobile } from './src/js/popup.js';

//  inicia banco de imagens
iniciarBancoImagens();

const fileProdutos = document.getElementById('fileProdutos');
const fileGarantias = document.getElementById('fileGarantias');
const msg = document.getElementById('msg');
const busca = document.getElementById('busca');
const sugestoes = document.getElementById('sugestoes');
const sugestoesBody = document.getElementById('sugestoesBody');
const parcelas = document.getElementById('parcelas');
const taxa = document.getElementById('taxa');
const entrada = document.getElementById('entrada');
const arredondar = document.getElementById('arredondar');
const resultado = document.getElementById('resultado');

//  controle anti duplicação
let buscaAtual = 0;

// ================= ALERTA =================
function mostrarAlerta(msg, tipo = "erro", tempo = 3000) {
  let alerta = document.getElementById("alerta");
  
  if (!alerta) {
    alerta = document.createElement("div");
    alerta.id = "alerta";
    alerta.className = "alerta";
    document.body.appendChild(alerta);
  }
  
  alerta.innerText = msg;
  
  if (tipo === "erro") alerta.style.background = "#f44336";
  else if (tipo === "sucesso") alerta.style.background = "#4CAF50";
  else alerta.style.background = "#0068bd";
  
  void alerta.offsetWidth;
  alerta.classList.add("show");
  
  setTimeout(() => alerta.classList.remove("show"), tempo);
}

// ================= BASE =================
document.getElementById('btnSalvar').addEventListener('click', () => {
  if (!fileProdutos.files[0] || !fileGarantias.files[0]) {
    mostrarAlerta('Você precisa selecionar os dois arquivos.', 'erro');
    return;
  }
  
  carregarBase(fileProdutos.files[0], fileGarantias.files[0], len => {
    mostrarAlerta(`✔ Base carregada (${len} produtos)`, 'sucesso');
    atualizarResumoBase();
  });
});

document.getElementById('btnLimparBase').addEventListener('click', () => {
  limparBase();
  msg.innerText = '';
  limparCarrinho();
  resultado.style = "display:none;";
  mostrarAlerta('Base e carrinho limpos.', 'info');
  
  document.getElementById("totalProdutos").innerText = 0;
  document.getElementById("totalSaldo").innerText = 0;
  document.getElementById("totalGarantias").innerText = 0;
});

// ================= CARRINHO =================
document.getElementById('btnLimparItens').addEventListener('click', () => {
  limparCarrinho();
  resultado.style = "display:none;";
  mostrarAlerta('Carrinho limpo.', 'info');
});

// ================= CALCULAR =================
document.getElementById('btnCalcular').addEventListener('click', () => {
  if (!carrinho.length) {
    mostrarAlerta('Adicione produtos ao carrinho antes de calcular.', 'erro');
    return;
  }
  
  const r = calcularTotal(
    entrada.value,
    parcelas.value,
    taxa.value,
    arredondar.checked
  );
  
  resultado.style.display = 'flex';
  resultado.innerHTML = `
    <p><strong>Total:</strong> <span>${r.total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></p>
    <p><strong>Entrada:</strong> <span>${r.entrada.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></p>
    <p><strong>Financiado:</strong> <span>${r.financiado.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></p>
    <p><strong>Parcelas:</strong> <span>${r.parcelas}x de ${r.valorParcela.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></p>
    <p><strong>Total c/ juros:</strong> <span>${r.totalComJuros.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></p>
    <p><strong>Juros:</strong> <span>${r.jurosAplicado.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></p>
  `;
});

// ================= BUSCA (FINAL CORRIGIDA) =================
busca.addEventListener('input', () => {
  const idBusca = ++buscaAtual;
  
  const q = busca.value.toLowerCase().trim();
  sugestoesBody.innerHTML = '';
  
  if (!q) {
    sugestoes.style.display = 'none';
    return;
  }
  
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  
  const filtrados = produtos
    .filter(p =>
      String(p.nce) === q || // match exato (scanner)
      String(p.nce).includes(q) || //  busca parcial (digitação)
      p.descricao.toLowerCase().includes(q)
    )
    .slice(0, 25);
  
  filtrados.forEach(p => {
    
    if (idBusca !== buscaAtual) return;
    
    const tr = document.createElement('tr');
    
    const placeholder = "https://raw.githubusercontent.com/ffsala2002-a11y/produtos-imagens/main/img-produtos/sem_img.png";
    
    tr.innerHTML = `
      <td>
        <img class="img-sugestao" src="${placeholder}" loading="lazy">
      </td>
      
      <td>${p.nce}</td>
      
      <td>
      <span class="descricao">${p.descricao}</span>
      </td>
      
      <td>
        <span class="preco">${p.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
      </td>
      
      <td>
      <span class="saldo">${p.saldo}</span>
      </td>
    `;
    
    //  carrega imagem sem travar
    pegarImagens(p.nce).then(imgs => {
      if (idBusca !== buscaAtual) return;
      
      const imgEl = tr.querySelector("img");
      if (imgEl) {
        imgEl.src = imgs[0];
        imgEl.onerror = () => imgEl.src = placeholder;
      }
    });
    
    tr.onclick = () => {
      adicionarCarrinho(p);
      busca.value = '';
      sugestoes.style.display = 'none';
      mostrarAlerta('Produto adicionado ao carrinho.', 'sucesso');
    };
    
    sugestoesBody.appendChild(tr);
  });
  
  sugestoes.style.display = 'block';
});

document.getElementById("deleteInput").addEventListener('click', () => {
  busca.value = "";
  busca.focus();
  sugestoes.style.display = 'none';
});

// ================= PARCELAS =================
for (let i = 1; i <= 12; i++) {
  parcelas.innerHTML += `<option value="${i}">${i}x</option>`;
}

// ================= ENTRADA =================
entrada.addEventListener('input', () => {
  let v = entrada.value.replace(/\D/g, '');
  entrada.value = (Number(v) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
});

// ================= RESUMO =================
function atualizarResumoBase() {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  const garantias = JSON.parse(localStorage.getItem("garantias") || "[]");
  
  document.getElementById("totalProdutos").innerText = produtos.length;
  document.getElementById("totalSaldo").innerText =
    produtos.reduce((acc, p) => acc + (Number(p.saldo) || 0), 0);
  document.getElementById("totalGarantias").innerText = garantias.length;
}


// AO CARREGAR O SITE, APAREÇA UM SPINER.
const fundoSpiner = document.getElementById("fundo-spiner");
const videoLoad = document.getElementById("video-load");

window.addEventListener('load', () => {
  fundoSpiner.classList.add("active");
  
  videoLoad.currency = 0;
  videoLoad.muted = true;
  videoLoad.play();
  
  setTimeout(() => {
    fundoSpiner.classList.remove("active")
    
    videoLoad.pause();
    
  }, 1.3 * 1000)
});




////////
//NEW
////////
// ================= ELEMENTOS =================
const btnScan = document.getElementById("btn-scan");
const overlay = document.getElementById("scannerOverlay");
const fecharScanner = document.getElementById("fecharScanner");
const container = document.getElementById("scanner-container");
const contadorEl = document.getElementById("contadorLeitura");
const ultimoProdutoEl = document.getElementById("ultimoProduto");

// ================= ESTADO =================
let stream = null;
let detector = null;
let rodando = false;

let contador = 0;
let ultimoCodigo = null;
let ultimoTempo = 0;

// ================= SOM =================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function beep() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}
// ================= NCE =================
function extrairNCE(codigo) {
  const clean = String(codigo).replace(/\D/g, '');

  if (clean.startsWith("01") && clean.length >= 14) {
    return clean.substring(2, 16).slice(-6);
  }

  return clean.slice(-6);
}

// ================= ABRIR =================
btnScan.addEventListener("click", iniciarScanner);
fecharScanner.addEventListener("click", pararScanner);

// ================= INICIAR =================
async function iniciarScanner() {
  overlay.classList.add("active");

  contador = 0;
  contadorEl.innerText = "0";
  ultimoProdutoEl.innerHTML = "";

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      }
    });

  } catch (err) {
    console.error(err);
    mostrarAlerta("Erro ao acessar câmera", "erro");
    return;
  }

  const video = document.createElement("video");
  video.srcObject = stream;
  video.setAttribute("playsinline", true);
  video.autoplay = true;

  container.innerHTML = "";
  container.appendChild(video);

  await video.play();

  // 🔥 tenta BarcodeDetector
  if ("BarcodeDetector" in window) {
    detector = new BarcodeDetector({
      formats: ["ean_13", "code_128"]
    });

    rodando = true;
    scanLoop(video);

    mostrarAlerta("Scanner ativo (rápido)", "sucesso");

  } else {
    mostrarAlerta("Modo compatível ativado", "info");
    iniciarQuaggaFallback();
  }
}

// ================= LOOP DETECTOR =================
async function scanLoop(video) {
  if (!rodando) return;

  try {
    const barcodes = await detector.detect(video);

    if (barcodes.length) {
      processarCodigo(barcodes[0].rawValue);
    }

  } catch (e) {
    console.warn("Erro detect:", e);
  }

  requestAnimationFrame(() => scanLoop(video));
}

// ================= FALLBACK QUAGGA =================
function iniciarQuaggaFallback() {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: container,
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["ean_reader", "code_128_reader"]
    }
  }, err => {
    if (err) {
      mostrarAlerta("Erro no scanner", "erro");
      return;
    }

    Quagga.start();
  });

  Quagga.onDetected(data => {
    processarCodigo(data.codeResult.code);
  });
}

// ================= PROCESSAR =================
function processarCodigo(codigo) {
  const nce = extrairNCE(codigo);
  const agora = Date.now();

  if (nce === ultimoCodigo && (agora - ultimoTempo) < 2000) return;

  ultimoCodigo = nce;
  ultimoTempo = agora;

  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  const produto = produtos.find(p => String(p.nce) === nce);

  if (produto) {
    adicionarCarrinho(produto);
    beep();

    contador++;
    contadorEl.innerText = contador;

    ultimoProdutoEl.innerHTML = `
      <strong>${produto.descricao}</strong><br>
      <span class="preco-scan">${produto.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
    `;

    mostrarAlerta("✔ Produto adicionado", "sucesso");

  } else {
    mostrarAlerta("Produto não encontrado", "erro");
  }
}

// ================= PARAR =================
function pararScanner() {
  rodando = false;

  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }

  if (typeof Quagga !== "undefined") {
    try {
      Quagga.stop();
      Quagga.offDetected();
    } catch {}
  }

  container.innerHTML = "";
  overlay.classList.remove("active");
}

// ================= INIT =================
uploadLateral();
lupaMovie();
atualizarResumoBase();
popupMobile();
