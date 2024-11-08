// 스크롤 이벤트 핸들러
function handleScrollEffects() {
  const bgSections = document.querySelectorAll('.bg-transition');
  const fullscreenSection = document.querySelector('.fullscreen-section');
  const fullscreenBackground = document.querySelector('.fullscreen-background');
  const scrollTexts = document.querySelectorAll('.scroll-text');

  // 1. 배경 전환 효과
  bgSections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      bgSections.forEach(sec => sec.classList.remove('active'));
      section.classList.add('active');
    }
  });

  // 2. 전체화면에서 핸드폰 크기로 점진적 축소 효과
  const fullscreenTriggerPoint = fullscreenSection.offsetTop;
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > fullscreenTriggerPoint) {
    const scaleValue = Math.max(0.5, 1 - (scrollPosition - fullscreenTriggerPoint) / 1000);
    const translateYValue = Math.min(50, (scrollPosition - fullscreenTriggerPoint) / 20);

    // 섹션과 배경을 동시에 축소
    fullscreenSection.style.transform = `scale(${scaleValue}) translateY(${translateYValue}%)`;
    fullscreenBackground.style.transform = `scale(${scaleValue})`; // 배경 이미지도 함께 축소
  } else {
    fullscreenSection.style.transform = 'scale(1) translateY(0)';
    fullscreenBackground.style.transform = 'scale(1)';
  }

  // 3. 고정 배경과 텍스트 애니메이션
  scrollTexts.forEach((text) => {
    const textTop = text.getBoundingClientRect().top;
    if (textTop < window.innerHeight * 0.8) {
      text.classList.add('show');
    } else {
      text.classList.remove('show');
    }
  });
}

// 스크롤 이벤트 추가
window.addEventListener('scroll', handleScrollEffects);

document.querySelector(".startbutton").addEventListener('click',()=>{
  location.href = "/ui/main"
})