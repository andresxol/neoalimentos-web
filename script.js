// ==========================================================================
// Neoalimentos Web - Interactive Dynamics (Molecules & Counters)
// ==========================================================================

// 1. Interactive Molecule Canvas
const canvas = document.getElementById("molecule-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    let particlesArray = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) {
                this.size -= 0.005;
            } else {
                this.size = Math.random() * 2 + 1;
            }
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 9000;
        // Limit max particles to preserve performance on ultra-wide screens
        numberOfParticles = Math.min(numberOfParticles, 120);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 10000);
                    if (opacityValue > 0) {
                        ctx.strokeStyle = 'rgba(0, 242, 254,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
    }

    window.addEventListener('resize', function(){
        resizeCanvas();
        init();
    });

    init();
    animate();
}

// 2. Animated Stats Counters
const counters = document.querySelectorAll('.counter');
const speed = 50;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace(/\D/g, '');
            const suffix = counter.getAttribute('data-suffix') || '';
            const inc = Math.max(1, Math.ceil(target / speed));

            if (count < target) {
                counter.innerText = '+' + Math.min(target, count + inc) + suffix;
                setTimeout(updateCount, 40);
            } else {
                counter.innerText = '+' + target + suffix;
            }
        };
        updateCount();
    });
};

let statsAnimated = false;
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
    }
}, { threshold: 0.2 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}
