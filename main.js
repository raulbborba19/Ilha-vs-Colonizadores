const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações iniciais
let money = 600;
let lives = 10;
let currentWave = 0;
let enemies = [];
let projectiles = [];

// O Caminho
const path = [{x:0, y:300}, {x:150, y:300}, {x:150, y:100}, {x:450, y:100}, {x:450, y:500}, {x:750, y:500}];

// Troncos
const spots = [
    {x: 80, y: 230, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 220, y: 150, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 400, y: 200, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 520, y: 400, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 350, y: 430, tower: null, menuOpen: false, selectedType: null, sellOpen: false}
];

const towerSpecs = {
    azul: { name: 'Yorph', color: '#3498db', price: 150, range: 140, damage: 15, fireRate: 40 },
    amarela: { name: 'Molovee', color: '#f1c40f', price: 250, range: 110, damage: 10, fireRate: 50 },
    vermelha: { name: 'Brutáne', color: '#e74c3c', price: 400, range: 220, damage: 60, fireRate: 100 }
};

// Funções de auxílio
function updateHUD() {
    document.getElementById('money').innerText = money;
    document.getElementById('lives').innerText = lives;
    document.getElementById('waveText').innerText = currentWave;
}

// Inimigos
class Enemy {
    constructor(type) {
        this.type = type;
        this.x = path[0].x; this.y = path[0].y;
        this.targetIdx = 1;
        this.health = 100; this.maxHealth = 100;
        this.speed = 1.2;
        this.isMarked = (type === 'cavaleiro');
    }
    update() {
        let target = path[this.targetIdx];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let dist = Math.hypot(dx, dy);
        if(dist < 5) {
            this.targetIdx++;
            if(this.targetIdx >= path.length) { lives--; this.health = -1; return; }
        }
        this.x += (dx/dist) * this.speed;
        this.y += (dy/dist) * this.speed;
    }
    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x-10, this.y-10, 20, 20); // Placeholder do inimigo
    }
}

// Loop Principal
function loop() {
    ctx.clearRect(0, 0, 800, 600);

    // Desenhar Estrada
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 40; ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();

    // Desenhar Troncos e Torres
    spots.forEach(s => {
        ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.arc(s.x, s.y, 25, 0, Math.PI*2); ctx.fill();
        if(s.tower) {
            ctx.fillStyle = s.tower.color;
            ctx.fillRect(s.x-15, s.y-30, 30, 30); // Placeholder da Torre
        }
    });

    enemies.forEach((en, i) => {
        en.update(); en.draw();
        if(en.health <= 0) enemies.splice(i, 1);
    });

    if(lives <= 0) { alert("Fim de jogo!"); location.reload(); }
    requestAnimationFrame(loop);
}

function startNextWave() {
    currentWave++;
    updateHUD();
    enemies.push(new Enemy('camponês'));
}

loop();
