// Game state
let cookies = 0;
let cookiesPerClick = 1;
let cookiesPerSecond = 0;
let totalCookiesClicked = 0;

// Upgrades data
const upgrades = [
    {
        id: 'cursor',
        name: 'Cursor',
        description: 'Automatically clicks for you every 10 seconds',
        baseCost: 15,
        owned: 0,
        effect: 0.1,
        unlockAt: 0
    },
    {
        id: 'grandma',
        name: 'Grandma',
        description: 'A nice grandma to bake more cookies',
        baseCost: 100,
        owned: 0,
        effect: 1,
        unlockAt: 10
    },
    {
        id: 'farm',
        name: 'Farm',
        description: 'Grows cookie plants from cookie seeds',
        baseCost: 1100,
        owned: 0,
        effect: 8,
        unlockAt: 50
    },
    {
        id: 'mine',
        name: 'Mine',
        description: 'Mines out cookie dough and chocolate chips',
        baseCost: 12000,
        owned: 0,
        effect: 47,
        unlockAt: 200
    },
    {
        id: 'factory',
        name: 'Factory',
        description: 'Produces large quantities of cookies',
        baseCost: 130000,
        owned: 0,
        effect: 260,
        unlockAt: 500
    },
    {
        id: 'bank',
        name: 'Bank',
        description: 'Generates cookies from interest',
        baseCost: 1400000,
        owned: 0,
        effect: 1400,
        unlockAt: 2000
    },
    {
        id: 'temple',
        name: 'Temple',
        description: 'Full of precious, ancient cookies',
        baseCost: 20000000,
        owned: 0,
        effect: 7800,
        unlockAt: 5000
    }
];

const clickUpgrades = [
    {
        id: 'plastic-mouse',
        name: 'Plastic Mouse',
        description: 'Better mouse means more clicks per cookie',
        baseCost: 100,
        owned: 0,
        effect: 1,
        unlockAt: 20
    },
    {
        id: 'iron-mouse',
        name: 'Iron Mouse',
        description: 'Even better clicking power',
        baseCost: 500,
        owned: 0,
        effect: 5,
        unlockAt: 100
    },
    {
        id: 'golden-mouse',
        name: 'Golden Mouse',
        description: 'Shiny and effective',
        baseCost: 3000,
        owned: 0,
        effect: 10,
        unlockAt: 500
    },
    {
        id: 'diamond-mouse',
        name: 'Diamond Mouse',
        description: 'The ultimate clicking experience',
        baseCost: 10000,
        owned: 0,
        effect: 25,
        unlockAt: 2000
    }
];

// DOM elements
const cookieElement = document.getElementById('cookie');
const counterElement = document.getElementById('counter');
const cpsElement = document.getElementById('cookies-per-second');
const upgradesContainer = document.getElementById('upgrades-container');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');

// Initialize the game
function init() {
    loadGame();
    renderUpgrades();
    updateDisplay();
    
    setInterval(gameLoop, 1000);
    
    cookieElement.addEventListener('click', clickCookie);
    saveBtn.addEventListener('click', saveGame);
    resetBtn.addEventListener('click', resetGame);
}

function gameLoop() {
    cookies += cookiesPerSecond;
    updateDisplay();
}

function clickCookie() {
    cookies += cookiesPerClick;
    totalCookiesClicked += cookiesPerClick;
    updateDisplay();
}

function buyUpgrade(upgrade) {
    const cost = calculateCost(upgrade);
    
    if (cookies >= cost) {
        cookies -= cost;
        upgrade.owned += 1;
        updateCookiesPerSecond();
        updateDisplay();
        renderUpgrades();
    }
}

function buyClickUpgrade(upgrade) {
    const cost = calculateCost(upgrade);
    
    if (cookies >= cost) {
        cookies -= cost;
        upgrade.owned += 1;
        cookiesPerClick += upgrade.effect;
        updateDisplay();
        renderUpgrades();
    }
}

function calculateCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
}

function updateCookiesPerSecond() {
    cookiesPerSecond = upgrades.reduce((total, upgrade) => {
        return total + (upgrade.owned * upgrade.effect);
    }, 0);
}

function updateDisplay() {
    counterElement.textContent = `Cookies: ${Math.floor(cookies)}`;
    cpsElement.textContent = `Cookies per second: ${cookiesPerSecond.toFixed(1)}`;
}

