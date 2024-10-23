마이페이지 & 기록

[해야할 것]

아이디 중복확인 후 내용 변동이 있을 시 재 중복확인하도록 변경해야함

비밀번호 체크 정확히 4글자 이하도 가입 됨

비밀번호 변경시에도 4글자 이상으로 조건 정하기

문의 하기 / 문의 내역

유저 데이터 타입 수정 - 날짜: date 타입 등 지금은 전부 String으로 처리했는데 세부 조정 필요

관심분야 선택 추천 시 성별, 나이 입력 받아야할 듯?(남, 여, 성별X, 나이, 나이X)

아예 성별 나이 빼도?

게시글이든 기록이든 본문 내용 수정 후 완료 안눌렀는데 페이지 바꾸려고하면 안내메세지 띄우기

-----------------------------------------------------------------------------------------------------------------------------------

[순서]
테이블 생성 - 기록 기능구현 - 마이페이지 기능구현 - 테스트 - 통합

<테이블 생성>
NN조건, 유니크, id, 길이, 데이터 타입 등 생각해보기

ver0.1.2 각자 만든 html 통합본

ResController 파일 수정 rec 접근시 all_res로 리다이렉트 하도록 수정

ver0.1.4 마이페이지 개인 정보 수정, 비밀번호 변경, 회원탈퇴 및 기본적인 로그인 기능 회원가입 시 비밀번호 확인 안되는 버그 수정

기본적인 로그인 기능(+)

로그인 안했을 경우 로그인 페이지로 이동(+)

로그인 햇을 경우 다음 내용 출력(+)

개인 정보 수정, 회원탈퇴(+)

개인 정보 수정을 누르면 각종 정보 수정 가능하게 비밀번호와 정보 수정시 비번 재입력 창 띄우기(+)

비번 전송시 fetch로 확인 결과에 따라 수정 창 or 에러 메세지(+)

개인정보 수정, 회원 탈퇴(+)

비밀번호 변경(+)

로그아웃(+)

세션활용 세션을 이용한 유저 정보 저장 회원 탈퇴시 세션 무효화(+)

DB설계도, 프로젝트 계획서 첨부(+)

에러 페이지 추가(+)

<테이블 생성>
NN조건, 유니크, id, 길이, 데이터 타입 등 생각해보기

1. [category] 카테고리 생성(카테고리 ID, 이름) - 일단 고정된 카테고리 제공 예정 추후 유저별 커스텀 기능은 생각해보기
2. [record] 기록 생성(기록 ID, 날짜, 본문, 달성 포인트, userid(FK), 카테고리 ID(FK)) - FK 연결법 알아보기, 
   userid / 날짜 / 카테고리로 복합키 예정 하루에 카테고리 하나당 한 개의 기록, 포인트 디폴트 값 = 0


# 기록

html - [record]

날짜 설정 (+)

기본 접속 시 오늘의 기록 출력 (+)

날짜에 맞는 기록 출력(있으면 있는거 없으면 없는대로 출력 - 아마 새로운 빈 데이터 자동 생성하게끔 만들어야할듯)(+)

카테고리별 정보와 버튼은 enhanced for문 사용(카테고리 변동의 유연성을 위함)(+)

카테고리별 버튼 활성/비활성화 - 포인트 적립(+)

기록과 저장, 출력은 모두 AJAX 통신으로 이루어질 예정(+)

본문 내용 저장 - null 가능(+)

본문 내용 수정 가능, 카테고리별 내용은 각 카테고리에만 출력(+)

카테고리 활성화 시에만 본문 내용과 저장 버튼 띄우기(+)


# 카테고리

카테고리 추가 (+)

카테고리 수정 (+)

카테고리 중복확인 (+)

카테고리 삭제 (-) - 외래키 사용으로인한 삭제 불가능, 추후 대체 기능 구현


# My page

그래프 - 기록 포인트, userid, category id와 연결해 카테고리별 점수 그래프로 표시

 - 데이터 받기

오늘 기준 5주치 데이터 받아와서 카테고리별 + 전체 포인트 합산 출력(내가 약 한 달간 뭘 얼마나 했나) (+)

최근 기록 대비 출력 설정 (+)

주단위, 월단위 단위별 포인트 합계 출력(+)

포인트 합계 결과에 맞춘 차트 그리기 (+)


# merge

각자 만든 기능 충돌 없이 모두 합치기(-)

시큐리티에 세션 관리들어가서 세션으로 정보 불러오는 mypage가 작동안함 고치기(-)