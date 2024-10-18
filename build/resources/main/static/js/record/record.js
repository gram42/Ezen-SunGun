(()=>{

    const $inputDate = document.querySelector('#inputDate');
    const userid = document.querySelectorAll('.record')[0].getAttribute('userid');
    const checkbox = document.querySelectorAll('.checkbox')

    $inputDate.max = new Date().toISOString().split("T")[0];

    // 날짜 변환 시 날짜에 맞는 기록 데이터 요청
    $inputDate.addEventListener('change', ()=>{

        const recordedDate = $inputDate.value
        location.href = "/record?date=" + recordedDate;

    });

    

    // 체크박스 체크여부에 따라 포인트 증감
    checkbox.forEach(checkbox=>{

        // 포인트별 체크박스 활성화
        if (checkbox.getAttribute('point') === '1'){
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', (event)=>{
            event.preventDefault();

            const categoryId = event.target.getAttribute('id');
            
            // 체크했을 경우 -> 포인트 1 
            if(checkbox.checked){

                fetch('/record/checkbox',{
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({compositeId:{
                                            userid,
                                            categoryId,
                                            recordedDate:$inputDate.value
                                         },
                                          point:1})

                })
                .then((message)=>{return message.text()})
                .then(() => {
                    content_visible();
                })
                .catch(error => {
                    alert(error.message);
                });

            }
            // 체크 안했을 경우 -> 포인트 0
            else {

                fetch('/record/checkbox',{
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({compositeId:{
                                            userid,
                                            categoryId,
                                            recordedDate:$inputDate.value
                                         },
                                          point:0})

                })
                .then((message)=>{return message.text();})
                .then(() => {
                    content_visible();
                })
                .catch(error => {
                    alert(error.message);
                });
            }

        });
    });


    // 완료 버튼 클릭 시 카테고리별 본문 내용 저장
    document.querySelectorAll('.submitButton').forEach(button => {

        button.addEventListener('click', (event) => {
            event.preventDefault();
    
            const recordDiv = button.closest('.record'); // 붙어있는 부모요소 찾기
            const checkbox = recordDiv.querySelector('.checkbox'); // 붙어있는 체크박스 가져오기
            const $categoryId = checkbox.getAttribute('id');
            const $content = recordDiv.querySelector('textarea');

            if ($content.value.length > 500){ alert("기록 내용은 500자를 넘을 수 없습니다."); return }
    
            fetch('/record/saveContent', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    compositeId: {
                        userid,
                        categoryId: $categoryId,
                        recordedDate: $inputDate.value
                    },
                    content: $content.value
                })
            })
            .then((message)=>{return message.text()})
            .catch(error => {
                alert(error.message);
            });
        });
    });

    // 체크된 부분만 본문 출력
    const content_visible = function(){

        checkbox.forEach(checkbox=>{

            const recordDiv = checkbox.parentElement;

            if (checkbox.checked){
                recordDiv.querySelector('.content').style.display = 'block';
            }
            else {
                recordDiv.querySelector('.content').style.display = 'none';
            }
        });   
    }
    content_visible();

    

})();
