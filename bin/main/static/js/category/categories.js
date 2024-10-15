(()=>{

    // 수정 버튼 클릭시 수정 창 등장
    document.querySelectorAll('.editCategories').forEach((button)=>{

        const $categoryDiv = button.parentElement;

        button.addEventListener('click', ()=>{
            $categoryDiv.querySelector('.edit').style.display = 'block';
            $categoryDiv.querySelector('.edit').querySelector('.inputEditCategoryName').focus();
        });

    });

    // 추가 버튼 클릭 시 추가 창 등장
    document.querySelector('#add').addEventListener('click', ()=>{
        document.querySelector('.add').style.display = 'block';
        document.querySelector('#inputAddCategoryName').focus();
    });

    // 추가 완료 버튼 누를 시 저장 후 페이지 새로고침
    document.querySelector('#addSubmitButton').addEventListener('click',()=>{
        const inputAddCategoryName = document.querySelector('#inputAddCategoryName').value;

        if(inputAddCategoryName === null || inputAddCategoryName.trim() === ""){
            alert('내용을 입력해주세요.');
            return
        } else {
            fetch('/category/add', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name : inputAddCategoryName})
            })
            .then(response => {return response.text()})
            .then(()=>{location.reload();})
            .catch(
                error => {
                    alert(error.message);
            })
        }
    });

    // 수정 완료 버튼 누를 시 저장 후 페이지 새로고침
    document.querySelectorAll('.edit').forEach((button)=>{
        button.querySelector('.editSubmitButton').addEventListener('click', ()=>{
            const $editCategories = button.querySelector('.inputEditCategoryName');
            if ($editCategories.value !== null && $editCategories.value.trim() !== ""){

                fetch('/category/edit',{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        strId: $editCategories.getAttribute('data-id'),
                        name:$editCategories.value
                    })
                })
                .then(response => {return response.text()})
                .then(message => {
                    if (message === 'Success'){
                        location.reload();
                    } else {
                        throw new error('카테고리 수정 실패 다시 시도하십시오.');
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