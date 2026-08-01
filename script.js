// ==========================================
// 1. АНИМАЦИЯ ИСКР
// ==========================================
const canvas = document.getElementById('sparks-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Spark {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2.5 + 0.8;
        
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.8 - 0.4;
        
        this.angle = Math.random() * Math.PI * 2;
        this.waveSpeed = Math.random() * 0.03 + 0.01;
        
        this.opacity = Math.random() * 0.7 + 0.3;
        this.fadeRate = Math.random() * 0.003 + 0.001;
        
        const hue = Math.random() * 25 + 15;
        this.color = `hsla(${hue}, 100%, 55%, `;
    }

    update() {
        this.y -= this.speedY;
        this.angle += this.waveSpeed;
        this.x += this.speedX + Math.sin(this.angle) * 0.6;

        this.opacity -= this.fadeRate;

        if (this.opacity <= 0 || this.y < -10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255, 140, 0, ${this.opacity})`;
        
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

const sparks = [];
const sparkCount = 70;

for (let i = 0; i < sparkCount; i++) {
    const spark = new Spark();
    spark.y = Math.random() * height;
    sparks.push(spark);
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    sparks.forEach(spark => {
        spark.update();
        spark.draw();
    });

    requestAnimationFrame(animate);
}

animate();


// ==========================================
// 2. ОТПРАВКА ФОРМЫ В TELEGRAM
// ==========================================

const TELEGRAM_TOKEN = '8681310533:AAGb1VrvNPu2WTzx6bs5y301GE9b2aUmf5E'; 
const TELEGRAM_CHAT_ID = '673791974'; 

const form = document.getElementById('telegram-form');
const submitBtn = document.getElementById('btn-submit');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Берем значения из полей
        const name = document.getElementById('user-name').value;
        const contact = document.getElementById('user-contact').value;
        const message = document.getElementById('user-message').value;

        // Формируем текст
        let text = `🚀 <b>Новая заявка с сайта AVD STUDIO!</b>\n\n`;
        text += `👤 <b>Имя:</b> ${name}\n`;
        text += `📱 <b>Контакты:</b> ${contact}\n`;
        text += `💬 <b>Сообщение:</b> ${message || 'Не указано'}`;

        // Меняем состояние кнопки
        submitBtn.disabled = true;
        submitBtn.innerText = 'Отправка...';

        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                parse_mode: 'HTML',
                text: text
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Спасибо! Ваша заявка успешно отправлена.');
                form.reset();
            } else {
                alert('Telegram вернул ошибку: ' + data.description + '\n\nВАЖНО: Найдите вашего бота в Telegram и нажмите START!');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось отправить сообщение. Проверьте подключение к интернету или отключите VPN.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Отправить заявку';
        });
    });
} else {
    console.error('Форма с id="telegram-form" не найдена!');
}
