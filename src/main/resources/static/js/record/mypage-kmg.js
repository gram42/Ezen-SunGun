(()=>{

    const ctx = document.getElementById('myChart');
    const $points = document.querySelectorAll('.points');

    const dataValues = [];
    const labels = [];
    let chartMax = 10;
    let maxValue;
    let unit = 2;

    // 가져온 포인트 정보를 이름과 값으로 분류
    $points.forEach(point => {
        const $Point = point.innerText;
        const [key, value] = $Point.split(' : ');
        
        labels.push(key.trim());
        dataValues.push(parseInt(value.trim(), 10));
    });

    // 차트 사이즈
    const maxChartSize = function() {
    
        maxValue= Math.max(...dataValues);

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
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '5주간 활동내역',
                data: dataValues,
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

})();