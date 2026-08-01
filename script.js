// Анимация фоновых искр
const canvas = document.getElementById('sparks-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.8 + 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ff8c00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff8c00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const particles = Array.from({ length: 45 }, () => new Particle());

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// Отправка формы заявки в Telegram
document.getElementById('telegram-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    const originalText = btn.textContent;
    
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    const name = document.getElementById('user-name').value;
    const contact = document.getElementById('user-contact').value;
    const message = document.getElementById('user-message').value;

    const botToken = '7716942691:AAHkCq336Rj4P13mDkGg-d0iR9fR--272Bw';
    const chatId = '7026743912';

    const text = `🚀 *Новая заявка с сайта!*\n\n👤 *Имя:* ${name}\n📞 *Контакт:* ${contact}\n💬 *Сообщение:* ${message || 'Не указано'}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            btn.textContent = 'Заявка отправлена!';
            btn.style.backgroundColor = '#4caf50';
            this.reset();
        } else {
            btn.textContent = 'Ошибка! Попробуйте позже';
            btn.style.backgroundColor = '#f44336';
        }
    } catch (err) {
        btn.textContent = 'Ошибка отправки';
        btn.style.backgroundColor = '#f44336';
    }

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
    }, 4000);
});
