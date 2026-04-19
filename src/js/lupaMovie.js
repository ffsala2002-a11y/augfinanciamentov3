const campoInput = document.querySelector('.campo-input');
const imgLupa = document.querySelector('.img-lupa');

export function lupaMovie() {

    campoInput.addEventListener('focus', () => {

        imgLupa.classList.add('active');

    });

    campoInput.addEventListener('blur', () => {

        imgLupa.classList.remove('active');

    })

};