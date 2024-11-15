// 스크롤 이벤트 처리 함수
function handleScrollEffects() {
  const scrollTexts = document.querySelectorAll('.scroll-text');
  const scrollAnimations = document.querySelectorAll('.scroll-animation');
  const donutChart = document.querySelector('.donut-chart');

  // 1. 고정 배경과 텍스트 애니메이션
  scrollTexts.forEach((text) => {
    const textTop = text.getBoundingClientRect().top;
    if (textTop < window.innerHeight * 0.8) {
      text.classList.add('show');
    } else {
      text.classList.remove('show');
    }
  });

  // 2. 텍스트 이질감 효과 애니메이션
  scrollAnimations.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < window.innerHeight * 0.8) {
      element.classList.add('show');
    } else {
      element.classList.remove('show');
    }
  });

  // 3. 도넛 차트 회전 애니메이션
  if (donutChart) {
    const rotationDegree = window.scrollY * 0.1;
    donutChart.style.transform = `rotate(${rotationDegree}deg)`;
  }
}

// 가로 스크롤 애니메이션 설정
document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger);

  const scrollContent = document.querySelector(".scroll-content");
  const scrollSection = document.querySelector(".horizontal-scroll-section");
  const items = document.querySelectorAll('.scroll-item');

  const itemWidth = items[0].offsetWidth;
  const gap = 30; // 항목 간 간격 (이전에 0으로 설정된 부분을 수정)
  const totalWidth = (itemWidth + gap) * items.length;

  console.log('Item Width:', itemWidth);
  console.log('Gap:', gap);
  console.log('Total Content Width:', totalWidth);
  console.log('Window Width:', window.innerWidth);

  items.forEach(item => {
    item.classList.add('show');
  });

  scrollContent.style.width = `${totalWidth}px`;

  // 성능 최적화를 위한 will-change 속성 추가
  scrollContent.style.willChange = 'transform';

  // gsap 애니메이션
  gsap.to(scrollContent, {
    x: () => {
      const scrollContentWidth = scrollContent.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(scrollContentWidth - windowWidth);
    },
    scrollTrigger: {
      trigger: scrollSection,
      start: "top top", // 스크롤 시작 시점
      end: () => `+=${totalWidth - window.innerWidth}`,
      scrub: 1, // scrub을 일정하게 설정 (애니메이션 속도를 일정하게 유지)
      pin: true,
      anticipatePin: 1,
      onEnter: () => {
        scrollContent.style.transform = 'translate3d(0px, 0px, 0px)';
      }
    }
  });

  scrollContent.style.transform = 'translate3d(0px, 0px, 0px)';

  // 텍스트 크기 증가 애니메이션 설정
  const animatedText = document.querySelector('.animated-scale-text');

  if (animatedText) {
    // gsap 초기 스타일 설정
    gsap.set(animatedText, {
      fontSize: "5vw",  // 초기 텍스트 크기
      opacity: 1,
      transformOrigin: 'center center', // 텍스트 중심에서 커지도록 설정
    });

    // 스크롤 애니메이션 설정
    gsap.to(animatedText, {
      fontSize: "500vw", // 텍스트가 화면을 가득 채울 정도로 커짐
      letterSpacing: "-50vw", // 자간을 줄여 빈틈 제거
      lineHeight: "0.8",
      color: "#000", // 텍스트를 검정색으로 설정
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.scaling-text-section', // 애니메이션이 트리거될 섹션
        start: 'top+=1000 center', // 섹션 상단이 화면 중앙에 도달할 때 시작
        end: 'bottom+=100',
        scrub: 1, // 스크롤에 맞춰 애니메이션을 부드럽게 진행
        pin: true, // 스크롤 시 섹션을 고정
        markers: true, // 디버깅을 위한 마커 표시
        onEnter: () => {
          document.body.style.backgroundColor = "#000"; // 배경 강제 검정
        },
        onLeave: () => {
          document.body.style.backgroundColor = "#fff"; // 애니메이션 종료 후 복원
        },
      },
    });

  } else {
    console.error("`.animated-scale-text` 요소를 찾을 수 없습니다. 클래스명을 확인하세요.");
  }
});

// 스크롤 이벤트 추가
window.addEventListener('scroll', handleScrollEffects, { passive: true });

// 시작하기 버튼 클릭 이벤트
document.querySelector(".startbutton")?.addEventListener('click', () => {
  location.href = "/ui/main";
});
