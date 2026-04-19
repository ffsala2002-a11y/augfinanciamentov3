export default function uploadLateral() {



    const btnLateral = document.getElementById('btn-lateral');

    const uploadLateral = document.querySelector('.menu-lateral');

    const fundoAtivo = document.querySelector('.fundo');

    const bottomBar = document.querySelector(".bottom-bar");



    btnLateral.addEventListener('click', () => {



        uploadLateral.classList.toggle('active-lateral');

        fundoAtivo.classList.toggle('active-fundo');

        btnLateral.classList.toggle('active-lateral');

        bottomBar.classList.toggle('active-bar');



    })





    fundoAtivo.addEventListener('click', () => {



        uploadLateral.classList.remove('active-lateral');

        fundoAtivo.classList.remove('active-fundo');

        btnLateral.classList.remove('active-lateral');

        bottomBar.classList.remove('active-bar');



    })

}
