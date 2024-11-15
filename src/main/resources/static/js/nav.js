(()=>{

    const personalMenuBtn = document.querySelector('#personalMenuBtn');
    const personalMenu = document.querySelector('.personalMenu');

    personalMenuBtn.addEventListener('click',(event) => {
        event.preventDefault();
    })

    personalMenuBtn.addEventListener('mouseover', () => {
        personalMenu.classList.add('show');
    });

    personalMenu.addEventListener('mouseover', () => {
        personalMenu.classList.add('show');
    });

    personalMenuBtn.addEventListener('mouseout', () => {
        personalMenu.classList.remove('show');
    });

    personalMenu.addEventListener('mouseout', () => {
        personalMenu.classList.remove('show');
    });

})();
