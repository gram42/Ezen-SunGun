let currentPage = 1;
const postsPerPage = 4;
const pagesPerSection = 5; // 한 섹션당 페이지 수
let totalPosts = 0;
let currentPostId = null;
let loadedPosts = [];

async function loadPosts(page = 1) {
    try {
        document.getElementById('loadingMessage').style.display = 'block'; // 로딩 메시지 표시

        // 게시글 목록 API 호출
        const response = await fetch(`/posts?page=${page - 1}&size=${postsPerPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const posts = data.content || [];
        totalPosts = data.totalElements;

        // 로드된 게시물 업데이트
        loadedPosts = posts;
        console.log(data); // API 응답 확인
        console.log(`현재 로드된 게시물: ${JSON.stringify(loadedPosts)}`);
        console.log('현재 페이지:', page); // 현재 페이지
        console.log('총 게시물 수:', totalPosts); // 총 게시물 수
        console.log('현재 로드된 게시물 수:', loadedPosts.length); // 현재 로드된 게시물 수.

        const postsList = document.getElementById('postsList');
        postsList.innerHTML = ''; // 기존 게시글 목록 초기화

        // 게시글 목록 생성
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.style.cursor = 'pointer';   // 커서 포인터로 설정

            // 게시글 제목
            const title = document.createElement('h3');
            title.textContent = post.title;

            // 게시물 박스 클릭 시 상세보기로 이동
            postDiv.addEventListener('click', () => {
                currentPostId = post.postId;
                loadPostDetail(currentPostId); // 게시글 상세보기로 이동
            });

            // 게시글 내용 미리보기
            const preview = document.createElement('p');
            preview.textContent = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;

            // 댓글 수 표시
            const postInfo = document.createElement('div');
            postInfo.className = 'post-info';

            const commentCount = document.createElement('span');
            commentCount.textContent = `댓글 수: ${post.commentCount || 0}`;
            postInfo.appendChild(commentCount); // 댓글 수 추가

            // 작성자 표시
            const userName = document.createElement('span');
            userName.className = 'user-name';
            userName.textContent = `작성자: ${post.userName}`;
            postInfo.appendChild(userName); // 작성자 추가

            // 게시물 구성
            postDiv.appendChild(title);
            postDiv.appendChild(preview);
            postDiv.appendChild(postInfo);

            postsList.appendChild(postDiv); // 목록에 게시글 추가
            postsList.style.display = 'flex'; 
        });

        updatePagination(); // 페이지네이션 업데이트
    } catch (error) {
        // 오류 발생 시 오류 메시지 표시
        document.getElementById('errorMessage').textContent = "게시글을 불러오는 데 실패했습니다.";
        console.error("게시글을 불러오는 데 실패했습니다.", error);
    } finally {
        document.getElementById('loadingMessage').style.display = 'none'; // 로딩 메시지 숨김
    }
}



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

    prevSectionButton.onclick = () => {
        const prevSectionLastPage = Math.max(1, Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection); // 이전 섹션의 마지막 페이지
        currentPage = prevSectionLastPage; // 이전 섹션의 마지막 페이지로 이동
        loadPosts(currentPage);
    };




    // 이전 페이지 버튼
    const prevButton = document.getElementById('prevButton');
    prevButton.style.display = currentPage > 1 ? 'inline-block' : 'none';
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            console.log("Current Page:", currentPage);
            loadPosts(currentPage);
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
                loadPosts(currentPage);
            };
            pageNumbers.appendChild(pageSpan);
        }
    }

    // 다음 페이지 버튼
    const nextButton = document.getElementById('nextButton');
    nextButton.style.display = currentPage < totalPages ? 'inline-block' : 'none';
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPosts(currentPage);
        }
    };
    // 다음 섹션 버튼
    const nextSectionButton = document.getElementById('nextSectionButton');
    nextSectionButton.style.display = currentPage < totalPages ? 'inline-block' : 'none';
    nextSectionButton.onclick = () => {
        const nextSectionFirstPage = Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection + pagesPerSection + 1; // 현재 섹션의 마지막 페이지 +1
        console.log("Next Section First Page:", nextSectionFirstPage);

        if (nextSectionFirstPage <= totalPages) {
            currentPage = nextSectionFirstPage; // 다음 섹션의 첫 페이지로 이동
            loadPosts(currentPage);
        } else {
            currentPage = totalPages; // 다음 섹션이 없으면 마지막 페이지로 이동
            loadPosts(currentPage);
        }
    };


    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

// 게시글 상세 보기 시 현재 사용자와 비교하여 댓글 작성 및 수정/삭제 버튼 처리
async function loadPostDetail(postId) {
try {
const response = await fetch(`/posts/${postId}`);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();

document.getElementById('postTitle').textContent = `제목: ${data.title}`;
document.getElementById('postContent').textContent = `상세내용: ${data.content}`;
document.getElementById('userName').textContent = data.userName; // 작성자 이름 업데이트
document.getElementById('createdAt').textContent = new Date(data.createdAt).toLocaleString(); // 작성 시간 업데이트

// 현재 사용자 정보를 다시 가져옴
const currentUserData = await fetchCurrentUser();

// 로그인하지 않은 경우 댓글 작성 버튼 숨기기
if (!currentUserData) {
    document.getElementById('submitComment').style.display = 'none';
} else {
    // 작성자와 현재 사용자가 동일한 경우에만 수정 및 삭제 버튼을 표시
    if (data.userId === currentUserData.id) {
        document.getElementById('editPostButton').style.display = 'inline-block';
        document.getElementById('deletePostButton').style.display = 'inline-block';
    } else {
        document.getElementById('editPostButton').style.display = 'none';
        document.getElementById('deletePostButton').style.display = 'none';
    }
}

document.getElementById('postDetail').style.display = 'block';
document.getElementById('postsList').style.display = 'none';
document.querySelector('.question-box').style.display = 'none';
document.getElementById('writeBox').style.display = 'none';
loadComments(postId);
document.getElementById('pagination').style.display = 'none';

// 검색 기능 숨기기
const searchContainer = document.getElementById('searchContainer'); 
if (searchContainer) {
    searchContainer.style.display = 'none'; // 상세보기에서 검색 컨테이너 숨기기
}
} catch (error) {
document.getElementById('errorMessage').textContent = "게시글 상세 정보를 불러오는 데 실패했습니다.";
console.error("게시글 상세 정보를 불러오는 데 실패했습니다.", error);
}
}

document.getElementById('editPostButton').onclick = async () => {
const newTitle = prompt("새 제목을 입력하세요:", document.getElementById('postTitle').textContent.replace('제목: ', ''));
const newContent = prompt("새 내용을 입력하세요:", document.getElementById('postContent').textContent.replace('상세내용: ', ''));

if (newTitle && newContent) {
try {
    const response = await fetch(`/posts/${currentPostId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 제목과 내용 업데이트
    document.getElementById('postTitle').textContent = `제목: ${newTitle}`;
    document.getElementById('postContent').textContent = `상세내용: ${newContent}`;
} catch (error) {
    document.getElementById('errorMessage').textContent = "게시물 수정에 실패했습니다.";
    console.error("게시물 수정에 실패했습니다.", error);
}
}
};

document.getElementById('deletePostButton').onclick = async () => {
if (confirm("정말로 삭제하시겠습니까?")) {
try {
    const response = await fetch(`/posts/${currentPostId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 커뮤니티 페이지로 전환
    document.getElementById('postDetail').style.display = 'none'; // 상세 페이지 숨기기
    document.getElementById('postsList').style.display = 'block'; // 게시물 목록 보여주기
    loadPosts(currentPage); // 커뮤니티 게시물 로드
    document.querySelector('.question-box').style.display = 'block'; // 질문 박스 보여주기
    document.getElementById('writeBox').style.display = 'block'; // 글쓰기 박스 보여주기
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
        searchContainer.style.display = 'block'; // 검색 컨테이너를 보이게 설정
    }
} catch (error) {
    document.getElementById('errorMessage').textContent = "게시물 삭제에 실패했습니다.";
    console.error("게시물 삭제에 실패했습니다.", error);
}
}
};


let currentUserId = null; // currentUserId를 정의합니다.

async function fetchCurrentUser() {
try {
const response = await fetch('http://localhost:9090/user/current', {
    method: 'GET',
    credentials: 'include' // 쿠키를 포함시켜 인증 정보를 보냄
});

const writePostButton = document.getElementById('writePostButton');
const submitCommentButton = document.getElementById('submitComment');
const commentText = document.getElementById('commentText');
const myPostsButton = document.getElementById('myPostsButton'); // 내가 쓴 게시물 보기 버튼
const myCommentsButton = document.getElementById('myCommentsButton'); // 댓글 보기 버튼

if (!response.ok) {
    if (response.status === 401) {
        // 로그인하지 않은 경우 글쓰기 및 댓글 작성 버튼 숨기기
        console.warn('사용자가 로그인하지 않았습니다.');
        writePostButton.style.display = 'none'; // 글쓰기 버튼 숨기기
        submitCommentButton.style.display = 'none'; // 댓글 작성 버튼 숨기기
        commentText.style.display = 'none';
        myPostsButton.style.display = 'none'; // 내가 쓴 게시물 보기 버튼 숨기기
        myCommentsButton.style.display = 'none'; // 댓글 보기 버튼 숨기기
        return null; // 사용자에게 알림을 표시하거나 null 반환
    }
    throw new Error(`HTTP error! status: ${response.status}`);
}

const user = await response.json();
currentUserId = user.id; // 현재 사용자 ID 설정

// 로그인 상태에 따라 버튼 표시/숨기기
writePostButton.style.display = 'inline-block'; // 글쓰기 버튼 보이기
submitCommentButton.style.display = 'inline-block'; // 댓글 작성 버튼 보이기
commentText.style.display = 'block'; // 댓글 입력 필드 보이기
myPostsButton.style.display = 'inline-block'; // 내가 쓴 게시물 보기 버튼 보이기
myCommentsButton.style.display = 'inline-block'; // 댓글 보기 버튼 보이기
return user; // 로그인한 사용자 정보 반환
} catch (error) {
console.error('사용자 정보를 불러오는 데 실패했습니다.', error);
const writePostButton = document.getElementById('writePostButton');
const submitCommentButton = document.getElementById('submitComment');
writePostButton.style.display = 'none'; // 글쓰기 버튼 숨기기
submitCommentButton.style.display = 'none'; // 댓글 작성 버튼 숨기기
commentText.style.display = 'none'; // 댓글 입력 필드 숨기기
myPostsButton.style.display = 'none'; // 내가 쓴 게시물 보기 버튼 숨기기
myCommentsButton.style.display = 'none'; // 댓글 보기 버튼 숨기기



return null; // 에러 발생 시 null 반환
}
}







// 페이지 로드 시 사용자 정보를 불러오기
document.addEventListener('DOMContentLoaded', fetchCurrentUser);


async function loadComments(postId) {
try {
const response = await fetch(`/posts/${postId}/comments`);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const comments = await response.json();
const commentsList = document.getElementById('commentsList');
commentsList.innerHTML = '';

comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const commentContent = document.createElement('p');
    commentContent.id = 'commentContent';
    commentContent.textContent = comment.commentText;

    const commentAuthor = document.createElement('p');
    commentAuthor.id = 'commentAuthor';
    commentAuthor.innerHTML = `작성자: <span>${comment.userName}</span>`;

    const commentCreatedAt = document.createElement('p');
    commentCreatedAt.id = 'commentCreatedAt';
    commentCreatedAt.innerHTML = `작성 시간: <span>${comment.createdAt}</span>`;

    const editDeleteDiv = document.createElement('div');
    editDeleteDiv.className = 'edit-delete';

    // 작성자와 현재 사용자가 같을 때만 수정 및 삭제 버튼을 추가
    if (comment.userId === currentUserId) {
        editDeleteDiv.innerHTML = `
            <span style="cursor: pointer; color: blue;" onclick="editComment(${comment.commentsId})">수정</span>
            <span style="cursor: pointer; color: red;" onclick="deleteComment(${comment.commentsId})">삭제</span>
        `;
    }

    // 댓글 내용을 추가
    commentDiv.appendChild(commentAuthor);
    commentDiv.appendChild(commentContent);
    commentDiv.appendChild(commentCreatedAt);
    commentDiv.appendChild(editDeleteDiv);
    commentsList.appendChild(commentDiv);
});
} catch (error) {
document.getElementById('errorMessage').textContent = "댓글을 불러오는 데 실패했습니다.";
console.error("댓글을 불러오는 데 실패했습니다.", error);
}
}


// 페이지 로드 시 현재 사용자 정보를 불러옵니다.
fetchCurrentUser();




async function editComment(commentId) {
    const newCommentText = prompt("댓글을 수정하세요:");
    if (newCommentText) {
        try {
            const response = await fetch(`/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentText: newCommentText }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            loadComments(currentPostId);
        } catch (error) {
            document.getElementById('errorMessage').textContent = "댓글 수정에 실패했습니다.";
            console.error("댓글 수정에 실패했습니다.", error);
        }
    }
}

async function deleteComment(commentId) {
    if (confirm("정말로 삭제하시겠습니까?")) {
        try {
            const response = await fetch(`/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            loadComments(currentPostId);
        } catch (error) {
            document.getElementById('errorMessage').textContent = "댓글 삭제에 실패했습니다.";
            console.error("댓글 삭제에 실패했습니다.", error);
        }
    }
}

document.getElementById('backButton').onclick = () => {
    document.getElementById('postDetail').style.display = 'none';
    document.getElementById('postsList').style.display = 'block';
    document.querySelector('.question-box').style.display = 'block';
    document.getElementById('writeBox').style.display = 'block';
    loadPosts(currentPage);
};

document.getElementById('submitComment').onclick = async () => {
    const commentText = document.getElementById('commentText').value;
    if (commentText) {
        try {
            const response = await fetch(`/posts/${currentPostId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentText }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            document.getElementById('commentText').value = '';
            loadComments(currentPostId);
        } catch (error) {
            document.getElementById('errorMessage').textContent = "댓글 작성에 실패했습니다.";
            console.error("댓글 작성에 실패했습니다.", error);
        }
    }
};

// 페이지 로드 시 초기화
window.onload = () => {
    loadPosts(currentPage);
};




// 드롭다운 토글 함수
function toggleDropdown(event) {
    event.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 방지
    const searchOptions = document.getElementById("searchOptions");
    searchOptions.style.display = searchOptions.style.display === "block" ? "none" : "block"; // 드롭다운 메뉴 열기/닫기
}

// 드롭다운에서 검색 기준 선택
function selectSearchCriteria(criteria) {
    const dropdownButton = document.getElementById("dropdownButton");
    const searchOptions = document.getElementById("searchOptions");

    // 선택한 검색 기준에 따라 버튼 텍스트 변경
    const criteriaText = {
        title: "제목으로 검색 ▼",
        author: "작성자로 검색 ▼",
        comment: "댓글 내용으로 검색 ▼"
    };

    dropdownButton.textContent = criteriaText[criteria] || criteriaText.comment;

    // 드롭다운 숨김
    searchOptions.style.display = "none"; // 옵션 선택 후 드롭다운 닫음
}

// 검색 버튼 클릭 시 게시물 검색
document.getElementById('searchButton').addEventListener('click', searchPosts);


// 게시물 검색
async function searchPosts() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const dropdownButton = document.getElementById('dropdownButton');
    
    // 선택된 검색 기준에 따라 searchCriteria 설정
    const criteriaMap = {
        "제목으로 검색 ▼": 'title',
        "작성자로 검색 ▼": 'author',
        "댓글 내용으로 검색 ▼": 'comment'
    };

    const searchCriteria = criteriaMap[dropdownButton.textContent] || '';

    // 입력값이 없으면 요청하지 않도록 처리
    if (!searchInput) {
        document.getElementById('postsList').innerHTML = ""; // 결과를 초기화
        currentPage = 1; // 현재 페이지를 1로 설정
        loadPosts(currentPage); // 첫 페이지 게시물 로드
        return; // 입력값이 없으면 함수 종료
    }

    const queryParameters = new URLSearchParams();
    queryParameters.append(searchCriteria, encodeURIComponent(searchInput));

    try {
        const requestURL = `/posts/search?${queryParameters.toString()}`;
        const response = await fetch(requestURL);
        
        if (!response.ok) {
            throw new Error("서버 오류 발생");
        }

        const data = await response.json();

        // data.content가 배열인지 확인하고 displaySearchResults 호출
        if (Array.isArray(data.content)) {
            displaySearchResults(data.content); // 검색 결과 표시 함수 호출
        } else {
            console.error("검색 결과가 배열이 아닙니다:", data); // 오류 로그 추가
            displaySearchResults([]); // 배열이 아닐 경우 빈 배열 전달
        }

    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        document.getElementById('errorMessage').textContent = "검색 중 오류가 발생했습니다. 다시 시도해 주세요.";
    }
}

// 검색 결과 게시물만 표시하는 함수
function displaySearchResults(posts) {
    const postsContainer = document.getElementById("postsList"); // 게시물 목록을 표시할 컨테이너 ID
    postsContainer.innerHTML = ""; // 기존 게시물 목록 초기화

    // 검색 결과가 없을 때 처리
    if (!Array.isArray(posts) || posts.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "검색 결과가 없습니다."; // 결과가 없을 경우 메시지
        postsContainer.appendChild(noResultsMessage);
        return; // 결과가 없으면 함수 종료
    }

    // 검색 결과가 있을 때 게시물 생성
    posts.forEach(post => {
        // 게시물 ID가 정의되지 않았을 때
        if (!post.postId) { // post.id 대신 post.postId 사용
            console.error("게시물 ID가 정의되지 않았습니다:", post); // ID가 없을 경우 오류 로그
            return; // ID가 없으면 해당 게시물 생성을 건너뜀
        }

        const postElement = document.createElement("div");
        postElement.className = "post"; // 게시물 클래스 추가

        // 게시물 제목
        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title; // 제목 설정
        postElement.appendChild(postTitle);

        // 게시물 내용
        const postContent = document.createElement("p");
        postContent.textContent = post.content; // 내용 설정
        postElement.appendChild(postContent);

        // 댓글 수 표시
        const commentCount = document.createElement("span");
        commentCount.className = "comment-count"; // 댓글 수 클래스 추가
        commentCount.textContent = `댓글 수: ${post.commentCount || 0}`; // post.commentCount에서 댓글 수 가져오기
        postElement.appendChild(commentCount); // 댓글 수 추가

        // 작성자 표시
        const userName = document.createElement("span");
        userName.className = "user-name"; // 작성자 클래스 추가
        userName.textContent = `작성자: ${post.userName || "작성자 정보 없음"}`; // post.userName에서 작성자 정보 가져오기
        postElement.appendChild(userName); // 작성자 추가

        // 전체 게시물 영역 클릭 시 상세 페이지로 이동
        postElement.style.cursor = "pointer"; // 커서 모양 변경
        postElement.addEventListener("click", () => {
            loadPostDetail(post.postId); // 상세 보기 로드
        });

        // 게시물 요소를 컨테이너에 추가
        postsContainer.appendChild(postElement);
    });
}

// 드롭다운 클릭 이벤트가 문서 상에서 다른 요소에 의해 닫히지 않도록
document.addEventListener('click', function(event) {
    const searchOptions = document.getElementById("searchOptions");
    if (!searchOptions.contains(event.target) && event.target.id !== "dropdownButton") {
        searchOptions.style.display = "none"; // 드롭다운 클릭이 아니면 숨김 처리
    }
});

// 드롭다운 열림 상태를 항상 유지
document.getElementById('dropdownButton').addEventListener('click', toggleDropdown);

// 드롭다운 옵션 클릭 시 선택
document.querySelectorAll('.dropdown-content div').forEach(option => {
    option.addEventListener('click', function() {
        selectSearchCriteria(this.getAttribute('data-criteria'));
    });
});

// 뒤로가기 버튼 클릭 이벤트
document.getElementById('backButton').addEventListener('click', () => {
document.getElementById('postDetail').style.display = 'none'; // 게시글 상세 내용 숨김
document.getElementById('postsList').style.display = 'block'; // 게시글 목록 표시
loadPosts(currentPage); // 현재 페이지의 게시글 목록 다시 로드

// 검색 기능 보이기
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
        searchContainer.style.display = 'block'; // 목록으로 돌아갈 때 검색 컨테이너 보이기
    }
});


// 내가 쓴 게시물, 댓글 보러가는 버튼
document.getElementById('myPostsButton').addEventListener('click', () => {
    window.location.href = '/community/my-posts'; // 자신의 게시물 페이지로 이동
});

document.getElementById('myCommentsButton').addEventListener('click', () => {
    window.location.href = '/community/my-comments'; // 자신의 댓글 페이지로 이동
});