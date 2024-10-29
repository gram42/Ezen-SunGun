(()=>{

    const $inputDate = document.querySelector('#inputDate'); // 날짜 선택 달력
    const userid = document.querySelectorAll('.record')[0].getAttribute('userid'); // 유저 아이디
    const checkbox = document.querySelectorAll('.checkbox'); // 체크박스
    const $editBtn = document.querySelectorAll('.editBtn'); // 수정 버튼
    const $submitButton = document.querySelectorAll('.submitButton'); // 완료 버튼

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
                    category_color();
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
                    category_color();
                })
                .catch(error => {
                    alert(error.message);
                });
            }

        });
    });


    // 완료 버튼 클릭 시 카테고리별 본문 내용 저장
    $submitButton.forEach(button => {

        button.addEventListener('click', (event) => {
            event.preventDefault();
    
            const parent = button.closest('.record'); // 붙어있는 부모요소 찾기
            const checkbox = parent.querySelector('.checkbox'); // 붙어있는 체크박스 가져오기
            const $categoryId = checkbox.getAttribute('id');
            const $content = parent.querySelector('textarea');

            if ($content.value.length > 500){
                alert("기록 내용은 500자를 넘을 수 없습니다.");
                $content.focus();
                return
            }
    
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
            .then(() => {
                // 저장 후 수정버튼 누르기 이전 상태로 복구

                button.style.display = 'none';
                
                parent.querySelector('.editBtn').style.display = 'block';
                $content.setAttribute('readonly', true);
            })
            .catch(error => {
                alert(error.message);
            });
        });
    });

    // 수정버튼 클릭 시 텍스트 창 수정 가능 + 완료버튼 등장
    $editBtn.forEach(button => {
        button.addEventListener('click', (event)=>{
            event.preventDefault();

            const parent = button.parentElement;

            parent.parentElement.querySelector('textarea').removeAttribute('readonly');
            parent.parentElement.querySelector('textarea').focus();

            parent.querySelector('.editBtn').style.display = 'none';

            const siblingBtn = parent.querySelector('.submitButton');
            siblingBtn.style.display = 'block';

        });
    });

    // 체크된 부분만 본문 출력
    const content_visible = function(){

        checkbox.forEach(checkbox=>{

            const recordDiv = checkbox.parentElement;

            if (checkbox.checked){
                recordDiv.querySelector('.record-content').style.display = 'block';
            }
            else {
                recordDiv.querySelector('.record-content').style.display = 'none';
            }
        });   
    }
    
    // 체크 여부에 따라 색상 변경
    const category_color = function(){
        
        checkbox.forEach(checkbox=>{
            
            const recordDiv = checkbox.parentElement.parentElement;
            
            if (checkbox.checked){
                recordDiv.querySelector('.checkboxLabel').style.backgroundColor = 'black';
            }
            else {
                recordDiv.querySelector('.checkboxLabel').style.backgroundColor = '#ff9900';
            }
        });   
    }
    
    
    
    content_visible();
    category_color();

})();
