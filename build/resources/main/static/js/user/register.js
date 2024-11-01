
(()=>{
    const $userid = document.querySelector('#inputUserid');
    const $UseridDuplChkBtn = document.querySelector('#useridDuplChkBtn');
    const $useridChkRes = document.querySelector('#useridChkRes');
    const $pw = document.querySelector('#inputPw');
    const $pwChk = document.querySelector('#inputPwChk');
    const $pwChkRes = document.querySelector('#pwChkRes');
    const $nicknm = document.querySelector('#inputNicknm');
    const $nicknmChkRes = document.querySelector('#nicknmChkRes');
    const $nicknDuplChkBtn = document.querySelector('#nicknmDuplChkBtn');
    const $BirthDate = document.querySelector('#inputBirthDate');

    // 현재 값과 중복 확인 값 비교용
    let lastChkUserid = "";
    let lastChkNicknm = "";
    let lastChkEmail = "";

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
    
    // 이메일 인증 확인, 변경 확인
    let emailAuthChk = false;
    let emailChngChk = false

    // 성별 유무
    let genderExist = false;

    // 생년월일 유무
    let birthDateExist = false;

    // 제출 할 json 목록(아이디, 비번, 이메일, 닉네임, 선택(성별, 생년월일))
    let regSubJson = {
        userid: '',
        password: '',
        // email: '',
        userName: ''
    }

    // 최종 확인
    let comphnsExamin = false;

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    // 아이디
    // 아이디 확인 요청
    $UseridDuplChkBtn.addEventListener('click',()=>{
        $useridChkRes.style.display = "none";

        // 아이디 공백 확인
        useridSpaceChk = useridSpaceChkFunc($userid.value);

        // 아이디 형식 확인(길이, 영문자)
        useridFormChk = useridFormChkFunc($userid.value);

        if (useridSpaceChk && useridFormChk) {

            $useridChkRes.style.display = "none";

            // 아이디 중복 확인
            fetch('/user/check-userid',{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userid : $userid.value})
            })
            .then(response=>{return response.json()})
            .then(res=>{
                if (res){
                    $useridChkRes.textContent = "사용 가능한 아이디입니다.";
                    $useridChkRes.style.color = "black";
                    $useridChkRes.style.display = "block";
                    useridDuplChk = true;
                    lastChkUserid = $userid.value;
                } else{
                    $useridChkRes.textContent = "사용 중인 아이디입니다."
                    $useridChkRes.style.color = "red";
                    $useridChkRes.style.display = "block";
                    $userid.focus();
                    useridDuplChk = false;
                }
            })
            .catch(error=>alert(error.message));
        } else {
            $userid.focus();
            return
        }

    })


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 
    // 비밀번호
    // 비밀번호 - 비밀번호 확인 일치 여부 검사
    $pw.addEventListener('input',()=>{
        if ($pwChk.value.length !== 0){
            pwNPwChkResFunc();
        }
    })
    $pwChk.addEventListener('input',()=>{
        pwNPwChkResFunc();
    })


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 닉네임
    
    // 닉네임 형식 검사
    $nicknDuplChkBtn.addEventListener('click',()=>{

        $nicknmChkRes.textContent = "";
        $nicknmChkRes.style.display = "block";

        // 닉네임 길이 확인
        nicknmLenChk = nicknmLenChkFunc($nicknm.value)

        // 닉네임 공백 확인
        nicknmSpaceChk = nicknmSpaceChkFunc($nicknm.value)


        // 닉네임 중복확인
        if (nicknmLenChk && nicknmSpaceChk){
            fetch('/user/chkNicknm', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userName: $nicknm.value})
            })
            .then(response=>{return response.json()})
            .then(res=>{
                if(res === false){
                    nicknmDuplChk = true;
                    $nicknmChkRes.style.color = "black";
                    $nicknmChkRes.textContent = "사용 가능한 닉네임입니다";
                    lastChkNicknm = $nicknm.value;
                } else{
                    nicknmDuplChk = false;
                    $nicknmChkRes.textContent = "이미 사용중인 닉네임입니다";
                    $nicknmChkRes.style.color = "red";
                }
                $nicknmChkRes.style.display = "block";
            })
            .catch(error=>alert(error.message))
        }

    })



// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // 회원가입 최종 제출
    document.querySelector('#registerBtn').addEventListener('click',()=>{
        comphnsExamin = comphnsExaminFunc();
        forRegInfo = forRegInfoFunc();
        if (comphnsExamin){
            fetch('/user/join',{
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(forRegInfo)
            })
            .then(response=>{return response.text()})
            .then(message =>{
                if (message === "register Success"){
                    if(confirm("회원가입 성공 관심 분야를 선택해보세요")){
                        location.href = "/ui/main";
                    }
                    else{
                        location.href = "/ui/main";
                    }
                } else {
                    alert("회원가입 중 오류가 발생했습니다.\n 다시 시도해주십시오.")
                }
            })
            .catch(error=>alert(error.message));
        } else {
            alert('회원가입 입력사항중 오류가 있습니다.');
        }

    })

    // 각종 형식 검사 메소드가 전부 true면 가입 요청 가능

    // // 피드백 용으로 아무 검사 없이 가입
    // document.querySelector('#registerBtn').addEventListener('click', ()=>{
    //     console.log('클릭');
    //     fetch("/user/join",{
    //         method: "POST",
    //         headers: {"Content-Type" : "application/json"},
    //         body: JSON.stringify({
    //             userid: $userid.value,
    //             password: $pw.value,
    //             userName: $nicknm.value
    //         })
    //     })
    //     .then(response=>{return response.text()})
    //     .then(res=>{
    //         alert(res)
    //         // location.href="/ui/main"
    //     })
    //     .catch(error=>{alert(error.message)})
    // });

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 각종 형식 검사 메소드 모음
    // 아이디 공백 검사
    const useridSpaceChkFunc = function(userid){
        if (/\s/.test(userid)){

        $useridChkRes.textContent = "아이디에 공백을 넣을 수 없습니다"
        $useridChkRes.style.display = "block";
        $useridChkRes.style.color = "red";

        return false;
    }
        return true;
    }
    
    // 아이디 형식검사 (영문자, 길이)
    const useridFormChkFunc = function(userid) {
        const bSChk = /[a-zA-Z]/.test(userid);
        // const numChk = /[0-9]/.test(userid); // 숫자가 꼭 필요한지?  && numChk
        if (userid.length >= 4 && userid.length <= 12 && bSChk){
            return true;
        }

        $useridChkRes.textContent = "아이디는 영문자 대소문자가 들어가야하고 4~12글자여야 합니다."
        $useridChkRes.style.display = "block";
        $useridChkRes.style.color = "red";

        return false;
    }

    // 비밀번호 - 확인 일치여부 검사 메소드
    const pwNPwChkResFunc = function() {
        if ($pw.value !== $pwChk.value){

            $pwChkRes.textContent = "비밀번호가 일치하지 않습니다"
            $pwChkRes.style.display = "block";
            $pwChkRes.style.color = "red";

        } else {
            pwChk = true;
            $pwChkRes.style.display = "none";
        }
    }


    // 닉네임 공백 검사
    const nicknmSpaceChkFunc = function(nicknm){
        if (/\s/.test(nicknm)){
            $nicknmChkRes.textContent = "닉네임에는 공백이 들어갈 수 없습니다";
            $nicknmChkRes.style.display = "block";
            $nicknmChkRes.style.color = "red";
            return false;
        }
        return true;
    }
    // 닉네임 길이 검사
    const nicknmLenChkFunc = function(nicknm){
        if(nicknm.length > 15 || nicknm.length === 0){
            $nicknmChkRes.textContent = "닉네임은 1자 이상 15자 이내 입니다";
            $nicknmChkRes.style.display = "block";
            $nicknmChkRes.style.color = "red";
            return false;
        }
        return true;
    }
    

    // 회원가입 제출용
    // 비밀번호 공백 검사
    const pwSpaceChkFunc = function(pw) {

        let pwSpace = /\s/.test(pw);

        if (pwSpace){

            $pwChkRes.textContent = "비밀번호에는 공백이 올 수 없습니다"
            $pwChkRes.style.display = "block";
            $pwChkRes.style.color = "red";
            $pw.focus();
            return false;

        }
        return true;
    }

    // 비밀번호 형식 검사(길이-8~20, 영문자(대소), 숫자, 특수문자)
    const pwFormChkFunc = function(pw){

        let bEng = /[a-z]/.test(pw);
        let sEng = /[A-Z]/.test(pw);
        let num = /[0-9]/.test(pw);
        let specialLetter = /[!@#$%^&*(),.?:{}|<>]/.test(pw);

        if (pw.length >= 8 && pw.length <= 20 && bEng && sEng && num && specialLetter){
            return true;
        }

        $pwChkRes.textContent = "비밀번호는 8~20자, 영문자 대문자, 소문자, 특수문자가(!@#$%^&*(),.?:{}|<> 중 하나) 포함되어야 합니다"
        $pwChkRes.style.display = "block";
        $pwChkRes.style.color = "red";
        $pwChk.value = "";
        $pw.focus();
        return false;
    }


    // 아이디 중복검사 후 변경여부 검사
    const useridChngExamineFunc = function(userid){

        if (lastChkUserid === userid){return true;}

        $useridChkRes.textContent = "아이디를 다시 중복 확인해주세요";
        $useridChkRes.style.color = "red";
        $useridChkRes.style.display = "block";
        $userid.focus()
        return false;
    }
    
    
    
    // 닉네임 중복검사 후 변경여부 검사
    const nicknmChngExamineFunc = function(nicknm){

        if(lastChkNicknm === nicknm){return true}

        $nicknmChkRes.textContent = "닉네임을 다시 중복 확인해주세요"
        $nicknmChkRes.style.color = "red";
        $nicknmChkRes.style.display = "block";
        $nicknm.focus()
        return false;
    }



    // 이메일 검사(형식, 인증번호)

    // 성별 빈칸 여부
    const genderExistFunc = function() {

        const gender = document.querySelector('input[name="gender"]:checked').value;
        
        if (gender !== "null"){return true;}
        return false;
    }

    // 생년월일 빈칸 여부
    const birthDateExistFunc = ()=>{
        return $BirthDate.value.trim() !== "";
    }


    // 제출 목록 여부
    const forRegInfoFunc = ()=>{

        genderExist = genderExistFunc();
        birthDateExist = birthDateExistFunc();

        if (genderExist && birthDateExist){
            return   regSubJson = {
                        userid: $userid.value,
                        password: $pw.value,
                        // email: $email.value,
                        userName: $nicknm.value,
                        gender: document.querySelector('input[name="gender"]:checked').value,
                        birthDate: $BirthDate.value
                    }   
        } else if(!genderExist && birthDateExist){
            return   regSubJson = {
                        userid: $userid.value,
                        password: $pw.value,
                        // email: $email.value,
                        userName: $nicknm.value,
                        birthDate: $BirthDate.value
                    }   
        } else if(genderExist && !birthDateExist){
            return   regSubJson = {
                        userid: $userid.value,
                        password: $pw.value,
                        // email: $email.value,
                        userName: $nicknm.value,
                        gender: document.querySelector('input[name="gender"]:checked').value
                    }   
        } else {
            return  regSubJson = {
                        userid: $userid.value,
                        password: $pw.value,
                        // email: $email.value,
                        userName: $nicknm.value
                    }
        }
    }
    


    // 종합 검사
    const comphnsExaminFunc = function(){

        // 비밀번호
        pwFormChk = pwFormChkFunc($pw.value); // 비밀번호 형식 검사(길이-8~20, 영문자(대소), 숫자, 특수문자)
        if (!pwFormChk){return false}
        pwSpaceChk = pwSpaceChkFunc($pw.value); // 비밀번호 공백 검사
        if (!pwSpaceChk) {return false}

        // 아이디
        useridChngChk = useridChngExamineFunc($userid.value) // 아이디 변경 여부
        if(!useridChngChk){return false};

        // 닉네임
        nicknmChngChk = nicknmChngExamineFunc($nicknm.value) // 닉네임 변경 여부
        if(!nicknmChngChk){return false};

        // 이메일


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
            // 이메일 인증 관련도 넣어야함
        ){
            if(!nicknmDuplChk){
                $nicknmChkRes.textContent = "닉네임 중복확인을 해주세요";
                $nicknmChkRes.style.display = "block";
                $nicknmChkRes.style.color = "red";
                $nicknm.focus();
            } else if (!useridDuplChk){
                $useridChkRes.textContent = "아이디 중복확인을 해주세요"
                $useridChkRes.style.color = "red";
                $useridChkRes.style.display = "block";
                $userid.focus();
            }
            return false
        }

        return true;

    }




})();
