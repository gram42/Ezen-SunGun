import InputUserInfo from "./InputUserInfo.js";
(()=>{

    // import 메소드 사용
    const inputUserInfo = new InputUserInfo();

    const $inputUserid = document.querySelector('#inputUserid');
    const $UseridDuplChkBtn = document.querySelector('#useridDuplChkBtn');
    const $useridChkRes = document.querySelector('#useridChkRes');
    const $inputPw = document.querySelector('#inputPw');
    const $inputPwChk = document.querySelector('#inputPwChk');
    const $pwChkRes = document.querySelector('#pwChkRes');
    const $inputEmail = document.querySelector('#inputEmail');
    const $inputVerifiCode = document.querySelector('#inputEmailAuthNum');
    const $inputNicknm = document.querySelector('#inputNicknm');
    const $nicknmChkRes = document.querySelector('#nicknmChkRes');
    const $nicknDuplChkBtn = document.querySelector('#nicknmDuplChkBtn');
    const $inputGender = document.querySelector('input[name="gender"]:checked');
    const $inputBirthDate = document.querySelector('#inputBirthDate');

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    // 현재 값과 중복 확인 값 비교용
    let lastChkUserid = "";
    let lastChkNicknm = "";
    
    // 아이디 중복, 공백, 형식 확인, 변경 확인
    let useridDuplChk = false;
    let useridSpaceChk = false;
    let useridFormChk = false;
    let useridChngChk = false;
    
    // 비밀번호 - 비밀번호 확인, 형식(길이, 영문자(대소), 숫자, 특수문자), 공백 확인
    let pwChk = false;
    let pwFormChk = false;
    let pwSpaceChk = false
    
    // 닉네임 길이, 공백, 중복 확인, 변경 확인
    let nicknmLenChk = false;
    let nicknmSpaceChk = false;
    let nicknmDuplChk = false;
    let nicknmChngChk = false;
    
    let submitInfo = {};
    
    // 최종 확인
    let comphnsExamine = false;

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 아이디
    // 아이디 확인 요청
    $UseridDuplChkBtn.addEventListener('click',()=>{
        $useridChkRes.style.display = "none";

        // 아이디 공백 확인
        useridSpaceChk = inputUserInfo.spaceChkFunc($inputUserid.value, $useridChkRes, "아이디에 공백이 들어갈 수 없습니다");
    
        // 아이디 형식 확인(길이, 영문자)
        useridFormChk = useridFormChkFunc($inputUserid.value, $useridChkRes);
    
        if (useridSpaceChk && useridFormChk) {
    
            $useridChkRes.style.display = "none";
    
            // 아이디 중복 확인
            fetch('/user/check-userid',{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userid : $inputUserid.value})
            })
            .then(response=>{return response.json()})
            .then(res=>{
                if (res){
    
                    inputUserInfo.errMessage($useridChkRes, "사용 가능한 아이디입니다", "black");
                    useridDuplChk = true;
                    lastChkUserid = $inputUserid.value;
                } else{
    
                    inputUserInfo.errMessage($useridChkRes, "사용 중인 아이디입니다");
                    $inputUserid.focus();
                    useridDuplChk = false;
                }
            })
            .catch(error=>alert(error.message));
        } else {
            $inputUserid.focus();
            return
        }
    
    })
 
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
    
    
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 회원가입 최종 제출
    document.querySelector('#registerBtn').addEventListener('click',()=>{
    
        fetch('/chkVerifi', {
            method: "POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                email: $inputEmail.value,
                code: $inputVerifiCode.value
            })
        })
        .then(response=>{return response.json()})
        .then(res=>{
            if(res){
    
                document.querySelector('#emailChkRes').style.display = 'none';
    
                // 각종 형식 검사 메소드가 전부 true면 가입 요청 가능
                comphnsExamine = comphnsExamineFunc();
    
                // null 요소 여부에 따른 제출 데이터
                submitInfo = inputUserInfo.submitInfoFunc($inputUserid.value, 
                                                          $inputPw.value, 
                                                          $inputEmail.value, 
                                                          $inputNicknm.value, 
                                                          $inputGender.value, 
                                                          $inputBirthDate.value);
    
                if (comphnsExamine){
                    fetch('/user/join',{
                        method: "POST",
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify(submitInfo)
                    })
                    .then(response=>{return response.text()})
                    .then(message =>{
                        if (message === "register Success"){
    
                                alert("회원가입 성공!\n 관심 분야를 저장하시면 빠른 추천을 이용하실 수 있습니다.\n \
                                       개인메뉴의 관심사 설정을 이용해주세요")

                                location.href = "/ui/index";

                        } else {
                            alert("회원가입 중 오류가 발생했습니다.\n 다시 시도해주십시오.")
                        }
                    })
                } else {
                    alert('회원가입 입력사항중 오류가 있습니다.');
                }
            } else {

                inputUserInfo.errMessage(document.querySelector('#emailChkRes'), "인증에 실패했습니다. 이메일과 인증번호를 다시 확인해주세요")
                document.querySelector('#emailAuthBtn').focus();

            }
        })
        .catch(error=>alert(error.message));
    })
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 아이디 형식검사 (영문자, 길이)
    const useridFormChkFunc = function(userid, useridChkRes) {
    
        const bSChk = /[a-zA-Z]/.test(userid);
        // const numChk = /[0-9]/.test(userid); // 숫자가 꼭 필요한지?  && numChk
    
        if (userid.length >= 4 && userid.length <= 12 && bSChk){
            return true;
        }
    
        inputUserInfo.errMessage(useridChkRes, "아이디는 영문자 대소문자가 들어가야하고 4~12글자여야 합니다");
    
        return false;
    }
    // 회원가입 종합 검사
    const comphnsExamineFunc = function(){
    
        // 비밀번호
        pwFormChk = inputUserInfo.pwFormChkFunc($inputPw, $pwChkRes); // 비밀번호 형식 검사(길이-8~20, 영문자(대소), 숫자, 특수문자)
        console.log('pwFormChk' + pwFormChk)
        if (!pwFormChk){return false}
        pwSpaceChk = inputUserInfo.spaceChkFunc($inputPw.value, $pwChkRes, "비밀번호에 공백이 들어갈 수 없습니다"); // 비밀번호 공백 검사
        console.log('pwSpaceChk' + pwSpaceChk)
        if (!pwSpaceChk) {return false}
    
        // 아이디
        useridChngChk = inputUserInfo.elementChngExamineFunc($inputUserid, lastChkUserid, $useridChkRes, "아이디 중복확인을 해주세요"); // 아이디 변경 여부

        if(!useridChngChk){
            useridDuplChk = false;
            return false
        };
    
        // 닉네임
        nicknmChngChk = inputUserInfo.elementChngExamineFunc($inputNicknm, lastChkNicknm, $nicknmChkRes, "닉네임 중복확인을 해주세요"); // 닉네임 변경 여부

        if(!nicknmChngChk){
            nicknmDuplChk = false; 
            return false
        };
    
        // 전체
        if (!useridDuplChk ||
            !useridSpaceChk ||
            !useridFormChk ||
            !useridChngChk ||
            !pwChk ||
            !pwFormChk ||
            !pwSpaceChk ||
            !nicknmLenChk ||
            !nicknmSpaceChk ||
            !nicknmDuplChk ||
            !nicknmChngChk
        ){
            if(!nicknmDuplChk){
    
                inputUserInfo.errMessage($nicknmChkRes, "닉네임 중복확인을 해주세요");
                $inputNicknm.focus();
    
            } else if (!useridDuplChk){
    
                inputUserInfo.errMessage($useridChkRes, "아이디 중복확인을 해주세요");
                $inputUserid.focus();
            }
            return false
        }
    
        return true;
    
    }
})();