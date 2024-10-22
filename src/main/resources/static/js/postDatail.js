let currentPage = 1;
        const postsPerPage = 4; // 페이지당 게시글 수
        let currentPostId = null; // 현재 보고 있는 게시물 ID

        // 게시글 목록 가져오기
        async function loadPosts(page = 1) {
            try {
                const response = await fetch(`/posts?page=${page}&size=${postsPerPage}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const posts = data.content || []; // undefined 방지

                const postsList = document.getElementById('postsList');
                postsList.innerHTML = ''; // 기존 목록 초기화
                posts.forEach(post => {
                    const postDiv = document.createElement('div');
                    postDiv.className = 'post';

                    const title = document.createElement('h3');
                    title.textContent = post.title;
                    title.style.cursor = 'pointer'; // 포인터 커서 추가
                    title.addEventListener('click', () => {
                        currentPostId = post.postId; // 현재 포스트 ID 설정
                        loadPostDetail(currentPostId); // 상세 보기 로드
                    });

                    const preview = document.createElement('p');
                    preview.textContent = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;

                    postDiv.appendChild(title);
                    postDiv.appendChild(preview);
                    postsList.appendChild(postDiv);
                });
            } catch (error) {
                console.error("게시글을 불러오는 데 실패했습니다.", error);
            }
        }

        async function loadPostDetail(postId) {
            try {
                const response = await fetch(`/posts/${postId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const postDetail = await response.json();

                // 디버깅 로그 추가
                console.log("상세 내용 로드 응답:", postDetail);

                // HTML 요소에 데이터 삽입
                if (postDetail && postDetail.title && postDetail.content) {
                    document.getElementById('postTitle').textContent = postDetail.title;
                    document.getElementById('postContent').textContent = postDetail.content;
                } else {
                    document.getElementById('postTitle').textContent = '제목이 없습니다.';
                    document.getElementById('postContent').textContent = '내용이 없습니다.';
                }

                document.getElementById('postDetail').style.display = 'block'; // 상세보기 보이기
                document.getElementById('postsList').style.display = 'none'; // 게시글 목록 숨기기

                loadComments(postId); // 댓글 불러오기
            } catch (error) {
                console.error("게시글 상세 정보를 불러오는 데 실패했습니다.", error);
            }
        }

        // 댓글 목록 로드
        async function loadComments(postId) {
            try {
                const response = await fetch(`/posts/${postId}/comments`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const comments = await response.json();
                const commentsList = document.getElementById('commentsList');
                commentsList.innerHTML = ''; // 기존 댓글 목록 초기화

                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.textContent = comment.content; // 댓글 내용 표시
                    commentsList.appendChild(commentDiv);
                });
            } catch (error) {
                console.error("댓글을 불러오는 데 실패했습니다.", error);
            }
        }

        // 댓글 작성 처리
        document.getElementById('submitComment').addEventListener('click', async () => {
            const commentText = document.getElementById('commentText').value;
            if (!commentText) {
                alert("댓글 내용을 입력하세요.");
                return;
            }

            try {
                const response = await fetch(`/posts/${currentPostId}/comments`, { // URL 수정
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: commentText }) // 필드 수정
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                document.getElementById('commentText').value = ''; // 입력 필드 초기화
                loadComments(currentPostId); // 댓글 목록 새로고침
            } catch (error) {
                console.error("댓글 작성에 실패했습니다.", error);
            }
        });

        // 목록으로 돌아가기 버튼 클릭 이벤트
        document.getElementById('backButton').addEventListener('click', () => {
            document.getElementById('postDetail').style.display = 'none'; // 상세보기 숨김
            document.getElementById('postsList').style.display = 'block'; // 게시글 목록 보이기
        });

        // 페이지 로드 시 게시글 목록을 불러옴
        loadPosts(currentPage);