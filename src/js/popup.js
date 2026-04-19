export function popupMobile() {
  document.addEventListener("DOMContentLoaded", () => {
  
  const popup = document.getElementById("popup");
  const closeBtn = document.querySelector(".close");
  const toast = document.getElementById("toast");
  const som = document.getElementById("som");
  
  // DARK MODE automático
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark");
  }
  
  // Abre 1 vez por dia
  function abrirPopup() {
    const hoje = new Date().toLocaleDateString();
    const ultima = localStorage.getItem("popupData");
    
    if (ultima !== hoje) {
      setTimeout(() => {
        popup.classList.add("show");
      }, 2000);
    }
  }
  
  // Fechar popup
  function fecharPopup() {
    popup.classList.remove("show");
    
    const hoje = new Date().toLocaleDateString();
    localStorage.setItem("popupData", hoje);
    
    som.play().catch(() => {});
    mostrarToast();
  }
  
  // Toast
  function mostrarToast() {
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
  
  // evento
  closeBtn.addEventListener("click", fecharPopup);
  
  abrirPopup();
});
}
