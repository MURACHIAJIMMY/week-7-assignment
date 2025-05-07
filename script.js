// Advanced Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 1000;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = particle.style.height = `${Math.random() * 5}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animation = 
                `particle-stream ${2 + Math.random() * 8}s linear infinite`;
            document.body.appendChild(particle);
            this.particles.push(particle);
        }
    }

    updateParticles(color) {
        this.particles.forEach(particle => {
            particle.style.background = color;
            particle.style.animationDelay = `${Math.random() * 5}s`;
        });
    }
}

// Holographic Cube Controller
class CubeController {
    constructor() {
        this.cube = document.getElementById('holoCube');
        this.rotation = { x: 0, y: 0 };
        this.isRotating = false;
        this.init();
    }

    init() {
        this.cube.addEventListener('mouseenter', () => this.isRotating = true);
        this.cube.addEventListener('mouseleave', () => this.isRotating = false);
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isRotating) return;
            this.rotation.y = (e.clientX / window.innerWidth - 0.5) * 720;
            this.rotation.x = (e.clientY / window.innerHeight - 0.5) * 720;
            this.updateCube();
        });
    }

    updateCube() {
        this.cube.style.transform = 
            `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg)`;
    }

    toggleCube() {
        this.cube.style.display = this.cube.style.display === 'none' ? 'block' : 'none';
    }
}

// Theme Manager with LocalStorage
class ThemeManager {
    constructor() {
        this.colorPicker = document.getElementById('colorPicker');
        this.loadSettings();
        this.initColorPicker();
    }

    initColorPicker() {
        this.colorPicker.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--neon-primary', e.target.value);
            particleSystem.updateParticles(e.target.value);
        });
    }

    saveSettings() {
        const settings = {
            neonColor: getComputedStyle(document.documentElement)
                .getPropertyValue('--neon-primary'),
            cubeVisible: document.getElementById('holoCube').style.display !== 'none'
        };
        localStorage.setItem('neoMatrixSettings', JSON.stringify(settings));
        this.showNotification('PROFILE SAVED TO LOCAL CACHE');
    }

    loadSettings() {
        const saved = JSON.parse(localStorage.getItem('neoMatrixSettings'));
        if (saved) {
            document.documentElement.style.setProperty('--neon-primary', saved.neonColor);
            document.getElementById('holoCube').style.display = 
                saved.cubeVisible ? 'block' : 'none';
        }
    }

    showNotification(text) {
        const notification = document.createElement('div');
        notification.textContent = text;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.color = 'var(--neon-primary)';
        notification.style.animation = 'float 2s ease-out';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
}

// Initialize Systems
const particleSystem = new ParticleSystem();
const cubeController = new CubeController();
const themeManager = new ThemeManager();

// Event Listeners
document.getElementById('toggleCube').addEventListener('click', () => {
    cubeController.toggleCube();
});

document.getElementById('saveSettings').addEventListener('click', () => {
    themeManager.saveSettings();
});

document.getElementById('matrixMode').addEventListener('click', () => {
    document.body.classList.toggle('matrix-mode');
    particleSystem.updateParticles(
        document.body.classList.contains('matrix-mode') ? '#0f0' : ''
    );
});

// Touch Support
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (cubeController.isRotating) {
        const touch = e.touches[0];
        cubeController.rotation.y = (touch.clientX / window.innerWidth - 0.5) * 720;
        cubeController.rotation.x = (touch.clientY / window.innerHeight - 0.5) * 720;
        cubeController.updateCube();
    }
});

// Audio Visualization (Bonus)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;
    });