// 로그인 함수
async function login(userId, password) {
    const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid: userId, password: password }),
        credentials: 'include'  // 세션 쿠키를 포함
    });

    if (response.ok) {
        const data = await response.text(); // "로그인 성공" 메시지
        console.log(data); // 성공 메시지 로그

        // 로그인 성공 후 사용자 정보 로드
        await fetchCurrentUser(); // 로그인 후 사용자 정보 로드

        // 메인 페이지로 리다이렉션
        window.location.href = '/'; 
    } else {
        const errorText = await response.text(); // 오류 메시지
        console.error('로그인 실패:', errorText);
        alert('로그인 실패: ' + errorText);
    }
}

// 로그아웃 시 호출하는 함수
async function logout() {
    console.log('로그아웃 시도'); // 로그아웃 시도 로그
    // 세션 초기화
    await fetch('/user/logout', { method: 'POST' }); // 로그아웃 API 호출
    localStorage.removeItem('currentUserId'); // 사용자 ID 제거
    alert('로그아웃되었습니다.'); // 사용자에게 로그아웃 알림
}

// 로그인 상태 확인 함수
function isUserLoggedIn() {
    const loggedIn = localStorage.getItem('currentUserId') !== null; // 현재 사용자 ID가 로컬 스토리지에 있는지 확인
    console.log(`로그인 상태: ${loggedIn}`); // 로그인 상태 로그
    return loggedIn;
}

