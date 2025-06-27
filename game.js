// Game state
let cookies = 0;
let cps = 0;
const upgrades = [
    { name: "Cursor", cost: 15, effect: 0.1, owned: 0 },
    { name: "Grandma", cost: 100, effect: 1, owned: 0 },
    { name: "Farm", cost: 1100, effect: 8, owned: 0 }
];

// DOM elements
const counterEl = document.querySelector('.counter');
const cpsEl = document.querySelector('.cps');
const canvas = document.querySelector('.cookie-canvas');
const ctx = canvas.getContext('2d');
const upgradesEl = document.querySelector('.upgrades');
const saveBtn = document.querySelector('.save');
const resetBtn = document.querySelector('.reset');

// Draw cookie with chips
function drawCookie() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cookie base
    ctx.beginPath();
    ctx.fillStyle = '#E3C9A0';
    ctx.arc(100, 100, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Chocolate chips (random positions)
    const chipCount = 10 + Math.floor(cookies/1000); // More chips as you progress
    for (let i = 0; i < chipCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 50;
        const x = 100 + Math.cos(angle) * distance;
        const y = 100 + Math.sin(angle) * distance;
        const size = 5 + Math.random() * 8;
        
        ctx.beginPath();
        ctx.fillStyle = '#5C2E00';
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Game loop
function update() {
    counterEl.textContent = `Cookies: ${Math.floor(cookies)}`;
    cpsEl.textContent = `Per Second: ${cps.toFixed(1)}`;
    drawCookie(); // Redraw cookie with updated state
}

function gameLoop() {
    cookies += cps / 10;
    update();
    requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener('click', () => {
    cookies += 1;
    // Visual feedback
    canvas.style.transform = 'scale(0.95)';
    setTimeout(() => canvas.style.transform = 'scale(1)', 100);
    update();
});

saveBtn.addEventListener('click', () => {
    localStorage.setItem('cookieClicker', JSON.stringify({
        cookies,
        cps,
        upgrades
    }));
    alert('Game saved!');
});

resetBtn.addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
        cookies = 0;
        cps = 0;
        upgrades.forEach(u => u.owned = 0);
        localStorage.removeItem('cookieClicker');
        update();
        renderUpgrades();
    }
});

// Upgrade system
function renderUpgrades() {
    upgradesEl.innerHTML = '';
    upgrades.forEach(upgrade => {
        const div = document.createElement('div');
        div.className = 'upgrade';
        const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.owned));
        div.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>+${upgrade.effect} cookies/sec</p>
            <p>Cost: ${cost} cookies (Owned: ${upgrade.owned})</p>
            <button ${cookies >= cost ? '' : 'disabled'}>Buy</button>
        `;
        div.querySelector('button').addEventListener('click', () => {
            if (cookies >= cost) {
                cookies -= cost;
                upgrade.owned++;
                cps += upgrade.effect;
                renderUpgrades();
                update();
            }
        });
        upgradesEl.appendChild(div);
    });
}

// Load game
function loadGame() {
    const saved = localStorage.getItem('cookieClicker');
    if (saved) {
        const data = JSON.parse(saved);
        cookies = data.cookies || 0;
        cps = data.cps || 0;
        data.upgrades?.forEach((savedUpgrade, i) => {
            if (upgrades[i]) upgrades[i].owned = savedUpgrade.owned;
        });
    }
}

// Initialize
loadGame();
drawCookie();
renderUpgrades();
update();
gameLoop();
