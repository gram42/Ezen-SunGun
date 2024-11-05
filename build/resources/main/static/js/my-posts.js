<<<<<<< HEAD
let currentPage = 1; // 현재 페이지
const postsPerPage = 6; // 한 페이지에 게시물 수
const pagesPerSection = 5;
let totalPosts = 0; // 전체 게시물 수

const commentsPerPage = 5;
let totalComments = 0; 



=======
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
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
<<<<<<< HEAD
async function loadUserPosts(page = 1) {
=======
async function loadUserPosts() {
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
    const currentUser = await fetchCurrentUser(); // 현재 사용자 정보 로드
    if (currentUser) {
        const userId = currentUser.id; 
        console.log(`사용자 ${userId}의 게시물 로드 요청`);

<<<<<<< HEAD
        const response = await fetch(`/posts/user/${userId}?page=${page - 1}&size=${postsPerPage}`, {
=======
        const response = await fetch(`/posts/user/${userId}`, {
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
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
<<<<<<< HEAD
        const posts = data.content || [];
        totalPosts = data.totalElements; // 전체 게시물 수 저장
=======
        const posts = data.content;
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
        console.log('사용자 게시물:', posts);

        const myPostsList = document.getElementById('myPostsList');
        myPostsList.innerHTML = '';
<<<<<<< HEAD
        
=======

>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
        if (posts.length === 0) {
            myPostsList.innerHTML = '<p>작성한 게시물이 없습니다.</p>';
        } else {
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
<<<<<<< HEAD
                
                postDiv.innerHTML = `
                    <h3 class="post-title">${post.title.length > 10 ? post.title.substring(0, 10) + '...' : post.title}</h3>
                    <p class="post-preview">${post.content.length > 20 ? post.content.substring(0, 20) + '...' : post.content}</p>
                    <div class="post-info">
                        <p class="comment-count">댓글 수: ${post.commentCount || 0}</p>
                        <p class="post-time">작성 시간: ${new Date(post.createdAt).toLocaleString()}</p>
                    
                    <div class="post-buttons-container">
                        <div class="post-buttons">
                            <button onclick="loadPostDetail(${post.postId})">상세보기</button>
                            <button onclick="editPost(${post.postId})">수정</button>
                            <button onclick="deletePost(${post.postId})">삭제</button>
                        </div>
                    </div>
                     </div>
                `;
                
                myPostsList.appendChild(postDiv);
            });
            updatePagination(); // 페이지네이션 업데이트
=======
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
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
        }
    } else {
        console.log('로그인되지 않은 상태입니다.');
    }
}
<<<<<<< HEAD
// 페이지네이션 업데이트 함수
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    const totalPages = Math.ceil(totalPosts / postsPerPage);

   // 이전 섹션 버튼
    const prevSectionButton = document.getElementById('prevSectionButton');
    const isFirstSection = Math.floor((currentPage - 1) / pagesPerSection) === 0;

    // 첫 번째 섹션일 경우 이전 섹션 버튼을 보이게 하되, 첫 페이지일 경우에는 숨기기
    prevSectionButton.style.display = (isFirstSection && currentPage === 1) ? 'none' : 'inline-block';

    prevSectionButton.onclick = (event) => {
        event.preventDefault();
        const prevSectionLastPage = Math.max(1, Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection); // 이전 섹션의 마지막 페이지
        currentPage = prevSectionLastPage; // 이전 섹션의 마지막 페이지로 이동
        loadUserPosts(currentPage);
    };




    // 이전 페이지 버튼
    const prevButton = document.getElementById('prevButton');
    prevButton.style.display = currentPage > 1 ? 'inline-block' : 'none';
    prevButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            console.log("Current Page:", currentPage);
            loadUserPosts(currentPage);
        }
    };

    // 페이지 번호 버튼들
    for (let i = 1; i <= totalPages; i++) {
        if (i > (Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection) && i <= (Math.floor((currentPage - 1) / pagesPerSection) + 1) * pagesPerSection) {
            const pageSpan = document.createElement('a');
            pageSpan.textContent = i;
            pageSpan.className = 'pagination-button';
            if (i === currentPage) {
                pageSpan.classList.add('active');
            }
            pageSpan.onclick = () => {
                currentPage = i;
                loadUserPosts(currentPage);
            };
            pageNumbers.appendChild(pageSpan);
        }
    }

    // 다음 페이지 버튼
    const nextButton = document.getElementById('nextButton');
    nextButton.style.display = currentPage < totalPages ? 'inline-block' : 'none';
    nextButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            loadUserPosts(currentPage);
        }
    };
    // 다음 섹션 버튼
    const nextSectionButton = document.getElementById('nextSectionButton');
    nextSectionButton.style.display = currentPage < totalPages ? 'inline-block' : 'none';
    nextSectionButton.onclick = (event) => {
        event.preventDefault();
        const nextSectionFirstPage = Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection + pagesPerSection + 1; // 현재 섹션의 마지막 페이지 +1
        console.log("Next Section First Page:", nextSectionFirstPage);

        if (nextSectionFirstPage <= totalPages) {
            currentPage = nextSectionFirstPage; // 다음 섹션의 첫 페이지로 이동
            loadUserPosts(currentPage);
        } else {
            currentPage = totalPages; // 다음 섹션이 없으면 마지막 페이지로 이동
            loadUserPosts(currentPage);
        }
    };


    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}
