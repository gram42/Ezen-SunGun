(()=>{

    const personalMenuBtn = document.querySelector('#personalMenuBtn');
    const personalMenu = document.querySelector('.personalMenu');

    personalMenuBtn.addEventListener('click',(event) => {
        event.preventDefault();
    })

    personalMenuBtn.addEventListener('mouseover', () => {
        personalMenu.classList.add('show');
    });

    personalMenu.addEventListener('mouseover', () => {
        personalMenu.classList.add('show');
    });

    personalMenuBtn.addEventListener('mouseout', () => {
        personalMenu.classList.remove('show');
    });

    personalMenu.addEventListener('mouseout', () => {
        personalMenu.classList.remove('show');
    });













/* ----------------------------------------------------------------------------------------------------------------------------------------------------- */
  /* ----------------------------------------------------------------------------------------------------------------------------------------------------- */
        // 별 생성 및 애니메이션
        const canvas = document.getElementById('stars');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const meteors = [];

        // 별 생성 (화면 전체에 고르게 분포)
        for (let i = 0; i < 800; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                alpha: Math.random(),
            });
        }

        // 유성우 생성 (대각선으로 떨어지는 유성우)
        function createMeteor() {
            const startX = Math.random() * canvas.width;
            const startY = -20; // 화면 위에서 시작
            meteors.push({ x: startX, y: startY });
        }

        // 유성우 애니메이션 (대각선으로 빠르게 떨어지도록)
        function animateMeteors() {
            meteors.forEach((meteor, index) => {
                ctx.beginPath();
                ctx.arc(meteor.x, meteor.y, 4, 0, Math.PI * 2); // 큰 점으로 유성우 구현
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();

                // 유성우가 대각선으로 빠르게 떨어지도록
                meteor.x += Math.random() * 4 - 2; // 좌우로 조금씩 이동
                meteor.y += 8; // 아래로 빠르게 떨어짐

                // 유성우가 화면 밖으로 나가면 삭제
                if (meteor.y > canvas.height || meteor.x < 0 || meteor.x > canvas.width) {
                    meteors.splice(index, 1);
                }
            });

            // 새로운 유성우 생성
            if (Math.random() < 0.02) { // 유성우 발생 확률
                createMeteor();
            }
        }

        // 별 그리기 (화면 전체에 고르게 분포)
        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
        }

        function animateStars() {
            stars.forEach(star => {
                star.alpha += Math.random() * 0.02 - 0.01;
                if (star.alpha < 0.1) star.alpha = 0.1;
                if (star.alpha > 1) star.alpha = 1;
            });
            drawStars();
            animateMeteors();
            requestAnimationFrame(animateStars);
        }
        animateStars();

        // 태양 애니메이션 (크기 변화와 회전)
        gsap.to(".sun-effect", {
            scale: 1.3,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
        });

        // 텍스트 애니메이션 (자연스럽게 나타나고 사라짐)
        const textSpans = document.querySelectorAll(".sun-text span");
        gsap.timeline()
            .to(".sun-text", { opacity: 1, duration: 1, delay: 1 })
            .fromTo(
                textSpans,
                { opacity: 0, scale: 0, rotationX: 90 },
                {
                    opacity: 1,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                }
            )
            .to(textSpans, {
                x: "random(-50, 50)",
                opacity: 0,
                duration: 2,  // 자연스럽게 사라지도록 시간 증가
                stagger: 0.1,
                ease: "power2.inOut",
                delay: 2
            });

})();
