function mudarRota(rotaId, botao) {
      // Remove 'active' das páginas
      document.querySelectorAll('.rota').forEach(p => p.classList.remove('active'));
      // Mostra a página selecionada
      document.getElementById(rotaId).classList.add('active');

      // Remove 'active' dos botões
      document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
      // Ativa o botão clicado
      botao.classList.add('active');
    }