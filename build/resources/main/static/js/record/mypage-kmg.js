(()=>{

    const ctxWeeks = document.querySelector('#weeksChart');
    const ctxMonths = document.querySelector('#monthsChart');
    const $pointsByWeeks = document.querySelectorAll('.pointsByWeeks');
    const $pointsByMonths =document.querySelectorAll('.pointsByMonths');

    let weeksLabels = [];
    let weeksDataValues = [];
    const monthsDataMap = new Map();
    let maxValue;
    let unit = 2;
    let chartMax = 10;

    // 가져온 주간 포인트 정보를 이름과 값으로 분류, 리스트
    $pointsByWeeks.forEach(info => {

        const categoryName = info.getAttribute('data-key'); 
        const categoryPoint = info.getAttribute('data-value');

        weeksLabels.push(categoryName.trim());
        weeksDataValues.push(parseInt(categoryPoint.trim(), 10));

    });

    // 가져온 월간 데이터 정보를 map 형태로 변환
    $pointsByMonths.forEach(info => {

        const categoryName = info.getAttribute('data-key'); 
        const categoryPoint = info.getAttribute('data-value');

        const pointsArray = JSON.parse(categoryPoint);

        monthsDataMap.set(categoryName, pointsArray)

    });

    // 월간 데이터 map을 차트에 넣을 수 있게 형태 변환
    const chartDataSets = Array.from(monthsDataMap.entries()).map(([categoryName, dataArr]) => ({

        label: categoryName,
        data: dataArr,
        borderWidth: 1

    }));

    console.log(chartDataSets);

    // x축 날짜 레이블
    const getLastMonths = () => {

        let monthNames = [];
        const today = new Date();

        for (let i = 0; i < 6; i++) {

            const monthNumber = (today.getMonth() - i);
            monthNames.push((monthNumber + 1) + "월");

        }
        monthNames.reverse();
        return monthNames;
    };
    
    

    // 차트 사이즈
    const maxChartSize = function() {
    
        maxValue= Math.max(...weeksDataValues);

        if (maxValue > 10){
            if (maxValue > 20) {
                chartMax = 35;
            } else {
                chartMax = 20;
            }
        }
        return chartMax;
    }

    // 차트 단위
    const chartUnit = ()=>{
        const maxSize = maxChartSize();
        if(maxSize >= 20){

            if(maxSize >= 30){
                return unit = 7;
            }
            
            unit = 4;
        }
        return unit;
    }

    // 차트 생성 Chart.js 차트 만들기 활용
    new Chart(ctxWeeks, {
        type: 'radar',
        data: {
            labels: weeksLabels,
            datasets: [{
                label: '5주간 활동내역',
                data: weeksDataValues,
                borderWidth: 1,
                fill: true,
                backgroundColor: 'rgba(255, 165, 0, 0.2)', // 채우기 색
                borderColor: 'rgba(255, 165, 0, 0.7)' // 선 색
            }]
        },
        options: {
            animation: true,
            scales: {
                r: {
                    min: 0,
                    max: maxChartSize(),
                    ticks: {
                        stepSize: chartUnit()
                    },
                    beginAtZero: true,
                    pointLabels: { font: {size: 16} }
                }
            }
        }
    });


  // 월간 데이터 차트
    new Chart(ctxMonths, {
      type: 'line',
      data: {
        labels: getLastMonths(),
        datasets: chartDataSets

      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });




})();