(()=>{

    const personalMenuBtn = document.querySelector('#personalMenuBtn');
    const personalMenu = document.querySelector('.personalMenu');

    personalMenuBtn.addEventListener('click',(event) => {
        event.preventDefault();
    })

    personalMenuBtn.addEventListener('mouseover', () => {
        personalMenu.style.display = 'flex';
    });

    personalMenu.addEventListener('mouseover', () => {
        personalMenu.style.display = 'flex';
    });

    personalMenuBtn.addEventListener('mouseout', () => {
        personalMenu.style.display = 'none';
    });

    personalMenu.addEventListener('mouseout', () => {
        personalMenu.style.display = 'none';
    });

})();
