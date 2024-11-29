let currentPage = 1;
const postsPerPage = 4;
const pagesPerSection = 5; // 한 섹션당 페이지 수
let totalPosts = 0;
let currentPostId = null;
let loadedPosts = [];

const commentsPerPage = 5;
let totalComments = 0

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
            title.textContent = post.title.length > 10 ? post.title.substring(0, 10) + '...' : post.title;

            // 게시물 박스 클릭 시 상세보기로 이동
            postDiv.addEventListener('click', () => {
                currentPostId = post.postId;
                loadPostDetail(currentPostId); // 게시글 상세보기로 이동
            });

            // 게시글 내용 미리보기
            const preview = document.createElement('p');
            preview.textContent = post.content.length > 20 ? post.content.substring(0, 20) + '...' : post.content;

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

    prevSectionButton.onclick = (event) => {
        event.preventDefault();
        const prevSectionLastPage = Math.max(1, Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection); // 이전 섹션의 마지막 페이지
        currentPage = prevSectionLastPage; // 이전 섹션의 마지막 페이지로 이동
        loadPosts(currentPage);
    };




    // 이전 페이지 버튼
    const prevButton = document.getElementById('prevButton');
    prevButton.style.display = currentPage > 1 ? 'inline-block' : 'none';
    prevButton.onclick = (event) => {
        event.preventDefault();
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
    nextButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            loadPosts(currentPage);
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

// 상세 화면 데이터 업데이트
document.getElementById('postTitle').textContent = `${data.title}`;
document.getElementById('postContent').textContent = `${data.content}`;
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

 // 상세 화면을 표시하고 목록 화면을 숨기기
 document.getElementById('postDetail').style.display = 'block';
 document.getElementById('postsList').style.display = 'none';

 // question-box, 검색창, 페이지네이션 등 숨기기
 document.querySelector('.question-box').style.display = 'none';
 document.getElementById('writeBox').style.display = 'none';
 document.getElementById('pagination').style.display = 'none';
 const searchContainer = document.getElementById('searchContainer'); 
 if (searchContainer) {
     searchContainer.style.display = 'none';
 }

 // 댓글 로드
 loadComments(postId);
} catch (error) {
 document.getElementById('errorMessage').textContent = "게시글 상세 정보를 불러오는 데 실패했습니다.";
 console.error("게시글 상세 정보를 불러오는 데 실패했습니다.", error);
}
}

// 게시글 수정
// 게시글 수정 버튼 클릭 시 모달 열기
document.getElementById('editPostButton').onclick = function() {
    // 현재 제목과 내용을 모달의 입력 필드에 설정
    document.getElementById('newTitle').value = document.getElementById('postTitle').textContent.replace('제목: ', '');
    document.getElementById('newContent').value = document.getElementById('postContent').textContent.replace('상세내용: ', '');

    // 모달 표시
    document.getElementById('editPostModal').style.display = 'block';
};

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

// 저장 버튼 클릭 시 처리
document.getElementById('saveChangesBtn').onclick = async function() {
    const newTitle = document.getElementById('newTitle').value;
    const newContent = document.getElementById('newContent').value;

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
            // 모달 닫기
            document.getElementById('editPostModal').style.display = 'none';
        } catch (error) {
            document.getElementById('errorMessage').textContent = "게시물 수정에 실패했습니다.";
            console.error("게시물 수정에 실패했습니다.", error);
        }
    }
};

// 취소 버튼 클릭 시 모달 닫기
document.getElementById('cancelEditPostButton').onclick = function() {
    // 모달 닫기
    document.getElementById('editPostModal').style.display = 'none';
    // 입력 필드 초기화
    document.getElementById('newTitle').value = '';
    document.getElementById('newContent').value = '';
};

// 모달 닫기 버튼 클릭 시 모달 닫기
document.getElementById('cancelEditPostButton').onclick = function() {
    // 모달 닫기
    document.getElementById('editPostModal').style.display = 'none';
    // 입력 필드 초기화
    document.getElementById('newTitle').value = '';
    document.getElementById('newContent').value = '';
};


