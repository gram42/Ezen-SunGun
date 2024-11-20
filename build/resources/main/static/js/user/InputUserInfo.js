
class InputUserInfo{

    constructor(){
        this.lastChkElement = "";
        this.submitInfo = {};

    }

    // 각종 형식 검사 메소드 모음
    // 공백 검사
    spaceChkFunc(elementValue, elementChkRes, message){
        if (/\s/.test(elementValue)){

        this.errMessage(elementChkRes, message);
        return false;
    }
        return true;
    }

    // 비밀번호 - 확인 일치여부 검사 메소드
    pwNPwChkResFunc(pwValue, pwChkValue, pwChkRes) {
        if (pwValue !== pwChkValue){

            this.errMessage(pwChkRes, "비밀번호가 일치하지 않습니다");
            return false;

        } else {
            pwChkRes.style.display = "none";
            return true;
        }
    }

    // 닉네임 길이 검사
    nicknmLenChkFunc(nicknmValue, nicknmChkRes){
        if(nicknmValue.length > 15 || nicknmValue.length === 0){

            this.errMessage(nicknmChkRes, "닉네임은 1자 이상 15자 이내 입니다");
            return false;
        }
        return true;
    }
    

    // 회원가입 제출용
    // 비밀번호 형식 검사(길이-8~20, 영문자(대소), 숫자, 특수문자)
    pwFormChkFunc(pw, pwChkRes){

        let bEng = /[a-z]/.test(pw.value);
        let sEng = /[A-Z]/.test(pw.value);
        let num = /[0-9]/.test(pw.value);
        let specialLetter = /[~!@#$%^&*()]/.test(pw.value);

        if (pw.value.length >= 8 && pw.value.length <= 20 && bEng && sEng && num && specialLetter){
            return true;
        }


        this.errMessage(pwChkRes, "비밀번호는 8~20자, 영문자 대문자, 소문자, 특수문자가(~!@#$%^&*() 중 하나) 포함되어야 합니다");

        pw.focus();

        return false;
    }


    // 중복검사 후 변경 여부 검사
    elementChngExamineFunc(element, lastChkElement, elementChkRes, message){

        if (lastChkElement === element.value){return true;}

        this.errMessage(elementChkRes, message);
        element.focus()

        return false;
    }

    // 성별 빈칸 여부
    genderExistFunc(genderValue) {
        if (genderValue !== "null"){return true;}
        return false;
    }

    // 생년월일 빈칸 여부
    birthDateExistFunc(birthDateValue){
        return birthDateValue.trim() !== "";
    }


    // 제출 정보 목록
    submitInfoFunc(useridValue, pwValue, emailValue, nicknmValue, inputGenderValue, inputBirthDateValue) {
        const regSubJson = {
            userid: useridValue,
            password: pwValue,
            email: emailValue,
            userName: nicknmValue
        };
    
        if (this.genderExistFunc(inputGenderValue)) {
            regSubJson.gender = inputGenderValue;
        }
    
        if (this.birthDateExistFunc(inputBirthDateValue)) {
            regSubJson.birthDate = inputBirthDateValue;
        }
    
        return regSubJson;
    }
    
    // 에러 메세지
    errMessage(element, message, color = "red") {
        element.textContent = message;
        element.style.color = color;
        element.style.display = "block";
    }
}
export default InputUserInfo;