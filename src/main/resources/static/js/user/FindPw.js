
import InputUserInfo from "./InputUserInfo.js";

(()=>{

    const inputUserInfo = new InputUserInfo();

    // 메일 인증 발송 안내
    document.querySelector('#emailForm').addEventListener('submit',()=>{
        inputUserInfo.errMessage(document.querySelector('#emailChkRes'), "인증 메일이 발송되었습니다.", "black");
    });

    document.querySelector('#pwPlz').addEventListener('click', (event)=>{
        event.preventDefault();

        fetch("/chkVerifi", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: document.querySelector('#inputEmail').value,
                code: document.querySelector('#inputEmailAuthNum').value
            })
        })
        .then(response=>{return response.json()})
        .then(res=>{
            const email = document.querySelector('#inputEmail').value;
            const userid = document.querySelector('#inputUserid').value;
            if(res){
                fetch('/user/saveFindPwInfo',{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email: email,
                        userid: userid
                    })
                })
                .then(response=>{return response.json()})
                .then(res=>{
                    if(res){
                        location.href= "/user/chngPw";
                    } else {
                        alert('유저를 찾을 수 없습니다');
                    }

                })
                .catch(error=>{alert(error.message)})
            } else {
                inputUserInfo.errMessage(document.querySelector('#emailChkRes'), "인증에 실패했습니다. \n 이메일과 인증번호를 다시 확인해주세요")
                document.querySelector('#emailAuthBtn').focus();
            }
        })
        .catch(error=>{alert(error.message)})
    });
})();
