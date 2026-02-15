const vinyl = document.getElementById('vinyl');
const needle = document.getElementById('needle');
const audio = document.getElementById('audio');
const heartsContainer = document.getElementById('heartsContainer');

let isPlaying = false;
const hearts = [];

// песни
const playlist = [
  'Kozy_Korpesh_-_Bayan_ Sulu.mp3',
  'Gashyqpyn_sagan.mp3',
  'Aruzhan_is_on_5_floor.mp3',
  'ja-tak-bojus.mp3'
];

let currentTrack = 0;

// Кнопки песен
const songButtons = document.querySelectorAll('.song-button');

songButtons.forEach(button => {
  button.addEventListener('click', function() {
    const trackIndex = parseInt(this.getAttribute('data-track'));
    
    // Переключаем на выбранную песню
    currentTrack = trackIndex;
    audio.src = playlist[currentTrack];
    
    // Включаем песню
    audio.play();
    vinyl.classList.add('spin');
    needle.classList.add('playing');
    isPlaying = true;
    
    // Подсвечиваем активную строчку
    songButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
  });
});

// Подсвечиваем активную песню при автоматическом переключении
audio.addEventListener('play', function() {
  songButtons.forEach(btn => btn.classList.remove('active'));
  songButtons[currentTrack].classList.add('active');
});


audio.src = playlist[currentTrack];

function initHearts() {
  const heartCount = 25;
  
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    heartsContainer.appendChild(heart);
    hearts.push({
      element: heart,
      x: x,
      y: y,
      baseX: x,
      baseY: y
    });
  }
}



// Сердечки Аружан
document.addEventListener('mousemove', function(e) {
  hearts.forEach(heart => {
    const heartRect = heart.element.getBoundingClientRect();
    const heartCenterX = heartRect.left + heartRect.width / 2;
    const heartCenterY = heartRect.top + heartRect.height / 2;
    
    const dx = heartCenterX - e.clientX;
    const dy = heartCenterY - e.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const influenceRadius = 100;
    
    if (distance < influenceRadius && distance > 0) {
      const force = (influenceRadius - distance) / influenceRadius;
      const pushDistance = 50 * force; 
      
      const angle = Math.atan2(dy, dx);
      const pushX = Math.cos(angle) * pushDistance;
      const pushY = Math.sin(angle) * pushDistance;
      
      heart.x += pushX;
      heart.y += pushY;
      
      heart.element.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
      heart.element.style.left = heart.x + 'px';
      heart.element.style.top = heart.y + 'px';
    }
  });
});



// игла
needle.addEventListener('click', function() {
  if (!isPlaying) {
    audio.play();
    vinyl.classList.add('spin');
    needle.classList.add('playing');
    isPlaying = true;
  } else {
    audio.pause();
    vinyl.classList.remove('spin');
    needle.classList.remove('playing');
    isPlaying = false;
  }
});

vinyl.addEventListener('click', function() {
  needle.click();
});

hearts.forEach(heart => {
  heart.element.addEventListener('click', function(e) {
    createHeartBurst(e.clientX, e.clientY);
  });
});

function createHeartBurst(x, y) {
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.background = '#8b1e2d';
    particle.style.transform = 'rotate(45deg)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 100 + Math.random() * 100;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.animate([
      { 
        transform: 'translate(0, 0) rotate(45deg) scale(1)', 
        opacity: 1 
      },
      { 
        transform: `translate(${tx}px, ${ty}px) rotate(45deg) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.4, 0.0, 0.6, 1)'
    });
    
    setTimeout(() => particle.remove(), 800);
  }
}

// ин
window.addEventListener('load', function() {
  initHearts();
});


// пр сонг
audio.addEventListener('ended', function() {
  currentTrack = (currentTrack + 1) % playlist.length; // Зацикливание
  audio.src = playlist[currentTrack];
  
  if (isPlaying) {
    audio.play();
  } else {
    vinyl.classList.remove('spin');
    needle.classList.remove('playing');
  }
});