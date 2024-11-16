let idleTimeout;
let isAnimating = false;
let animationFrame;
const idleTimeLimit = 3000; // 3초 동안 입력이 없으면 사인파 운동 시작

function init() {
  const input = document.querySelector('#resize-container__input');
  const inputHeight = input.getBoundingClientRect().height;
  document.documentElement.style.setProperty(
    '--input-height',
    `${inputHeight / 16}rem`
  );

  const slider = document.querySelector('#slider');
  document.documentElement.style.setProperty(
    '--width',
    `${slider.value / 16}rem`
  );

  slider.addEventListener('input', (e) => {
    document.documentElement.style.setProperty(
      '--width',
      `${e.target.value / 16}rem`
    );
    resetIdleTimer(); // 슬라이더 입력 시 타이머 초기화
  });

  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keydown', resetIdleTimer);

  resetIdleTimer(); // 초기 타이머 설정
}

function resetIdleTimer() {
  if (isAnimating) {
    stopSineWaveAnimation();
  }

  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(startSineWaveAnimation, idleTimeLimit);
}

function startSineWaveAnimation() {
  isAnimating = true;
  const slider = document.querySelector('#slider');
  let startTime;

  // 슬라이더 현재 값을 기준으로 초기 위상(fase) 계산
  const amplitude = (slider.max - slider.min) / 2; // 슬라이더 범위의 절반
  const offset = amplitude + Number(slider.min); // 슬라이더 중간 값 위치
  const currentValue = slider.value;
  const initialPhase = Math.asin((currentValue - offset) / amplitude); // 현재 위치를 기준으로 위상 계산

  function animateSlider(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;

    // 사인파 운동 계산, 초기 위상 적용
    const frequency = 0.002; // 주기 조정
    const sineValue =
      amplitude * Math.sin(frequency * elapsedTime + initialPhase) + offset;

    // 슬라이더 값과 CSS 변수 업데이트
    slider.value = sineValue;
    document.documentElement.style.setProperty(
      '--width',
      `${sineValue / 16}rem`
    );

    animationFrame = requestAnimationFrame(animateSlider);
  }

  animationFrame = requestAnimationFrame(animateSlider);
}

function stopSineWaveAnimation() {
  isAnimating = false;
  cancelAnimationFrame(animationFrame);
}

init();