=======
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275

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

// 입력 필드 글자 수 체크
function validateInput() {
    const titleInput = document.getElementById('newTitle');
    const contentInput = document.getElementById('newContent');
    const titleAlert = document.getElementById('titleAlert');
    const contentAlert = document.getElementById('contentAlert');

    // 제목 글자 수 체크
    if (titleInput.value.length >= 100) {
        titleAlert.style.display = 'block';
        titleInput.value = titleInput.value.substring(0, 100); // 100자 초과 시 잘라내기
    } else {
        titleAlert.style.display = 'none';
    }

    // 내용 글자 수 체크
    if (contentInput.value.length >= 1000) {
        contentAlert.style.display = 'block';
        contentInput.value = contentInput.value.substring(0, 1000); // 1000자 초과 시 잘라내기
    } else {
        contentAlert.style.display = 'none';
    }
}

// 입력 필드에서 실시간 체크
document.getElementById('newTitle').addEventListener('input', validateInput);
document.getElementById('newContent').addEventListener('input', validateInput);


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
<<<<<<< HEAD
        userNameElem.textContent = `작성자: ${data.userName}` || '작성자 정보 없음'; // 작성자 정보가 없을 경우 처리
=======
        userNameElem.textContent = data.userName || '작성자 정보 없음'; // 작성자 정보가 없을 경우 처리
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
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
<<<<<<< HEAD
=======
                document.getElementById('goToPostButton').style.display = 'inline-block';
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275

                 // 버튼 클릭 시 이벤트 핸들러 설정
                document.getElementById('editPostButton').onclick = () => editPost(data.postId); // 수정 버튼 클릭 시 수정 함수 호출
                document.getElementById('deletePostButton').onclick = () => deletePost(data.postId); // 삭제 버튼 클릭 시 삭제 함수 호출
<<<<<<< HEAD
=======
                document.getElementById('goToPostButton').onclick = () => window.location.href = `/community/postDetail/${postId}`; // 해당 게시물 페이지로 이동
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
            } else {
                // 비작성자의 경우 버튼 숨김
                document.getElementById('editPostButton').style.display = 'none';
                document.getElementById('deletePostButton').style.display = 'none';
<<<<<<< HEAD
            }
        }

        loadComments(postId); // 댓글 로드 함수 호출
=======
                document.getElementById('goToPostButton').style.display = 'none';
            }
        }


>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275


    } else {
        console.error('상세보기 요소를 찾을 수 없습니다.');
    }
}

