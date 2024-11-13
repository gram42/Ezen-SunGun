import InputUserInfo from "./InputUserInfo.js";
(()=>{
    const inputUserInfo = new InputUserInfo();

    const $inputPw = document.querySelector('#inputPw');
    const $inputPwChk = document.querySelector('#inputPwChk');
    const $pwChkRes = document.querySelector('#pwChkRes');

    // 비밀번호 - 비밀번호 확인, 형식(길이, 영문자(대소), 숫자, 특수문자), 공백 확인
    let pwChk = false;
    let pwFormChk = false;
    let pwSpaceChk = false

    // 비밀번호
    // 비밀번호 - 비밀번호 확인 일치 여부 검사
    $inputPw.addEventListener('input',()=>{
        if ($inputPwChk.value.length !== 0){
            pwChk = inputUserInfo.pwNPwChkResFunc($inputPw.value, $inputPwChk.value, $pwChkRes);
        }
    })
    $inputPwChk.addEventListener('input',()=>{
        pwChk = inputUserInfo.pwNPwChkResFunc($inputPw.value, $inputPwChk.value, $pwChkRes);
    })


    // 비밀번호 변경 폼 제출
    document.querySelector('#submitBtn').addEventListener('click', (event) => {
        event.preventDefault();

        let beforePw = "";

        if (document.querySelector('#inputBeforePw')) {
            beforePw = document.querySelector('#inputBeforePw').value;
        }


        const comphnsExamine = comphnsExamineFunc()
        if(comphnsExamine){
            fetch('/user/chngPw', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    beforePw: beforePw,
                    password: $inputPw.value
                })
            })
            .then(response=>{return response.json()})
            .then(res=>{
                if(res){
                    alert('비밀번호가 변경되었습니다.')
                    location.href= "/user/userInfo";
                } else {
                    alert('비밀번호 변경에 실패했습니다.\n 비밀번호를 다시 확인해주세요.')
                }
            })
            .catch(error=>{alert(error.message)})
        } else {
            alert('비밀번호 변경 입력사항 중 오류가 있습니다. 다시 시도해주세요')
        }

    });

    // 비밀번호 변경 종합 검사
    const comphnsExamineFunc = function(){

        // 비밀번호
        pwFormChk = inputUserInfo.pwFormChkFunc($inputPw, $pwChkRes); // 비밀번호 형식 검사(길이-8~20, 영문자(대소), 숫자, 특수문자)
        console.log('pwFormChk' + pwFormChk)
        if (!pwFormChk){return false}
        pwSpaceChk = inputUserInfo.spaceChkFunc($inputPw.value, $pwChkRes, "비밀번호에 공백이 들어갈 수 없습니다"); // 비밀번호 공백 검사
        console.log('pwSpaceChk' + pwSpaceChk)
        if (!pwSpaceChk) {return false}

        // 전체
        if (!pwChk ||
            !pwFormChk ||
            !pwSpaceChk
        ){
            return false
        }

        return true;
    }

})();