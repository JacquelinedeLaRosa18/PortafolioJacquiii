// public/java/upload.js

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM (¡usando los IDs de tu HTML!)
    const uploadForm = document.getElementById('postDetailsForm'); 
    const imageUploadInput = document.getElementById('imageUploadInput'); 
    const imagePreview = document.getElementById('imagePreview'); 
    const fileNameDisplay = document.getElementById('fileNameDisplay'); 

    const postTitleInput = document.getElementById('postTitle'); 
    const postPriceInput = document.getElementById('postPrice'); 
    const postCategorySelect = document.getElementById('postCategory'); 
    const uploadOverallStatus = document.getElementById('uploadOverallStatus'); 

    // Asegúrate de que el formulario exista antes de añadir el listener
    if (!uploadForm) {
        console.warn("Formulario de subida (postDetailsForm) no encontrado. El script de subida no se inicializará.");
        return;
    }

    // --- Lógica para la previsualización de la imagen ---
    document.querySelector('.file-input-button').addEventListener('click', function() {
        imageUploadInput.click(); 
    });

    imageUploadInput.addEventListener('change', function() {
        const file = this.files[0]; 

        if (file) {
            fileNameDisplay.textContent = file.name;

            const reader = new FileReader();

            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block'; 
                imagePreview.alt = `Vista previa de ${file.name}`;
            };

            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
            fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        }
    });

    // --- Lógica para el envío del formulario (guardado en localStorage) ---
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Validaciones básicas
        if (imageUploadInput.files.length === 0) {
            uploadOverallStatus.textContent = 'Por favor, selecciona una imagen o video para subir.';
            uploadOverallStatus.style.color = 'red';
            return;
        }

        const file = imageUploadInput.files[0];
        const reader = new FileReader();

        // Límite de tamaño para almacenamiento local (ajusta si es necesario)
        // He ajustado a 300KB para ser más conservador y evitar el QuotaExceededError
        // Si tus imágenes son mayores que esto, tendrás que reducirlas.
        const MAX_SIZE_KB = 300; 
        if (file.size > MAX_SIZE_KB * 1024) {
            uploadOverallStatus.textContent = `El archivo es demasiado grande (${(file.size / 1024).toFixed(2)} KB). Máximo ${MAX_SIZE_KB}KB permitido para almacenamiento local.`;
            uploadOverallStatus.style.color = 'orange';
            return;
        }

        reader.onloadend = function() {
            const base64Content = reader.result; 

            const newPost = {
                id: 'dynamic-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5), 
                titulo: postTitleInput.value || 'Sin Título',
                precio: postPriceInput.value || 'No a la Venta',
                categoria: postCategorySelect.value,
                urlImagen: base64Content, 
                fechaSubida: new Date().toISOString(),
                activo: true
            };

            // *** MODIFICACIÓN CLAVE PARA LA PRESENTACIÓN ***
            // Limpia TODO el localStorage antes de guardar, para asegurar espacio.
            // Esto es una medida de emergencia para evitar QuotaExceededError.
            localStorage.clear(); 
            console.log("LocalStorage limpiado antes de guardar la nueva publicación.");
            // *** FIN MODIFICACIÓN CLAVE ***

            // Recupera publicaciones existentes (después de la limpieza, solo serán las nuevas que añadas en esta sesión si no recargas)
            let portfolioPosts = JSON.parse(localStorage.getItem('portfolioPosts')) || [];
            portfolioPosts.push(newPost);
            
            try {
                localStorage.setItem('portfolioPosts', JSON.stringify(portfolioPosts));
                uploadOverallStatus.textContent = '¡Publicación subida y guardada localmente con éxito!';
                uploadOverallStatus.style.color = 'green';

                // Limpiar formulario y previsualización
                uploadForm.reset(); 
                imagePreview.src = '#';
                imagePreview.style.display = 'none'; 
                fileNameDisplay.textContent = 'Ningún archivo seleccionado';

                // Redirigir a la galería después de un breve retraso
                setTimeout(() => {
                    if (newPost.categoria === "ilustracion") {
                        window.location.href = "ilustraciones.html";
                    } else if (newPost.categoria === "tradicional") {
                        window.location.href = "dibujos.html"; 
                    }
                }, 1000); // Redirige más rápido
            } catch (e) {
                // Si aún con la limpieza falla (ej. la imagen es *demasiado* grande por sí sola), captura el error
                if (e.name === 'QuotaExceededError') {
                    uploadOverallStatus.textContent = `Error: La imagen es demasiado grande para guardar en el navegador, incluso después de limpiar. Intenta con una imagen más pequeña.`;
                    uploadOverallStatus.style.color = 'red';
                } else {
                    uploadOverallStatus.textContent = `Error al guardar: ${e.message}`;
                    uploadOverallStatus.style.color = 'red';
                }
                console.error("Error al guardar en localStorage:", e);
            }
        };

        reader.onerror = function() {
            uploadOverallStatus.textContent = 'Error al leer el archivo. Intenta de nuevo.';
            uploadOverallStatus.style.color = 'red';
        };

        reader.readAsDataURL(file); 
    });
});