(()=>{
// document.addEventListener("DOMContentLoaded", function() {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const titleAlert = document.getElementById("titleAlert");
    const contentAlert = document.getElementById("contentAlert");

    // 글자 수 체크하는 함수
    function checkInputLength() {
        const titleLength = titleInput.value.length;
        const contentLength = contentInput.value.length;

        // 제목 체크
        if (titleLength >= 100) {
            titleInput.value = titleInput.value.substring(0, 100); // 초과 시 잘라내기
            titleAlert.style.display = "block"; // 경고 메시지 표시
        } else {
            titleAlert.style.display = "none"; // 숨기기
        }

        // 내용 체크
        if (contentLength >= 1000) {
            contentInput.value = contentInput.value.substring(0, 1000); // 초과 시 잘라내기
            contentAlert.style.display = "block"; // 경고 메시지 표시
        } else {
            contentAlert.style.display = "none"; // 숨기기
        }
    }

    // 실시간 입력 체크
    titleInput.addEventListener("input", function() {
        checkInputLength();
    });

    contentInput.addEventListener("input", function() {
        checkInputLength();
    });

    // 글쓰기 폼 제출 시 처리
    document.getElementById("postForm").onsubmit = async function(event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const formData = new FormData(this);

        // 글 제목이나 내용이 비어 있는지 확인
        if (!formData.get("title") || !formData.get("content")) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        // 데이터 전송
        try {
            const response = await fetch('/posts', {
                method: 'POST',
                body: JSON.stringify({
                    userId: 1,  // 임의의 사용자 ID
                    title: formData.get("title"),
                    content: formData.get("content")
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // 서버로부터 응답 확인
            if (response.ok) {
                console.log("게시글이 성공적으로 작성되었습니다.");
                window.location.href = '/community/community';
            } else {
                const errorData = await response.json(); 
                console.error("Error:", errorData);
                alert("게시글 작성 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert("서버에 연결하는 중 오류가 발생했습니다.");
        }
    };
// });
})();
 