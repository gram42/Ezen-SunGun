(()=>{
    const $startDate = document.querySelector('#inputStartDate');
    const $endDate = document.querySelector('#inputEndDate');

    // 제출 전 날짜 검사
    document.querySelector('#submitAchievementGoal').addEventListener('submit',(submit)=>{

        submit.preventDefault();

        const startDate = $startDate.value;
        const endDate = $endDate.value;

        if (startDate > endDate){
            document.querySelector('#dateError').style.display = 'block';
            return
        }
        submit.target.submit();
    });

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------
    const currPg = document.querySelector('#currPg');
    const totalPg = document.querySelector('#totalPg');
    const startPg = document.querySelector('#startPg');
    const endPg = document.querySelector('#endPg');
    const currSection = document.querySelector('#currSection');
    const $prevSectionBtn = document.querySelector('#prevSection');
    const $prevBtn = document.querySelector('#prev');    
    const $nextBtn = document.querySelector('#next');
    const $nextSectionBtn = document.querySelector('#nextSection');
    
    const currPgNum = parseInt(currPg.value, 10);
    const totalPgNum = parseInt(totalPg.value, 10);
    const startPgNum = parseInt(startPg.value, 10);
    const endPgNum = parseInt(endPg.value, 10);
    const currSectionNum = parseInt(currSection.value, 10);

    console.log((totalPgNum - 1)/5);


    $prevBtn.addEventListener('click',()=>{
        location.href="/achievementRate?p=" + (currPgNum - 1);
    });

    $nextBtn.addEventListener('click',()=>{
        location.href="/achievementRate?p=" + (currPgNum + 1);
    });


    $prevSectionBtn.addEventListener('click',()=>{
        if (currSectionNum === 0){
            location.href="/achievementRate?p=1";
            return
        }
        location.href="/achievementRate?p=" + (startPgNum - 1);
    });
  
    $nextSectionBtn.addEventListener('click',()=>{
        const totalSection = Math.floor((totalPgNum - 1) / 5);
        if (currSectionNum === totalSection){
            location.href="/achievementRate?p=" + endPgNum;
            return
        }
        location.href="/achievementRate?p=" + (endPgNum + 1);
    });


    if (currPgNum === 1){
        $prevBtn.style.display = 'none';
        $prevSectionBtn.style.display = 'none';
    }

    if (currPgNum === totalPgNum){
        $nextBtn.style.display = 'none';
        $nextSectionBtn.style.display = 'none';
    }
})();