function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    
    const clickUpgradesTitle = document.createElement('h3');
    clickUpgradesTitle.textContent = 'Click Upgrades';
    upgradesContainer.appendChild(clickUpgradesTitle);
    
    clickUpgrades.forEach(upgrade => {
        if (totalCookiesClicked >= upgrade.unlockAt) {
            const cost = calculateCost(upgrade);
            const canAfford = cookies >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'upgrade-info';
            
            const nameSpan = document.createElement('div');
            nameSpan.className = 'upgrade-name';
            nameSpan.textContent = `${upgrade.name} (Owned: ${upgrade.owned})`;
            
            const descSpan = document.createElement('div');
            descSpan.className = 'upgrade-description';
            descSpan.textContent = upgrade.description;
            
            const effectSpan = document.createElement('div');
            effectSpan.className = 'upgrade-effect';
            effectSpan.textContent = `+${upgrade.effect} cookies per click`;
            
            const costSpan = document.createElement('div');
            costSpan.className = 'upgrade-cost';
            costSpan.textContent = `Cost: ${cost} cookies`;
            
            const buyBtn = document.createElement('button');
            buyBtn.textContent = 'Buy';
            buyBtn.disabled = !canAfford;
            buyBtn.addEventListener('click', () => buyClickUpgrade(upgrade));
            
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(descSpan);
            infoDiv.appendChild(effectSpan);
            infoDiv.appendChild(costSpan);
            
            upgradeElement.appendChild(infoDiv);
            upgradeElement.appendChild(buyBtn);
            
            upgradesContainer.appendChild(upgradeElement);
        }
    });
    
    const passiveUpgradesTitle = document.createElement('h3');
    passiveUpgradesTitle.textContent = 'Passive Upgrades';
    upgradesContainer.appendChild(passiveUpgradesTitle);
    
    upgrades.forEach(upgrade => {
        if (totalCookiesClicked >= upgrade.unlockAt) {
            const cost = calculateCost(upgrade);
            const canAfford = cookies >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'upgrade-info';
            
            const nameSpan = document.createElement('div');
            nameSpan.className = 'upgrade-name';
            nameSpan.textContent = `${upgrade.name} (Owned: ${upgrade.owned})`;
            
            const descSpan = document.createElement('div');
            descSpan.className = 'upgrade-description';
            descSpan.textContent = upgrade.description;
            
            const effectSpan = document.createElement('div');
            effectSpan.className = 'upgrade-effect';
            effectSpan.textContent = `+${upgrade.effect} cookies per second`;
            
            const costSpan = document.createElement('div');
            costSpan.className = 'upgrade-cost';
            costSpan.textContent = `Cost: ${cost} cookies`;
            
            const buyBtn = document.createElement('button');
            buyBtn.textContent = 'Buy';
            buyBtn.disabled = !canAfford;
            buyBtn.addEventListener('click', () => buyUpgrade(upgrade));
            
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(descSpan);
            infoDiv.appendChild(effectSpan);
            infoDiv.appendChild(costSpan);
            
            upgradeElement.appendChild(infoDiv);
            upgradeElement.appendChild(buyBtn);
            
            upgradesContainer.appendChild(upgradeElement);
        }
    });
}

function saveGame() {
    const gameState = {
        cookies,
        cookiesPerClick,
        totalCookiesClicked,
        upgrades: upgrades.map(upgrade => ({
            id: upgrade.id,
            owned: upgrade.owned
        })),
        clickUpgrades: clickUpgrades.map(upgrade => ({
            id: upgrade.id,
            owned: upgrade.owned
        }))
    };
    
    localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
    alert('Game saved!');
}

function loadGame() {
    const savedGame = localStorage.getItem('cookieClickerSave');
    
    if (savedGame) {
        try {
            const gameState = JSON.parse(savedGame);
            
            cookies = gameState.cookies || 0;
            cookiesPerClick = gameState.cookiesPerClick || 1;
            totalCookiesClicked = gameState.totalCookiesClicked || 0;
            
            if (gameState.upgrades) {
                gameState.upgrades.forEach(savedUpgrade => {
                    const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
                    if (upgrade) {
                        upgrade.owned = savedUpgrade.owned;
                    }
                });
            }
            
            if (gameState.clickUpgrades) {
                gameState.clickUpgrades.forEach(savedUpgrade => {
                    const upgrade = clickUpgrades.find(u => u.id === savedUpgrade.id);
                    if (upgrade) {
                        upgrade.owned = savedUpgrade.owned;
                        cookiesPerClick = 1 + clickUpgrades.reduce((total, upg) => {
                            return total + (upg.owned * upg.effect);
                        }, 0);
                    }
                });
            }
            
            updateCookiesPerSecond();
        } catch (e) {
            console.error('Failed to load saved game', e);
        }
    }
}

function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost.')) {
        cookies = 0;
        cookiesPerClick = 1;
        cookiesPerSecond = 0;
        totalCookiesClicked = 0;
        
        upgrades.forEach(upgrade => {
            upgrade.owned = 0;
        });
        
        clickUpgrades.forEach(upgrade => {
            upgrade.owned = 0;
        });
        
        localStorage.removeItem('cookieClickerSave');
        updateDisplay();
        renderUpgrades();
    }
}

window.onload = init;
