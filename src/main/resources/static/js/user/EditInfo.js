import InputUserInfo from "./InputUserInfo.js";

(()=>{

    const inputUserInfo = new InputUserInfo();

    const $inputPw = document.querySelector('#inputPw');
    const $inputPwChk = document.querySelector('#inputPwChk');
    const $pwChkRes = document.querySelector('#pwChkRes');
    const $inputNicknm = document.querySelector('#inputNicknm');
    const $nicknmChkRes = document.querySelector('#nicknmChkRes');
    const $nicknDuplChkBtn = document.querySelector('#nicknmDuplChkBtn');

    // 닉네임 변경 안했을 경우
    const existingNicknm = $inputNicknm.value;

    //  닉네임 확인 후 변경 여부
    let lastChkNicknm = "";

    // 비밀번호 - 비밀번호 확인, 형식(길이, 영문자(대소), 숫자, 특수문자), 공백 확인
    let pwChk = false;
    let pwFormChk = false;
    let pwSpaceChk = false

    // 닉네임 길이, 공백, 중복 확인, 변경 확인
    let nicknmLenChk = false;
    let nicknmSpaceChk = false;
    let nicknmDuplChk = false;
    let nicknmChngChk = false;

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

    // 닉네임
    // 닉네임 형식 검사
    $nicknDuplChkBtn.addEventListener('click',()=>{

        $nicknmChkRes.textContent = "";
        $nicknmChkRes.style.display = "block";

        // 닉네임 길이 확인
        nicknmLenChk = inputUserInfo.nicknmLenChkFunc($inputNicknm.value, nicknmLenChk);

        // 닉네임 공백 확인
        nicknmSpaceChk = inputUserInfo.spaceChkFunc($inputNicknm.value, $nicknmChkRes, "닉네임에 공백이 들어갈 수 없습니다")


        // 닉네임 중복확인
        if (nicknmLenChk && nicknmSpaceChk){
            fetch('/user/chkNicknm', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userName: $inputNicknm.value})
            })
            .then(response=>{return response.json()})
            .then(res=>{
                if(res === false){
                    nicknmDuplChk = true;
                    inputUserInfo.errMessage($nicknmChkRes, "사용 가능한 닉네임입니다", "black");
                    lastChkNicknm = $inputNicknm.value;
                } else{
                    nicknmDuplChk = false;
                    inputUserInfo.errMessage($nicknmChkRes, "이미 사용중인 닉네임입니다");
                }
            })
            .catch(error=>alert(error.message))
        }

    })
    
    // 개인 정보 수정 종합 검사
    const comphnsExamineFunc = function(){
    
        if($inputPw.value.length !== 0 || $inputPwChk.value.length !== 0){
            // 비밀번호
            pwFormChk = inputUserInfo.pwFormChkFunc($inputPw, $pwChkRes); // 비밀번호 형식 검사(길이-8~20, 영문자(대소), 숫자, 특수문자)
            if (!pwFormChk){return false}
            pwSpaceChk = inputUserInfo.spaceChkFunc($inputPw.value, $pwChkRes, "비밀번호에 공백이 들어갈 수 없습니다"); // 비밀번호 공백 검사
            if (!pwSpaceChk) {return false}
        } else {
            pwChk = true;
            pwFormChk = true;
            pwSpaceChk = true;
        }
    
        // 닉네임
        if(existingNicknm === $inputNicknm.value){
            nicknmLenChk = true;
            nicknmSpaceChk = true;
            nicknmDuplChk = true;
            nicknmChngChk = true;
        } else {
            nicknmChngChk = inputUserInfo.elementChngExamineFunc($inputNicknm, lastChkNicknm, $nicknmChkRes, "닉네임 중복확인을 해주세요"); // 닉네임 변경 여부
            if(!nicknmChngChk){
                nicknmDuplChk = false;
                return false
            };
        }

        console.log('pwChk-'+pwChk+' pwFormChk-'+pwFormChk+' pwFormChk-'+pwFormChk+' nicknmLenChk-'+nicknmLenChk+' nicknmSpaceChk-'+nicknmSpaceChk+' nicknmDuplChk-'+nicknmDuplChk+' nicknmChngChk-'+nicknmChngChk);
    
        // 전체
        if (!pwChk ||
            !pwFormChk ||
            !pwSpaceChk ||
            !nicknmLenChk ||
            !nicknmSpaceChk ||
            !nicknmDuplChk ||
            !nicknmChngChk)
            {
            if(!nicknmDuplChk){
    
                inputUserInfo.errMessage($nicknmChkRes, "닉네임 중복확인을 해주세요");
                $inputNicknm.focus();
    
            }
            return false
        }
    
        return true;
    
    }


    // 개인정보 수정
    document.querySelector('#submitForm').addEventListener('submit', (event) => {

        event.preventDefault();

        const comphnsExamine = comphnsExamineFunc()
        if(comphnsExamine){
            event.target.submit();
        } else {
            alert('개인정보 수정 중 오류가 있습니다. 다시 시도해주세요')
        }

    });


    // 회원탈퇴
    document.querySelector('#deleteAccount').addEventListener('click',(event)=>{
        event.preventDefault();

        if (confirm("회원 탈퇴 시 작성하신 게시글 기록 등이 전부 삭제됩니다.\n정말로 탈퇴 하시겠습니까?")){
            const userid = document.querySelector('input[name="userid"]').value;
            const id = document.querySelector('input[name="id"]').value;
            
            fetch('/user/deleteAccount', {

                method: 'DELETE',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userid, id})

            })
            .then(response => response.text())
            .then(message => {
                alert(message);
                location.href='/ui/main';
            })
            .catch(error => {
                    alert("탈퇴 중 문제가 발생했습니다\n" + error.message);
            });
        }
        
    })





})();
