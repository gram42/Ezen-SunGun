
import InputUserInfo from "./InputUserInfo.js";

(()=>{

    const inputUserInfo = new InputUserInfo();

    // 메일 인증 발송 안내
    document.querySelector('#emailForm').addEventListener('submit',()=>{
        inputUserInfo.errMessage(document.querySelector('#emailChkRes'), "인증 메일이 발송되었습니다.", "black");
    });

    document.querySelector('#idPlz').addEventListener('click', (event)=>{
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

            if(res){
                fetch('/user/getUseridByEmail', {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({
                        email: document.querySelector('#inputEmail').value,
                    })
                })
                .then(response=>{console.log(response);return response.json()})
                .then(userList => {

                    console.log(userList);

                    const resultMessage = document.querySelector('#resultMessage');
                    const userIdsList = document.querySelector('#userIdsList');
    
                    if (userList && userList.length > 0) {

                        document.querySelector('#idPlzContainer').style.display = 'none';
    
                        resultMessage.textContent = "가입하신 아이디 입니다.";
                        resultMessage.style.color = "black";
    
    
                        userIdsList.innerHTML = "";
                        userList.forEach(userDTO => {
                            const li = document.createElement("li");
                            li.textContent = userDTO.userid;
                            userIdsList.appendChild(li);
                        });
                    } else {
                        resultMessage.textContent = "가입하신 아이디가 없습니다.";
                        resultMessage.style.color = "red";
                    }
                })
                .catch(error=>{alert(error.message)})
            } else {
                inputUserInfo.errMessage(document.querySelector('#emailChkRes'), "인증에 실패했습니다. \n" + "이메일과 인증번호를 다시 확인해주세요")
                document.querySelector('#emailAuthBtn').focus();
            }
        })
        .catch(error=>{alert(error.message)})
    });
})();
