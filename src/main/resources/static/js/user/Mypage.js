(()=>{

    const ctxDays = document.querySelector('#daysChart');
    const ctxMonths = document.querySelector('#monthsChart');
    const $pointsByDays = document.querySelectorAll('.pointsByDays');
    const $pointsByMonths = document.querySelectorAll('.pointsByMonths');
    const $viewDays = document.querySelector('#viewDays');
    const $viewMonths = document.querySelector('#viewMonths');
    const $daysChartContainer = document.querySelector('#daysChartContainer');
    const $monthsChartContainer = document.querySelector('#monthsChartContainer');
    const weeksInfo = document.querySelector('#weeks');
    const today = new Date();


    const daysDataMap = new Map();
    const monthsDataMap = new Map();

    // 클릭 여부에 따라 일간, 월간 차트 출력
    // 일간 포인트 null 여부에 따라 다르게 출력
    $viewDays.addEventListener('click', (event) => {
        event.preventDefault();
        chosen($viewDays);
        others($viewMonths)
        if (weeksInfo.getAttribute('data-totalPoint') === null){

            weeksInfo.style.display = 'block';
            $monthsChartContainer.style.display = 'none';
            
        } else {
            
            weeksInfo.style.display = 'block';
            $daysChartContainer.style.display = 'block';
            $monthsChartContainer.style.display = 'none';
            document.querySelector('#weekActivityPoint').style.display = 'block';

        }

    });

    $viewMonths.addEventListener('click', (event) => {
        event.preventDefault();
        chosen($viewMonths);
        others($viewDays)
        weeksInfo.style.display = 'none';
        $monthsChartContainer.style.display = 'block';
        document.querySelector('#weekActivityPoint').style.display = 'none';

    });

    // 가져온 일주간 데이터 정보를 map 형태로 변환
    $pointsByDays.forEach(info => {

        const categoryName = info.getAttribute('data-key'); 
        const categoryPoint = info.getAttribute('data-value');

        const pointsArray = JSON.parse(categoryPoint);

        daysDataMap.set(categoryName, pointsArray)

    });

    
    // 일주간 데이터 map을 차트에 넣을 수 있게 형태 변환
    const chartDataSetsDay = Array.from(daysDataMap.entries()).map(([categoryName, dataArr]) => ({

        label: categoryName,
        data: dataArr,
        borderWidth: 1

    }));

    // 가져온 월간 데이터 정보를 map 형태로 변환
    $pointsByMonths.forEach(info => {

        const categoryName = info.getAttribute('data-key'); 
        const categoryPoint = info.getAttribute('data-value');

        const pointsArray = JSON.parse(categoryPoint);

        monthsDataMap.set(categoryName, pointsArray)

    });

    // 월간 데이터 map을 차트에 넣을 수 있게 형태 변환
    const chartDataSetsMonth = Array.from(monthsDataMap.entries()).map(([categoryName, dataArr]) => ({

        label: categoryName,
        data: dataArr,
        borderWidth: 1

    }));

    // 버튼 디자인 변환
    const chosen = function(button){
        button.classList.add('selected')
    }
    const others = function(button){
        button.classList.remove('selected')
    }


    // x축 날짜 레이블 - day
    const getLastDays = () => {

        let daysNames = [];

        for (let i = 0; i < 7; i++) {

            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - i);

            const month = pastDate.getMonth() + 1;
            const day = pastDate.getDate();
            daysNames.push(`${month}.${day}`);

        }

        daysNames.reverse();

        return daysNames;
    };

    // x축 날짜 레이블 - month
    const getLastMonths = () => {
        let monthNames = [];

        for (let i = 0; i < 12; i++) {
            const monthIndex = (today.getMonth() - i + 12) % 12;
            monthNames.push((monthIndex + 1) + "월");
        }

        monthNames.reverse();

        return monthNames;
    };

    // 차트 생성 Chart.js 차트 만들기 활용
    // 일주간 데이터 차트
    new Chart(ctxDays, {
        type: 'line',
        data: {
        labels: getLastDays(),
        datasets: chartDataSetsDay

        },
        options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
              }
        }
        }
    });



  // 월간 데이터 차트
    new Chart(ctxMonths, {
      type: 'line',
      data: {
        labels: getLastMonths(),
        datasets: chartDataSetsMonth

      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
          }
        }
      }
    });




})();