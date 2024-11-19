(()=>{

    // 카테고리 10개 이상이면 추가 버튼 안보이게
    const countCategories = function() {
        const categories = document.querySelectorAll('categories-list')
        if (categories.length >= 10){
            document.querySelector('.add-area').style.display = 'none';
        }
    }
    countCategories();

    // 수정 버튼 클릭시 수정 창 등장
    document.querySelectorAll('.editCategories').forEach((button)=>{

        const $categoryDiv = button.parentElement;

        button.addEventListener('click', (event)=>{
            event.preventDefault();

            $categoryDiv.querySelector('.edit').style.display = 'block';
            $categoryDiv.querySelector('.edit').querySelector('.inputEditCategoryName').focus();
            
        });

    });

    // 추가 버튼 클릭 시 추가 창 등장
    document.querySelector('#add').addEventListener('click', (event)=>{
        event.preventDefault();

        document.querySelector('.add').style.display = 'block';
        document.querySelector('#inputAddCategoryName').focus();

    });

    // 추가 완료 버튼 누를 시 중복검사 실행 후 저장, 페이지 새로고침
    document.querySelector('#addSubmitButton').addEventListener('click',(event)=>{
        event.preventDefault();

        const inputAddCategoryName = document.querySelector('#inputAddCategoryName').value;

        if(inputAddCategoryName === null || inputAddCategoryName.trim() === ""){
            alert('내용을 입력해주세요.');
            return;
        } else {
            if(confirm("카테고리는 추가 후 삭제가 불가능합니다. 정말로 추가하시겠습니까?")){

                fetch('/category/overlapCheck', {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({name: inputAddCategoryName})
                })
                .then(response=>{return response.text()})
                .then(message =>{
    
                    if (message === "category exist"){
                        throw new Error('이미 존재하는 카테고리입니다.');
                    }
    
                    return fetch('/category/add', {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({name : inputAddCategoryName})
                    });
                })
                .then(()=>{location.reload();})
                .catch(error=>{
                    alert(error.message);
                })
            } else {
                return;
            }
        }
    });

    // 수정 완료 버튼 누를 시 중복검사 실행 후 저장, 페이지 새로고침
    document.querySelectorAll('.edit').forEach((button)=>{

        button.querySelector('.editSubmitButton').addEventListener('click', (event)=>{
            event.preventDefault();

            const $editCategories = button.querySelector('.inputEditCategoryName');

            if ($editCategories.value !== null && $editCategories.value.trim() !== ""){

                fetch('/category/overlapCheck',{
                    method: "POST",
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({name:$editCategories.value})
                })
                .then(response=>{return response.text()})
                .then(message =>{
    
                    if (message === "category exist"){
                        throw new Error('이미 존재하는 카테고리입니다.');
                    }
    
                    return fetch('/category/edit',{
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            id: $editCategories.getAttribute('data-id'),
                            name:$editCategories.value
                        })
                    })
                })
                .then(response => {return response.text()})
                .then(message => {
                    if (message === 'Success'){
                        location.reload();
                    } else {
                        throw new Error('카테고리 수정 실패 다시 시도하십시오.');
                    }
                })
                .catch(
                    error => {
                    alert(error.message);
                })

            } else {
                alert('변경하실 내용을 입력해주세요.');
                return
            }
        });
    });
    

})();