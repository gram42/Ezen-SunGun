(()=>{

    const $inputDate = document.querySelector('#inputDate'); // 날짜 선택 달력
    const userid = document.querySelectorAll('.record')[0].getAttribute('userid'); // 유저 아이디
    const checkbox = document.querySelectorAll('.checkbox'); // 체크박스
    const $submitButton = document.querySelector('.submitButton'); // 완료 버튼

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

            const categoryId = checkbox.getAttribute('id').split('-')[1].trim();
            
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
                .catch(error => {
                    alert(error.message);
                });
            }

        });
    });


    // 완료 버튼 클릭 시 카테고리별 본문 내용 저장
    $submitButton.addEventListener('click', (event) => {
        event.preventDefault();

        const recordsList = [];
        let lengthChk = true;

        document.querySelectorAll('.record').forEach(record => {
            const userId = record.getAttribute('userid');
            const categoryId = record.querySelector('.checkbox').getAttribute('id').split('-')[1].trim();
            const inputContent = record.querySelector('.recordContent');
            const content = inputContent.value;
    
            // 내용 길이 확인
            if (content.length > 500) {
                alert("기록 내용은 500자를 넘을 수 없습니다.");
                inputContent.focus();
                lengthChk = false;
                return;
            } else{
                // recordsData 배열에 각 기록 데이터 추가
                recordsList.push({
                    compositeId: {
                        userid: userId,
                        categoryId: categoryId,
                        recordedDate: $inputDate.value
                    },
                    content: content
                });
            }
        });
        
        if(lengthChk){
            fetch('/record/saveContent', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(recordsList)
            })
            .then(response=>{return response.json()})
            .then(res=>{
                if (res){
                    alert('저장이 완료되었습니다')
                    location.reload();
                }
            })
            .catch(error => {
                alert(error.message);
            });
        }
    });

})();
