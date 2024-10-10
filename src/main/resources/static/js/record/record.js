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

    

    // 체크박스 체크시 포인트 1 증가
    checkbox.forEach(checkbox=>{
        // 포인트별 체크박스 활성화
        if (checkbox.getAttribute('point') === '1'){
            checkbox.checked = true;
        }
        checkbox.addEventListener('change', (event)=>{
            event.preventDefault();

            const categoryId = event.target.getAttribute('id');
            

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
                .then(message => {
                    console.log(message);
                    content_visible();
                })
                .catch(error => {
                    alert("저장에 실패했습니다.");
                });

            } else {

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
                .then((message)=>{return message.text()})
                .then(message => {
                    console.log(message);
                    content_visible();
                })
                .catch(error => {
                    alert("저장에 실패했습니다.");
                });
            }

        });
    });


    // 카테고리별 본문 내용 저장
    document.querySelectorAll('.submitButton').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
    
            const recordDiv = button.closest('.record'); // 붙어있는 부모요소 찾기
            const checkbox = recordDiv.querySelector('.checkbox'); // 붙어있는 체크박스 가져오기
            const $categoryId = checkbox.getAttribute('id');
            const $content = recordDiv.querySelector('textarea');

            if ($content.value.length > 500){
                alert("기록 내용은 500자를 넘을 수 없습니다.");
                return
            }
    
            // Fetch로 데이터 전송
            fetch('/record/content', {
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
            .then(message => {console.log(message)})
            .catch(error => {
                alert("저장에 실패했습니다.");
            });
        });
    });

    // 체크된 부분만 본문 출력
    const content_visible = function(){
        checkbox.forEach(checkbox=>{
            const recordDiv = checkbox.parentElement;
            if (checkbox.checked){
                recordDiv.querySelector('.body').style.display = 'block';
            }
            else {
                recordDiv.querySelector('.body').style.display = 'none';
            }
        });   
    }
    content_visible();

    

})();
