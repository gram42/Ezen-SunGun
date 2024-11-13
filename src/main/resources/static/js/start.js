// 스크롤 이벤트 핸들러
function handleScrollEffects() {
  const scrollTexts = document.querySelectorAll('.scroll-text');
  const scrollAnimations = document.querySelectorAll('.scroll-animation');
  const horizontalScrollSection = document.querySelector('.horizontal-scroll-section');

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
  const donutChart = document.querySelector('.donut-chart');
  if (donutChart) {
    const rotationDegree = window.scrollY * 0.1;
    donutChart.style.transform = `rotate(${rotationDegree}deg)`;
  }

  // 4. 가로 스크롤 섹션 애니메이션
  if (horizontalScrollSection) {
    const sectionTop = horizontalScrollSection.getBoundingClientRect().top;
    const startScroll = horizontalScrollSection.offsetTop;
    const endScroll = startScroll + horizontalScrollSection.scrollWidth;

    // 가로 스크롤 영역이 화면에 들어왔을 때만 동작
    if (window.scrollY >= startScroll && window.scrollY <= endScroll) {
      const scrollAmount = (window.scrollY - startScroll) * 1.5; // 스크롤 비율 조정
      horizontalScrollSection.scrollLeft = scrollAmount;
    }
  }
}



// 스크롤 이벤트 추가
window.addEventListener('scroll', handleScrollEffects);

// '시작하기' 버튼 클릭 시 이동
document.querySelector(".startbutton").addEventListener('click', () => {
  location.href = "/ui/main";
});