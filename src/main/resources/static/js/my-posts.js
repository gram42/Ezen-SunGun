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

// 사용자가 작성한 게시물 목록 로드
async function loadUserPosts() {
    const currentUser = await fetchCurrentUser(); // 현재 사용자 정보 로드
    if (currentUser) {
        const userId = currentUser.id; 
        console.log(`사용자 ${userId}의 게시물 로드 요청`);

        const response = await fetch(`/posts/user/${userId}`, {
            method: 'GET',
            credentials: 'include' // 세션 쿠키 포함
        });

        if (!response.ok) {
            const errorText = await response.text(); // 오류 메시지
            console.error(`Error response: ${errorText}`); // 오류 메시지 출력
            alert(`게시물 로드 실패: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const posts = data.content;
        console.log('사용자 게시물:', posts);

        const myPostsList = document.getElementById('myPostsList');
        myPostsList.innerHTML = '';

        if (posts.length === 0) {
            myPostsList.innerHTML = '<p>작성한 게시물이 없습니다.</p>';
        } else {
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.style.border = '1px solid #ccc'; // 테두리 추가
                postDiv.style.borderRadius = '5px'; // 모서리 둥글게
                postDiv.style.padding = '10px'; // 패딩 추가
                postDiv.style.margin = '10px 0'; // 마진 추가
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p>
                    <p>작성자: ${post.userName || '정보 없음'} | 작성 시간: ${new Date(post.createdAt).toLocaleString()}</p>
                    <button onclick="loadPostDetail(${post.postId})">상세보기</button>
                    <button onclick="editPost(${post.postId})">수정</button>
                    <button onclick="deletePost(${post.postId})">삭제</button>
                `;
                myPostsList.appendChild(postDiv);
            });
        }
    } else {
        console.log('로그인되지 않은 상태입니다.');
    }
}

let editingPostId = null; // 수정할 게시물 ID 저장 변수

// 게시물 수정 함수
function editPost(postId) {
    // 수정할 게시글 데이터를 가져와서 수정 모달에 표시
    fetch(`/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            editingPostId = postId; // 수정할 게시글의 ID 저장
            document.getElementById('newTitle').value = data.title;
            document.getElementById('newContent').value = data.content;
            document.getElementById('editModal').style.display = 'block'; // 수정 모달 열기
        })
        .catch(error => console.error('Error fetching post:', error));
}

// 수정 저장 함수
function submitEdit() {
    const title = document.getElementById('newTitle').value;
    const content = document.getElementById('newContent').value;

    if (!title || !content) {
        alert("제목과 내용을 입력해주세요.");
        return;
    }

  // 수정된 게시글 저장
  fetch(`/posts/${editingPostId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
})
.then(response => {
    if (response.ok) {
        alert('게시글 수정 성공');
        document.getElementById('editModal').style.display = 'none'; // 수정 모달 닫기
        loadUserPosts(); // 수정 후 게시글 목록 새로고침
    } else {
        throw new Error('수정 실패');
    }
})
.catch(error => {
    console.error('Error:', error);
    alert('수정 실패');
});
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none'; // 모달 닫기
}

// 수정 모달 닫기 기능
document.getElementById('closeEditModal').addEventListener('click', function() {
    document.getElementById('editModal').style.display = 'none'; // 수정 모달 닫기
});

// 저장 버튼 클릭 시 수정 내용 서버로 전송
document.getElementById('saveChangesBtn').addEventListener('click', submitEdit);

// 게시물 삭제 함수
async function deletePost(postId) {
    if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
        const response = await fetch(`/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert('게시물이 삭제되었습니다.');
            loadUserPosts(); // 게시물 목록 새로 고침
        } else {
            const errorText = await response.text();
            console.error(`게시물 삭제 실패: ${errorText}`);
            alert(`게시물 삭제 실패: ${errorText}`);
        }
    }
}

// 게시물 상세보기 로드
async function loadPostDetail(postId) {
    if (!postId) {
        console.error('게시물 ID가 정의되지 않았습니다.');
        alert('게시물 ID가 정의되지 않았습니다.');
        return;
    }
    console.log(`게시물 상세보기 요청: ${postId}`);
    const response = await fetch(`/posts/${postId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // HTML 요소에 값을 설정
    const postTitleElem = document.getElementById('postTitle');
    const postContentElem = document.getElementById('postContent');
    const userNameElem = document.getElementById('userName');
    const createdAtElem = document.getElementById('createdAt');

    // 요소들이 null이 아닌지 확인
    if (postTitleElem && postContentElem && userNameElem && createdAtElem) {
        postTitleElem.textContent = `제목: ${data.title}`;
        postContentElem.textContent = `상세내용: ${data.content}`;
        userNameElem.textContent = data.userName || '작성자 정보 없음'; // 작성자 정보가 없을 경우 처리
        createdAtElem.textContent = new Date(data.createdAt).toLocaleString();

        // 상세보기 모달 표시
        const modal = document.getElementById('postModal');
        modal.style.display = 'block'; // 모달 열기

        // 모달 닫기 버튼 이벤트
        document.getElementById('closeModal').onclick = function() {
            modal.style.display = 'none';
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        const currentUserData = await fetchCurrentUser();

        if (!currentUserData) {
            document.getElementById('submitComment').style.display = 'none';
        } else {
            // 현재 사용자와 게시물 작성자 비교
            if (data.userId === currentUserData.id) {
                document.getElementById('editPostButton').style.display = 'inline-block';
                document.getElementById('deletePostButton').style.display = 'inline-block';

                 // 버튼 클릭 시 이벤트 핸들러 설정
                document.getElementById('editPostButton').onclick = () => editPost(data.postId); // 수정 버튼 클릭 시 수정 함수 호출
                document.getElementById('deletePostButton').onclick = () => deletePost(data.postId); // 삭제 버튼 클릭 시 삭제 함수 호출
            } else {
                // 비작성자의 경우 버튼 숨김
                document.getElementById('editPostButton').style.display = 'none';
                document.getElementById('deletePostButton').style.display = 'none';
            }
        }

        loadComments(postId); // 댓글 로드 함수 호출


    } else {
        console.error('상세보기 요소를 찾을 수 없습니다.');
    }
}

// 댓글을 로드하여 모달에 표시하는 함수
async function loadComments(postId) {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = ''; // 기존 댓글 초기화

    console.log('Loading comments for post ID:', postId); // postId 로그 추가
    const response = await fetch(`/comments/post/${postId}`);
    if (!response.ok) {
        console.error('댓글을 가져오는 데 오류가 발생했습니다:', response.status);
        return;
    }

    const comments = await response.json();
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.innerHTML = `
            <p><strong>${comment.userName}:</strong> ${comment.commentText}</p>
            <p>작성일: ${new Date(comment.createdAt).toLocaleString()}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// DOMContentLoaded 이벤트를 통해 사용자 게시물 로드
document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = await fetchCurrentUser();
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        window.location.href = '/user/login';
    } else {
        loadUserPosts(); // 사용자 게시물 로드
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (isUserLoggedIn()) {
            await loadUserComments(); // 사용자 댓글 목록 로드
        } else {
            alert('로그인이 필요합니다.');
        }
    });


    // '뒤로가기' 버튼 클릭 이벤트
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back(); // 이전 페이지로 돌아가기
    });
});
