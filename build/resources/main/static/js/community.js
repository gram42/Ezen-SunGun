let currentPage = 1;
const postsPerPage = 4;
const pagesPerSection = 5; // 한 섹션당 페이지 수
let totalPosts = 0;
let currentPostId = null;

async function loadPosts(page = 1) {
try {
document.getElementById('loadingMessage').style.display = 'block'; // 로딩 메시지 표시

// 게시글 목록 API 호출 (로그인 여부와 관계없이 호출)
const response = await fetch(`/posts?page=${page}&size=${postsPerPage}`);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
const posts = data.content || [];
totalPosts = data.totalElements;

const postsList = document.getElementById('postsList');
postsList.innerHTML = ''; // 기존 게시글 목록 초기화

// 게시글 목록 생성
posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.style.cursor = 'pointer';   //커서 포인터로 설정

    // 게시글 제목
    const title = document.createElement('h3');
    title.textContent = post.title;

    // 게시물 박스 클릭 시 상세보기로 이동
    postDiv.addEventListener('click', () =>{
        currentPostId = post.postId;
        loadPostDetail(currentPostId);// 게시글 상세보기로 이동
    });

    // 게시글 내용 미리보기 (100자 이상이면 '...' 표시)
    const preview = document.createElement('p');
    preview.textContent = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;

    // 댓글 수 표시
    const postInfo = document.createElement('div');
    postInfo.className = 'post-info'; // 추가된 클래스

    const commentCount = document.createElement('span');
    commentCount.textContent = `댓글 수: ${post.commentCount || 0}`;
    postInfo.appendChild(commentCount); // 댓글 수 추가

    // 작성자 표시
    const userName = document.createElement('span');
    userName.className = 'user-name';
    userName.textContent = `작성자: ${post.userName}`; // 작성자 정보를 추가
    postInfo.appendChild(userName); // 작성자 추가
    


    // 게시물 구성
    postDiv.appendChild(title);
    postDiv.appendChild(preview);
    postDiv.appendChild(postInfo);


    postsList.appendChild(postDiv); // 목록에 게시글 추가
    // CSS 스타일 다시 설정
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

// 뒤로가기 버튼 클릭 이벤트
document.getElementById('backButton').addEventListener('click', () => {
document.getElementById('postDetail').style.display = 'none'; // 게시글 상세 내용 숨김
document.getElementById('postsList').style.display = 'block'; // 게시글 목록 표시
loadPosts(currentPage); // 현재 페이지의 게시글 목록 다시 로드
});


// 내가 쓴 게시물, 댓글 보러가는 버튼
document.getElementById('myPostsButton').addEventListener('click', () => {
    window.location.href = '/community/my-posts'; // 자신의 게시물 페이지로 이동
});

document.getElementById('myCommentsButton').addEventListener('click', () => {
    window.location.href = '/my-comments.html'; // 자신의 댓글 페이지로 이동
});