// 게시글 삭제 
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
     // 검색 기능 보이기
     const searchContainer = document.getElementById('searchContainer');
     if (searchContainer) {
         searchContainer.style.display = 'block'; // 삭제 후 검색 컨테이너를 보이게 설정
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
const response = await fetch('/user/current', {
    method: 'GET',
    credentials: 'include' // 쿠키를 포함시켜 인증 정보를 보냄
});

const writePostButton = document.getElementById('writePostButton');
const submitCommentButton = document.getElementById('submitComment');
const commentText = document.getElementById('commentText');

if (!response.ok) {
    if (response.status === 401) {
        // 로그인하지 않은 경우 글쓰기 및 댓글 작성 버튼 숨기기
        console.warn('사용자가 로그인하지 않았습니다.');
        writePostButton.style.display = 'none'; // 글쓰기 버튼 숨기기
        submitCommentButton.style.display = 'none'; // 댓글 작성 버튼 숨기기
        commentText.style.display = 'none';
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
return user; // 로그인한 사용자 정보 반환
} catch (error) {
console.error('사용자 정보를 불러오는 데 실패했습니다.', error);
const writePostButton = document.getElementById('writePostButton');
const submitCommentButton = document.getElementById('submitComment');
writePostButton.style.display = 'none'; // 글쓰기 버튼 숨기기
submitCommentButton.style.display = 'none'; // 댓글 작성 버튼 숨기기
commentText.style.display = 'none'; // 댓글 입력 필드 숨기기



return null; // 에러 발생 시 null 반환
}
}







// 페이지 로드 시 사용자 정보를 불러오기
document.addEventListener('DOMContentLoaded', fetchCurrentUser);

// 댓글 로드
async function loadComments(postId, page = 1) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    currentPage = page;

try {
const response = await fetch(`/posts/${postId}/comments?page=${page - 1}&size=${commentsPerPage}`);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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


// 페이지 로드 시 현재 사용자 정보를 불러옵니다.
fetchCurrentUser();



// 댓글 수정
document.getElementById("editCommentText").addEventListener("input", function() {
    const editCommentText = document.getElementById("editCommentText");
    const editWarningMessage = document.getElementById("editWarningMessage");

    if (editCommentText.value.length >= 500) {
        editCommentText.value = editCommentText.value.substring(0, 500); // 초과 시 500자로 자르기
        editWarningMessage.style.display = "block";
    } else {
        editWarningMessage.style.display = "none";
    }
});

async function editComment(commentId) {
    // 댓글 수정 모달 표시
    document.getElementById("editCommentModal").style.display = "block";

    document.getElementById("saveCommentButton").onclick = async function() {
        const newCommentText = document.getElementById("editCommentText").value;
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
                // 댓글을 다시 불러오고 수정 모달 닫기
                loadComments(currentPostId);
                document.getElementById("editCommentModal").style.display = "none";
            } catch (error) {
                document.getElementById("commentErrorMessage").textContent = "댓글 수정에 실패했습니다.";
                console.error("댓글 수정에 실패했습니다.", error);
            }
        }
    };

 // 취소 버튼 클릭 시 수정 모달 닫기
 document.getElementById("cancelEditCommentButton").onclick = function() {
    document.getElementById("editCommentModal").style.display = "none";
};

// X 버튼 클릭 시 수정 모달 닫기
document.getElementById("closeEditCommentModal").onclick = function() {
    document.getElementById("editCommentModal").style.display = "none";
};
}

// 게시글 수정 모달에서 사용할 이벤트 리스너 추가
document.getElementById("cancelEditPostButton").onclick = function() {
document.getElementById("editPostModal").style.display = "none";
};

document.getElementById("closeEditPostModal").onclick = function() {
document.getElementById("editPostModal").style.display = "none";
};

// 댓글 삭제
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