<<<<<<< HEAD
// 댓글을 로드하여 모달에 표시하는 함수
async function loadComments(postId, page = 1) {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = ''; // 기존 댓글 초기화
    currentPage = page;

    console.log('Loading comments for post ID:', postId); // postId 로그 추가
    const response = await fetch(`/comments/post/${postId}?page=${page - 1}&size=${commentsPerPage}`);
    if (!response.ok) {
        console.error('댓글을 가져오는 데 오류가 발생했습니다:', response.status);
        return;
    }
    
    const data = await response.json(); // 응답을 JSON으로 파싱
    console.log('API 응답:', data); // 응답 로그 추가

    const { comments, total } = data; // comments와 total 속성 추출
    totalComments = total; // 총 댓글 수 할당

    if (!Array.isArray(comments)) {
        console.error('댓글 배열이 유효하지 않습니다:', comments);
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.innerHTML = `
            <p><strong>${comment.userName}:</strong> ${comment.commentText}</p>
            <p>작성일: ${new Date(comment.createdAt).toLocaleString()}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
    updateCommentsPagination(postId);
}

function updateCommentsPagination(postId) {
    const commentsPagination = document.getElementById('commentsPagination');
    const commentPageNumbers = document.getElementById('commentPageNumbers');
    commentPageNumbers.innerHTML = '';
    const totalCommentPages = Math.ceil(totalComments / commentsPerPage); // 총 페이지 수 계산

    commentsPagination.style.display = 'flex'; // 항상 페이지네이션 표시

    // 이전 섹션 버튼
    const prevCommentSectionButton = document.getElementById('prevCommentSectionButton');
    const isFirstSection = Math.floor((currentPage - 1) / pagesPerSection) === 0;
    prevCommentSectionButton.style.display = (isFirstSection && currentPage === 1) ? 'none' : 'inline-block';

    prevCommentSectionButton.onclick = (event) => {
        event.preventDefault();
        const prevSectionLastPage = Math.max(1, Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection);
        loadComments(postId, prevSectionLastPage);
    };

    // 이전 페이지 버튼
    const prevCommentButton = document.getElementById('prevCommentButton');
    prevCommentButton.style.display = currentPage > 1 ? 'inline-block' : 'none';
    prevCommentButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage > 1) loadComments(postId, currentPage - 1);
    };

    // 페이지 번호 버튼들
    for (let i = 1; i <= totalCommentPages; i++) {
        if (i > Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection && 
            i <= (Math.floor((currentPage - 1) / pagesPerSection) + 1) * pagesPerSection) {
            const pageSpan = document.createElement('a');
            pageSpan.textContent = i;
            pageSpan.className = 'pagination';
            if (i === currentPage) pageSpan.classList.add('active');
            pageSpan.onclick = () => loadComments(postId, i);
            commentPageNumbers.appendChild(pageSpan);
        }
    }

    // 다음 페이지 버튼
    const nextCommentButton = document.getElementById('nextCommentButton');
    nextCommentButton.style.display = currentPage < totalCommentPages ? 'inline-block' : 'none';
    nextCommentButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalCommentPages) loadComments(postId, currentPage + 1);
    };

    // 다음 섹션 버튼
    const nextCommentSectionButton = document.getElementById('nextCommentSectionButton');
    nextCommentSectionButton.style.display = currentPage < totalCommentPages ? 'inline-block' : 'none';
    nextCommentSectionButton.onclick = (event) => {
        event.preventDefault();
        const nextSectionFirstPage = Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection + pagesPerSection + 1;
        loadComments(postId, Math.min(nextSectionFirstPage, totalCommentPages));
    };

}

=======
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
// DOMContentLoaded 이벤트를 통해 사용자 게시물 로드
document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = await fetchCurrentUser();
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        window.location.href = '/user/login';
    } else {
        loadUserPosts(); // 사용자 게시물 로드
    }

<<<<<<< HEAD
    document.addEventListener('DOMContentLoaded', async () => {
        if (isUserLoggedIn()) {
            await loadUserComments(); // 사용자 댓글 목록 로드
        } else {
            alert('로그인이 필요합니다.');
        }
    });



=======
    // '뒤로가기' 버튼 클릭 이벤트
    document.getElementById('backButton').addEventListener('click', () => {
        window.history.back(); // 이전 페이지로 돌아가기
    });
>>>>>>> 80ab171c6c4e44fb027024ab229cdbe9e971f275
});
