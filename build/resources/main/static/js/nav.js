(()=>{

    document.querySelector('#personalMenuBtn').addEventListener('click', (event) => {
        event.preventDefault();

        const personalMenu = document.querySelector('.personalMenu');

        if (personalMenu.style.display === 'flex') {

                personalMenu.style.display = 'none';
                
            } else {

                personalMenu.style.display = 'flex';

            }

    });

})();
