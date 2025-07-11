document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const axolotLogo = document.getElementById('axolot-logo');

    // --- Configuración de usuario y contraseña (¡IMPORTANTE: Solo para DEMO!) ---
    const CORRECT_USERNAME = 'Jacquiii'; // <-- CAMBIA ESTO por tu usuario
    const CORRECT_PASSWORD = 'PinguinHug'; // <-- CAMBIA ESTO por tu contraseña

    // --- Lógica del formulario de inicio de sesión ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredUsername === CORRECT_USERNAME && enteredPassword === CORRECT_PASSWORD) {
            errorMessage.textContent = ''; 
            window.location.href = '../index/index.html'; 
        } else {
            errorMessage.textContent = 'Usuario o contraseña incorrectos.';
        }
    });

    // --- Animación del logo de Axolot (DVD Screensaver + Interacción con cursor) ---

    let x, y; // Posición actual del logo
    let dx = 1.5; // <-- Velocidad en X (más lento)
    let dy = 1.5; // <-- Velocidad en Y (más lento)
    const rotationSpeed = 0.5; // Grados por frame para la rotación constante (manejada por CSS)
    let currentRotation = 0; // Para mantener el seguimiento de la rotación para el efecto de "alejarse"

    let logoWidth, logoHeight; // Dimensiones del logo

    // Función para inicializar o reajustar la posición del logo
    function initializeLogoPosition() {
        // Asegurarse de que el logo ya está renderizado para obtener sus dimensiones
        logoWidth = axolotLogo.offsetWidth;
        logoHeight = axolotLogo.offsetHeight;

        // Iniciar en una posición aleatoria dentro de los límites de la ventana
        x = Math.random() * (window.innerWidth - logoWidth);
        y = Math.random() * (window.innerHeight - logoHeight);

        // Asegurarse de que el logo no empiece fuera de la pantalla
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + logoWidth > window.innerWidth) x = window.innerWidth - logoWidth;
        if (y + logoHeight > window.innerHeight) y = window.innerHeight - logoHeight;

        axolotLogo.style.left = `${x}px`;
        axolotLogo.style.top = `${y}px`;
    }

    // Función para actualizar la posición y rotación del logo
    function updateLogoPosition() {
        // Mover el logo
        x += dx;
        y += dy;

        // Rebotar en los bordes
        if (x + logoWidth > window.innerWidth || x < 0) {
            dx = -dx;
            // Ajustar posición para evitar que se pegue al borde y para que sea visible
            if (x < 0) x = 0;
            if (x + logoWidth > window.innerWidth) x = window.innerWidth - logoWidth;
        }
        if (y + logoHeight > window.innerHeight || y < 0) {
            dy = -dy;
            // Ajustar posición para evitar que se pegue al borde y para que sea visible
            if (y < 0) y = 0;
            if (y + logoHeight > window.innerHeight) y = window.innerHeight - logoHeight;
        }

        // Aplicar rotación constante (si se maneja por CSS animation, esto no es estrictamente necesario)
        // Pero lo mantenemos para poder combinarlo con el efecto de "alejarse"
        currentRotation = (currentRotation + rotationSpeed) % 360;

        axolotLogo.style.left = `${x}px`;
        axolotLogo.style.top = `${y}px`;
        // La rotación base siempre se aplica
        axolotLogo.style.transform = `rotate(${currentRotation}deg)`; 
    }

    let animationFrameId; 

    function startAnimation() {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function animate() {
        updateLogoPosition();
        animationFrameId = requestAnimationFrame(animate);
    }

    // Iniciar la posición inicial del logo
    initializeLogoPosition();
    // Iniciar la animación cuando la página carga
    startAnimation();

    // Reajustar la posición y reiniciar la animación si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
        stopAnimation(); 
        initializeLogoPosition(); 
        startAnimation(); 
    });

    // --- Efecto de "alejarse" al pasar el cursor cerca ---
    const influenceRadius = 180; // <-- Radio de influencia del cursor (más grande)
    const pushStrengthFactor = 1.2; // <-- Fuerza del "empuje" (ligeramente ajustada)

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const logoRect = axolotLogo.getBoundingClientRect();
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;

        const distanceX = mouseX - logoCenterX;
        const distanceY = mouseY - logoCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < influenceRadius && distance > 0) { 
            const pushMagnitude = (1 - (distance / influenceRadius)) * pushStrengthFactor; 
            const angle = Math.atan2(distanceY, distanceX);

            const offsetX = -Math.cos(angle) * pushMagnitude * 25; // <-- Ajustado para un empuje más notable
            const offsetY = -Math.sin(angle) * pushMagnitude * 25;

            // Combinar la rotación constante con el desplazamiento temporal
            axolotLogo.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${currentRotation}deg)`;
        } else {
            // Cuando el cursor está fuera del radio, solo aplicar la rotación constante
            axolotLogo.style.transform = `rotate(${currentRotation}deg)`;
        }
    });
});