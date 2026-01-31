// script.js - VERSÃO COM DESIGN EMBUTIDO
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let money = 600;
let lives = 10;
let currentWave = 0;
let enemies = [];
let projectiles = [];

const path = [{x: 0, y: 300}, {x: 150, y: 300}, {x: 150, y: 100}, {x: 450, y: 100}, {x: 450, y: 500}, {x: 750, y: 500}];

const spots = [
    {x: 80, y: 230, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 220, y: 150, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 400, y: 200, tower: null, menuOpen: false, selectedType: null, sellOpen: false},
    {x: 520, y: 400, tower: null, menuOpen: false, selectedType: null, sellOpen: false}
];

// --- MOTOR GRÁFICO (Aqui eu "embuti" o visual) ---

function drawYorph(x, y, isAttacking) {
    ctx.save();
    ctx.translate(x, y);
    // Corpo Metamorfo Azul
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.ellipse(0, -15, 12, 18, 0, 0, Math.PI * 2); ctx.fill();
    // Capa de Penas
    ctx.fillStyle = "#2980b9";
    ctx.beginPath(); ctx.moveTo(-12, -15); ctx.lineTo(-18, 5); ctx.lineTo(0, -5); ctx.fill();
    // Cabeça
    ctx.fillStyle = "#ffdbac";
    ctx.beginPath(); ctx.arc(0, -32, 8, 0, Math.PI * 2); ctx.fill();
    // Se estiver atacando, brilha uma aura azul
    if(isAttacking) {
        ctx.strokeStyle = "#82ccdd"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, -32, 12, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
}

function drawMolovee(x, y, isAttacking) {
    ctx.save();
    ctx.translate(x, y);
    // Pele de Hiena (Amarelo Ouro)
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(-10, -20, 20, 20);
    // Capuz de Caveira
    ctx.fillStyle = "#ecf0f1";
    ctx.beginPath(); ctx.arc(0, -28, 9, Math.PI, 0); ctx.fill();
    // Olhos venenosos
    ctx.fillStyle = isAttacking ? "#2ecc71" : "#34495e";
    ctx.fillRect(-4, -28, 2, 2); ctx.fillRect(2, -28, 2, 2);
    ctx.restore();
}

function drawBrutane(x, y, isAttacking) {
    ctx.save();
    ctx.translate(x, y);
    // Lanceiro com Flores
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, -25); ctx.lineTo(8, -25); ctx.fill();
    // Flores Rosas
    ctx.fillStyle = "#ff9ff3";
    ctx.beginPath(); ctx.arc(-5, -20, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -10, 4, 0, Math.PI*2); ctx.fill();
    // Lança
    ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3;
    let offset = isAttacking ? -15 : 0;
    ctx.beginPath(); ctx.moveTo(5, -20); ctx.lineTo(20 + offset, -40 + offset); ctx.stroke();
    ctx.restore();
}

// --- LOGICA DE JOGO ---

function loop() {
    ctx.clearRect(0, 0, 800, 600);
    
    // Estrada de terra texturizada
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 44; ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y); path.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 34; ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y); path.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();

    spots.forEach(s => {
        // Tronco detalhado
        ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.arc(s.x, s.y, 25, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 4; ctx.stroke();
        
        if(s.tower) {
            let attacking = s.tower.timer > s.tower.fireRate - 5;
            if(s.tower.name === 'Yorph') drawYorph(s.x, s.y, attacking);
            if(s.tower.name === 'Molovee') drawMolovee(s.x, s.y, attacking);
            if(s.tower.name === 'Brutane') drawBrutane(s.x, s.y, attacking);
            
            s.tower.timer++;
            // Lógica de disparo (simplificada para o exemplo)
            if(s.tower.timer > s.tower.fireRate) {
                let target = enemies[0]; 
                if(target && Math.hypot(target.x - s.x, target.y - s.y) < s.tower.range) {
                    projectiles.push({x: s.x, y: s.y-20, target: target, damage: s.tower.damage, color: s.tower.color});
                    s.tower.timer = 0;
                }
            }
        }
        
        // Menus e Venda (Manter lógica anterior)
        if(s.menuOpen) drawMenu(s);
        if(s.sellOpen) drawSell(s);
    });

    // Inimigos e Projéteis
    enemies.forEach((en, i) => {
        en.update();
        // Desenha inimigos como humanoides simples mas com cores de aldeia
        drawPerson(en.x, en.y, en.isMarked ? '#7f8c8d' : '#8B4513', en.type);
        if(en.health <= 0) enemies.splice(i, 1);
    });

    requestAnimationFrame(loop);
}
// (Restante das funções de controle...)
