(()=>{
    const $startDate = document.querySelector('#inputStartDate');
    const $endDate = document.querySelector('#inputEndDate');
    document.querySelector('#submitAchievementGoal').addEventListener('submit',(submit)=>{

        console.log('이벤트리스너가 작동하긴 함?');
        submit.preventDefault();
        console.log('기본 작동 막음');

        const startDate = $startDate.value;
        const endDate = $endDate.value;

        console.log(startDate);
        console.log(endDate);

        if (startDate > endDate){
            document.querySelector('#dateError').style.display = 'block';
            return
        }
        submit.target.submit();

    });

})();