// 현재 사용자 정보 가져오기
async function fetchCurrentUser() {
    try {
        console.log('현재 사용자 정보 요청'); // 사용자 정보 요청 로그
        const response = await fetch("http://localhost:9090/user/current", {
            method: 'GET',
            credentials: 'include' // 세션 쿠키 포함
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('사용자가 로그인하지 않았습니다.'); // 로그인되지 않은 상태 로그
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                window.location.href = '/user/login';
                return null; // 401 시 null 반환
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const currentUser = await response.json();
        console.log('현재 사용자 정보:', currentUser); // 현재 사용자 정보 로그
        localStorage.setItem('currentUserId', currentUser.id);
        return currentUser;
    } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        return null; // 오류 발생 시 null 반환
    }
}

// 사용자가 작성한 댓글 목록 로드
async function loadUserComments() {
    const currentUser = await fetchCurrentUser(); // 현재 사용자 정보 로드
    if (currentUser) {
        const userId = currentUser.id; 
        console.log(`사용자 ${userId}의 댓글 로드 요청`);

        const response = await fetch(`/comments/user/${userId}`, {
            method: 'GET',
            credentials: 'include' // 세션 쿠키 포함
        });

        if (!response.ok) {
            const errorText = await response.text(); // 오류 메시지
            console.error(`Error response: ${errorText}`); // 오류 메시지 출력
            alert(`댓글 로드 실패: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('댓글 데이터:', data); // 댓글 데이터 구조 확인

        const comments = data.content || [];
        console.log('사용자 댓글:', comments);

        const myCommentsList = document.getElementById('myCommentsList');
        myCommentsList.innerHTML = '';

        if (comments.length === 0) {
            myCommentsList.innerHTML = '<p>작성한 댓글이 없습니다.</p>';
        } else {
            comments.forEach(comment => {
                console.log('댓글 내용:', comment);
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.style.border = '1px solid #ccc'; // 테두리 추가
                commentDiv.style.borderRadius = '5px'; // 모서리 둥글게
                commentDiv.style.padding = '10px'; // 패딩 추가
                commentDiv.style.margin = '10px 0'; // 마진 추가

                

                commentDiv.innerHTML = `
                    <p>${comment.commentText || '댓글 내용이 없습니다.'}</p>
                    <p>작성 시간: ${new Date(comment.createdAt).toLocaleString()}</p>
                    <button onclick="loadCommentDetail(${comment.commentsId})">상세보기</button>
                    <button onclick="editComment(${comment.commentsId})">수정</button>
                    <button onclick="deleteComment(${comment.commentsId})">삭제</button>
                `;
                myCommentsList.appendChild(commentDiv);
            });
        }
    } else {
        console.log('로그인되지 않은 상태입니다.');
    }
}

let editingCommentId = null; // 수정할 댓글 ID 저장 변수

// 댓글 수정 함수
function editComment(commentId) {
    if (commentId === undefined) {
        console.error('댓글 ID가 정의되지 않았습니다.');
        alert('댓글 ID가 정의되지 않았습니다.');
        return; // 추가: ID가 정의되지 않은 경우 함수 종료
    }
    // 수정할 댓글 데이터를 가져와서 수정 모달에 표시
    fetch(`/comments/${commentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('댓글을 가져오는 데 실패했습니다.'); // 오류 처리
            }
            return response.json();
        })
        .then(data => {
            editingCommentId = commentId; // 수정할 댓글의 ID 저장
            document.getElementById('newCommentText').value = data.commentText;
            document.getElementById('editCommentModal').style.display = 'block'; // 수정 모달 열기
        })
        .catch(error => console.error('Error fetching comment:', error));
}

// 수정 저장 함수
function submitEdit() {
    const commentText = document.getElementById('newCommentText').value;

    if (!commentText) {
        alert("댓글 내용을 입력해주세요.");
        return;
    }

    // 수정된 댓글 저장
    fetch(`/comments/${editingCommentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commentText })
    })
    .then(response => {
        if (response.ok) {
            alert('댓글 수정 성공');
            document.getElementById('editCommentModal').style.display = 'none'; // 수정 모달 닫기
            loadUserComments(); // 수정 후 댓글 목록 새로고침
        } else {
            throw new Error('수정 실패');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('수정 실패');
    });
}

function closeCommentModal() {
    document.getElementById('editCommentModal').style.display = 'none'; // 모달 닫기
}

// 수정 모달 닫기 기능
document.getElementById('closeEditCommentModal').addEventListener('click', function() {
    document.getElementById('editCommentModal').style.display = 'none'; // 수정 모달 닫기
});

// 저장 버튼 클릭 시 수정 내용 서버로 전송
document.getElementById('saveCommentChangesBtn').addEventListener('click', submitEdit);

// 댓글 삭제 함수
async function deleteComment(commentId) {
    if (commentId === undefined) {
        console.error('댓글 ID가 정의되지 않았습니다.');
        alert('댓글 ID가 정의되지 않았습니다.');
        return; // 추가: ID가 정의되지 않은 경우 함수 종료
    }

    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
        const response = await fetch(`/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert('댓글이 삭제되었습니다.');
            loadUserComments(); // 댓글 목록 새로 고침
        } else {
            const errorText = await response.text();
            console.error(`댓글 삭제 실패: ${errorText}`);
            alert(`댓글 삭제 실패: ${errorText}`);
        }
    }
}

// 댓글 상세보기 로드
async function loadCommentDetail(commentId) {
    if (!commentId) {
        console.error('댓글 ID가 정의되지 않았습니다.');
        alert('댓글 ID가 정의되지 않았습니다.');
        return;
    }
    console.log(`댓글 상세보기 요청: ${commentId}`);
    const response = await fetch(`/comments/${commentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('댓글 데이터:', data); // API 응답 데이터 구조 확인
    const comments = data.content || []; // content가 없을 경우 빈 배열 처리

    // HTML 요소에 값을 설정
    const commentTextElem = document.getElementById('commentText');
    const userNameElem = document.getElementById('commentUserName');
    const createdAtElem = document.getElementById('commentCreatedAt');

    // 요소들이 null이 아닌지 확인
    if (commentTextElem && userNameElem && createdAtElem) {
        commentTextElem.textContent = `댓글: ${data.commentText}`;
        createdAtElem.textContent = new Date(data.createdAt).toLocaleString();
        

        // 상세보기 모달 표시
        const modal = document.getElementById('commentModal');
        modal.style.display = 'block'; // 모달 열기

        // 모달 닫기 버튼 이벤트
        document.getElementById('closeCommentModal').onclick = function() {
            modal.style.display = 'none';
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none'; // 외부 클릭 시 모달 닫기
            }
        };

        loadposts(commentId); // 댓글로 게시글 로드 함수 호출

    } else {
        console.error('상세보기 요소를 찾을 수 없습니다.');
    }
}


// 댓글에 대한 게시물 로드
async function loadposts(commentId) {
    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = ''; // 기존 게시물 초기화

    console.log('Loading post for comment ID:', commentId);
    const response = await fetch(`/comments/${commentId}/post`);
    if (!response.ok) {
        console.error('게시글을 가져오는 데 오류가 발생했습니다:', response.status);
        return;
    }

    const post = await response.json();
    
    // 게시물 내용 표시
    const postElement = document.createElement('div');
    postElement.innerHTML = `
        <p><strong>제목: ${post.title}</strong></p>
        <p><strong>작성자: ${post.userName}</strong></p>
        <p>${post.content}</p>
        <p>작성일: ${new Date(post.createdAt).toLocaleString()}</p>
    `;
    postContainer.appendChild(postElement);
    }


    //  DOMContentLoaded 이벤트를 통해 페이지 로드 시 사용자 댓글 로드
    document.addEventListener('DOMContentLoaded', async () => {
        const currentUser = await fetchCurrentUser();
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            window.location.href = '/user/login';
        } else {
            loadUserComments(); // 사용자 게시물 로드
        }

    document.addEventListener('DOMContentLoaded', async () => {
        if (isUserLoggedIn()) {
            await loadUserComments(); // 사용자 댓글 목록 로드
        } else {
            alert('로그인이 필요합니다.');
        }
    });


});