// 댓글 작성
    const commentText = document.getElementById('commentText');
    const warningMessage = document.getElementById('warningMessage');
    const errorMessage = document.getElementById('errorMessage');

    // 글자 수 체크하는 함수
    function checkCommentLength() {
        const commentLength = commentText.value.length;

        // 댓글 내용 체크
        if (commentLength >= 500) {
            commentText.value = commentText.value.substring(0, 500); // 초과 시 잘라내기
            warningMessage.textContent = "댓글 내용은 최대 500자까지 입력할 수 있습니다."; // 경고 메시지 표시
            warningMessage.style.display = "block"; // 경고 메시지 표시
        } else {
            warningMessage.style.display = "none"; // 숨기기
        }
    }

    // 실시간 입력 체크
    commentText.addEventListener("input", function() {
        checkCommentLength();
    });

    // 댓글 작성 폼 제출 시 처리
    document.getElementById("commentForm").onsubmit = async function(event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const comment = commentText.value.trim(); // 댓글 내용 가져오기

        // 댓글 내용이 비어 있는지 확인
        if (comment.length === 0) {
            errorMessage.textContent = "댓글 내용이 비어있습니다."; // 비어있을 때 에러 메시지
            return;
        }

        // 데이터 전송
        try {
            const response = await fetch(`/posts/${currentPostId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentText: comment }),
            });

            // 서버로부터 응답 확인
            if (response.ok) {
                console.log("댓글이 성공적으로 작성되었습니다.");
                commentText.value = ''; // 댓글 입력 필드 초기화
                loadComments(currentPostId); // 댓글 목록 재로딩
            } else {
                const errorData = await response.json(); 
                console.error("Error:", errorData);
                errorMessage.textContent = "댓글 작성 중 오류가 발생했습니다."; // 오류 메시지 표시
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            errorMessage.textContent = "서버에 연결하는 중 오류가 발생했습니다."; // 서버 연결 오류 메시지 표시
        }
    };

// 페이지 로드 시 초기화
window.onload = () => {
    loadPosts(currentPage);
};




// 페이지 로드 시 URL 쿼리 파라미터 확인
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const criteria = urlParams.get('criteria');
    const page = urlParams.get('page') || 1;

    if (search && criteria) {
        document.getElementById('searchInput').value = search;
        document.getElementById('dropdownButton').textContent = criteria === 'title' ? '제목으로 검색 ▼' : criteria === 'author' ? '작성자로 검색 ▼' : '댓글 내용으로 검색 ▼';
        searchPosts(page); // 수정된 부분: 검색 상태 유지
    } else {
        loadPosts(page); // 검색어가 없으면 기본 게시물 로드
    }
};

// 커뮤니티 페이지로 이동하는 함수
function goToCommunityPage() {
    window.history.pushState(null, '', '/community/community'); // 커뮤니티 페이지 URL로 이동
    loadPosts(1); // 첫 페이지의 게시물 로드
}

// '뒤로가기' 버튼 이벤트 처리
document.getElementById('backButton').addEventListener('click', goToCommunityPage);

// popstate 이벤트 처리
window.onpopstate = function(event) {
    loadPosts(1); // 이전 상태가 활성화되었을 때 첫 페이지 로드
};

// 드롭다운 토글 함수
function toggleDropdown(event) {
    event.stopPropagation();
    const searchOptions = document.getElementById("searchOptions");
    searchOptions.style.display = searchOptions.style.display === "block" ? "none" : "block";
}

// 드롭다운에서 검색 기준 선택
function selectSearchCriteria(criteria) {
    const dropdownButton = document.getElementById("dropdownButton");
    const searchOptions = document.getElementById("searchOptions");

    const criteriaText = {
        title: "제목으로 검색 ▼",
        author: "작성자로 검색 ▼",
        comment: "댓글 내용으로 검색 ▼"
    };

    dropdownButton.textContent = criteriaText[criteria] || criteriaText.comment;
    searchOptions.style.display = "none";
}

// 검색 버튼 클릭 시 게시물 검색
document.getElementById('searchButton').addEventListener('click', () => searchPosts(1)); // 첫 페이지부터 검색 시작
// 검색창에서 Enter 키를 눌렀을 때 검색 버튼 클릭 동작 실행
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // 기본 Enter 동작 방지
        document.getElementById('searchButton').click(); // 검색 버튼 클릭 동작 실행
    }
});

// 게시물 검색
async function searchPosts(page) {
    const searchInput = document.getElementById('searchInput').value.trim();
    const dropdownButton = document.getElementById('dropdownButton');
    
    const criteriaMap = {
        "제목으로 검색 ▼": 'title',
        "작성자로 검색 ▼": 'author',
        "댓글 내용으로 검색 ▼": 'comment'
    };

    const searchCriteria = criteriaMap[dropdownButton.textContent] || '';

    if (!searchInput) {
        document.getElementById('postsList').innerHTML = "";
        currentPage = 1;
        loadPosts(currentPage);
        return;
    }

    const queryParameters = new URLSearchParams({
        [searchCriteria]: searchInput,
        page: page - 1,
        size: 4
    });

    // URL 업데이트
    window.history.pushState(null, '', `/community/community?${queryParameters.toString()}`);

    try {
        const requestURL = `/posts/search?${queryParameters.toString()}`;
        const response = await fetch(requestURL);
        
        if (!response.ok) {
            throw new Error("서버 오류 발생");
        }

        const data = await response.json();

        if (Array.isArray(data.content)) {
            displaySearchResults(data.content, data.totalElements, page);
        } else {
            console.error("검색 결과가 배열이 아닙니다:", data);
            displaySearchResults([], 0, page);
        }

    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        document.getElementById('errorMessage').textContent = "검색 중 오류가 발생했습니다. 다시 시도해 주세요.";
    }
}

// 검색 결과 게시물 표시 및 페이지네이션 생성
function displaySearchResults(posts, totalPosts, currentPage) {
    const postsContainer = document.getElementById("postsList");
    postsContainer.innerHTML = "";

    if (!Array.isArray(posts) || posts.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "검색 결과가 없습니다.";
        postsContainer.appendChild(noResultsMessage);
        return;
    }

    posts.forEach(post => {
        if (!post.postId) {
            console.error("게시물 ID가 정의되지 않았습니다:", post);
            return;
        }

        const postElement = document.createElement("div");
        postElement.className = "post";

        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title;
        postTitle.textContent = post.title.length > 10 ? post.title.substring(0, 10) + '...' : post.title;
        postElement.appendChild(postTitle);

        const postContent = document.createElement("p");
        postContent.textContent = post.content;
        postContent.textContent = post.content.length > 20 ? post.content.substring(0, 20) + '...' : post.content;
        postElement.appendChild(postContent);

        const commentCount = document.createElement("span");
        commentCount.className = "comment-count";
        commentCount.textContent = `댓글 수: ${post.commentCount || 0}`;
        postElement.appendChild(commentCount);

        const userName = document.createElement("span");
        userName.className = "user-name";
        userName.textContent = `작성자: ${post.userName || "작성자 정보 없음"}`;
        postElement.appendChild(userName);

        postElement.style.cursor = "pointer";
        postElement.addEventListener("click", () => {
            loadPostDetail(post.postId);
        });

        postsContainer.appendChild(postElement);
    });

    // 페이지네이션 생성
    displaySearchPagination(totalPosts, currentPage);
}

// 페이지네이션 요소 생성
function displaySearchPagination(totalPosts, currentPage) {
    const pagination = document.getElementById('pagination');
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    const totalPages = Math.ceil(totalPosts / 4);
    const pagesPerSection = 5;

    // 이전 섹션 버튼
    const prevSectionButton = document.getElementById('prevSectionButton');
    const isFirstSection = Math.floor((currentPage - 1) / pagesPerSection) === 0;
    prevSectionButton.style.display = (isFirstSection && currentPage === 1) ? 'none' : 'inline-block';
    prevSectionButton.onclick = (event) => {
        event.preventDefault();
        const prevSectionLastPage = Math.max(1, Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection);
        searchPosts(prevSectionLastPage);
    };

    // 이전 페이지 버튼
    const prevButton = document.getElementById('prevButton');
    prevButton.style.display = currentPage > 1 ? 'inline-block' : 'none';
    prevButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            searchPosts(currentPage - 1);
        }
    };

    // 페이지 번호 버튼들
    const startPage = Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection + 1;
    const endPage = Math.min(startPage + pagesPerSection - 1, totalPages);
    for (let i = startPage; i <= endPage; i++) {
        const pageSpan = document.createElement('a');
        pageSpan.textContent = i;
        pageSpan.className = 'pagination-button';
        if (i === currentPage) {
            pageSpan.classList.add('active');
        }
        pageSpan.onclick = () => {
            searchPosts(i);
        };
        pageNumbers.appendChild(pageSpan);
    }

    // 다음 페이지 버튼
    const nextButton = document.getElementById('nextButton');
    nextButton.style.display = currentPage < totalPages ? 'inline-block' : 'none';
    nextButton.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            searchPosts(currentPage + 1);
        }
    };

    // 다음 섹션 버튼
    const nextSectionButton = document.getElementById('nextSectionButton');
    nextSectionButton.style.display = currentPage < totalPages ? 'inline-block' : 'none';
    nextSectionButton.onclick = (event) => {
        event.preventDefault();
        const nextSectionFirstPage = Math.min(Math.floor((currentPage - 1) / pagesPerSection) * pagesPerSection + pagesPerSection + 1, totalPages);
        searchPosts(nextSectionFirstPage);
    };

    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

// 드롭다운 클릭 이벤트가 문서 상에서 다른 요소에 의해 닫히지 않도록
document.addEventListener('click', function(event) {
    const searchOptions = document.getElementById("searchOptions");
    if (!searchOptions.contains(event.target) && event.target.id !== "dropdownButton") {
        searchOptions.style.display = "none";
    }
});

document.getElementById('dropdownButton').addEventListener('click', toggleDropdown);

document.querySelectorAll('.dropdown-content div').forEach(option => {
    option.addEventListener('click', function() {
        selectSearchCriteria(this.getAttribute('data-criteria'));
    });
});




// 뒤로가기 버튼 클릭 이벤트
document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('postDetail').style.display = 'none';
    document.getElementById('postsList').style.display = 'block';
    loadPosts(currentPage);

    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
        searchContainer.style.display = 'block';
    }
});
// 브라우저의 뒤로가기 버튼 클릭 이벤트
window.addEventListener('popstate', (event) => {
    const postDetail = document.getElementById('postDetail');
    const postsList = document.getElementById('postsList');
    const searchContainer = document.getElementById('searchContainer');
    const questionBox = document.querySelector('.question-box');
    const communityText = document.querySelector('.community-text'); 
    const writePostButton = document.getElementById('writeBox');

    if (event.state && event.state.page) {
        currentPage = event.state.page; // 상태에서 페이지 번호 가져오기
        loadPosts(currentPage); // 해당 페이지의 게시물 로드
    } else {

    if (postDetail && postsList) {
        postDetail.style.display = 'none'; // 상세 화면 숨기기
        postsList.style.display = 'block'; // 게시글 목록 화면 표시
        loadPosts(currentPage); // 현재 페이지의 게시글 목록 다시 로드
    }
    
    // 숨긴 요소들 표시
    if (searchContainer) {
        searchContainer.style.display = 'block'; // 검색창 표시
    }
    if (questionBox) {
        questionBox.style.display = 'block';
    }
    if (communityText) {
        communityText.style.display = 'block';
    }}
    if (writePostButton) {
        writePostButton.style.display = 'block';
    }
});

// 로그인 상태 확인하는 함수
async function checkLoginStatus() {
    try {
        const response = await fetch('/user/current');
        if (response.ok) {
            // 로그인 상태 확인 (예: 화면에 메시지 표시 또는 사용자 정보 숨기기)
            console.log("User is logged in"); // 필요시 메시지 로깅
        } else {
            console.log("User is not logged in");
        }
    } catch (error) {
        console.error("Error checking login status:", error);
    }
}

// 페이지가 로드될 때 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});
