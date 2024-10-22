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
function logout() {
    console.log('로그아웃 시도'); // 로그아웃 시도 로그
    // 세션 초기화
    fetch('/user/logout', { method: 'POST' }); // 로그아웃 API 호출
    localStorage.removeItem('currentUserId'); // 사용자 ID 제거
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

        // 올바른 URL로 수정
        const response = await fetch(`/posts/user/${userId}`, {
            method: 'GET',
            credentials: 'include' // 세션 쿠키 포함
        });

        if (!response.ok) {
            const errorText = await response.text(); // 오류 메시지
            console.error(`Error response: ${errorText}`); // 오류 메시지 출력
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
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p>
                    <p>작성자: ${post.userName} | 작성 시간: ${new Date(post.createdAt).toLocaleString()}</p>
                    <button onclick="loadPostDetail(${post.id})">상세보기</button>
                `;
                myPostsList.appendChild(postDiv);
            });
        }
    } else {
        console.log('로그인되지 않은 상태입니다.');
    }
}

// 게시물 상세보기 로드
async function loadPostDetail(postId) {
    console.log(`게시물 상세보기 요청: ${postId}`); // 게시물 상세보기 요청 로그
    const response = await fetch(`/posts/${postId}`, {
        method: 'GET',
        credentials: 'include' // 세션 쿠키 포함
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    document.getElementById('postTitle').textContent = `제목: ${data.title}`;
    document.getElementById('postContent').textContent = `상세내용: ${data.content}`;
    document.getElementById('userName').textContent = data.userName;
    document.getElementById('createdAt').textContent = new Date(data.createdAt).toLocaleString();

    const currentUserData = await fetchCurrentUser();

    if (!currentUserData) {
        document.getElementById('submitComment').style.display = 'none';
    } else {
        // 현재 사용자와 게시물 작성자 비교
        if (data.userId === currentUserData.id) {
            document.getElementById('editPostButton').style.display = 'inline-block';
            document.getElementById('deletePostButton').style.display = 'inline-block';
        } else {
            document.getElementById('editPostButton').style.display = 'none';
            document.getElementById('deletePostButton').style.display = 'none';
        }
    }
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

    // '뒤로가기' 버튼 클릭 이벤트
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back(); // 이전 페이지로 돌아가기
    });
});
