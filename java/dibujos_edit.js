// public/java/dibujos_edit.js

document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('gallery-container');
    const editModeToggle = document.getElementById('editModeToggle');
    const undoMessageContainer = document.getElementById('undo-message-container');
    const undoMessageText = document.getElementById('undo-message-text');
    const undoButton = document.getElementById('undo-button');

    if (!galleryContainer) {
        console.warn("No se encontró el elemento 'gallery-container'. El script de galería no se inicializará.");
        return;
    }
    
    let isEditMode = false;
    let lastDeletedElement = null; 
    let lastDeletedData = null; 

    // Función principal para renderizar todas las publicaciones
    function renderPosts() {
        const currentPageCategory = galleryContainer.dataset.category; 
        if (!currentPageCategory) {
            console.error("El contenedor de la galería no tiene un atributo data-category. No se pueden cargar las publicaciones.");
            return;
        }

        let storedPosts = JSON.parse(localStorage.getItem('portfolioPosts')) || [];
        
        // 1. Recopilar las imágenes ya presentes en el HTML para la categoría actual
        // Crear un mapa de IDs de publicaciones predeterminadas ya presentes en el HTML
        const existingHtmlPostIds = new Set();
        const initialHtmlPosts = Array.from(galleryContainer.querySelectorAll('.imagen')).map(imageDiv => {
            const id = imageDiv.dataset.id; // Usamos el ID del dataset
            existingHtmlPostIds.add(id);
            
            const storedVersion = storedPosts.find(p => p.id === id); // Busca si hay una versión en localStorage

            return {
                id: id,
                titulo: imageDiv.querySelector('h2')?.textContent || 'Título Desconocido',
                precio: imageDiv.querySelector('p')?.textContent || 'Precio Desconocido',
                categoria: currentPageCategory,
                urlImagen: imageDiv.querySelector('img')?.src || '',
                fechaSubida: storedVersion?.fechaSubida || new Date().toISOString(), 
                activo: storedVersion?.activo === false ? false : true 
            };
        });

        // Filtrar y preparar los posts dinámicos o restaurados
        const dynamicOrRestoredPosts = storedPosts.filter(post => 
            // Debe ser un post que NO estaba inicialmente en el HTML de esta página
            !initialHtmlPosts.some(htmlPost => htmlPost.id === post.id) && 
            // Debe pertenecer a la categoría de la página actual
            post.categoria === currentPageCategory && 
            // Debe estar activo (no borrado)
            post.activo
        );

        // Limpiar solo los posts dinámicos del contenedor para evitar duplicados en re-render
        const currentDynamicElements = galleryContainer.querySelectorAll('.imagen[data-id^="dynamic-"]');
        currentDynamicElements.forEach(el => el.remove());

        // Ahora, añadir los posts dinámicos/restaurados al DOM
        dynamicOrRestoredPosts.forEach(post => {
            const newImageDiv = document.createElement('div');
            newImageDiv.classList.add('imagen');
            newImageDiv.dataset.id = post.id; // Asigna el ID dinámico

            newImageDiv.innerHTML = `
                <img src="${post.urlImagen}" alt="${post.titulo}">
                <div class="overlay">
                    <h2>${post.titulo}</h2>
                    <p>${post.precio}</p>
                    <div class="edit-buttons" style="display: none;">
                        <button class="edit-btn">Editar</button>
                        <button class="delete-btn">Borrar</button>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(newImageDiv);
        });

        // Una vez que todos los posts (HTML y localStorage) están en el DOM, inicializar modo de edición
        if (editModeToggle) {
            initializeEditMode();
        }
    }

    // Función para actualizar la visibilidad de los botones de edición
    window.initializeEditMode = function() {
        const images = galleryContainer.querySelectorAll('.imagen');
        images.forEach(image => {
            const editButtons = image.querySelector('.edit-buttons');
            const deleteButton = image.querySelector('.delete-btn');
            
            if (!editButtons || !deleteButton) {
                return; 
            }

            if (isEditMode) {
                editButtons.style.display = 'flex';
            } else {
                editButtons.style.display = 'none';
            }

            // Eliminar listeners previos para evitar duplicados
            deleteButton.removeEventListener('click', handleDeleteClick);
            // editButton.removeEventListener('click', handleEditClick); 

            // Añadir listeners
            deleteButton.addEventListener('click', handleDeleteClick);
            // editButton.addEventListener('click', handleEditClick); 
        });
    };

    function handleDeleteClick(event) {
        const imageDiv = event.currentTarget.closest('.imagen');
        const imageId = imageDiv.dataset.id;
        const imageTitle = imageDiv.querySelector('h2').textContent;

        const confirmDelete = confirm(`¿Estás seguro de que quieres borrar "${imageTitle}"?`);
        if (confirmDelete) {
            let storedPosts = JSON.parse(localStorage.getItem('portfolioPosts')) || [];
            let originalPostData = null;

            const indexInStorage = storedPosts.findIndex(post => post.id === imageId);

            if (indexInStorage !== -1) {
                originalPostData = { ...storedPosts[indexInStorage] }; 
                storedPosts[indexInStorage].activo = false; // Soft delete
                localStorage.setItem('portfolioPosts', JSON.stringify(storedPosts));
                console.log("Publicación marcada como inactiva en localStorage:", imageId);
            } else {
                // Si no está en localStorage, es una imagen predeterminada directamente del HTML.
                // La añadimos a localStorage como inactiva para que no se renderice en futuras cargas.
                const imgElement = imageDiv.querySelector('img');
                originalPostData = {
                    id: imageId,
                    titulo: imageTitle,
                    precio: imageDiv.querySelector('p')?.textContent || 'Precio Desconocido',
                    categoria: galleryContainer.dataset.category,
                    urlImagen: imgElement ? imgElement.src : '',
                    fechaSubida: new Date().toISOString(),
                    activo: false 
                };
                storedPosts.push(originalPostData);
                localStorage.setItem('portfolioPosts', JSON.stringify(storedPosts));
                console.log("Publicación HTML marcada como inactiva y guardada en localStorage:", imageId);
            }

            lastDeletedElement = imageDiv; 
            lastDeletedData = originalPostData; 

            imageDiv.remove(); // Remueve el elemento del DOM

            undoMessageText.textContent = `"${imageTitle}" borrada.`;
            undoMessageContainer.style.display = 'flex';
            
            // Ocultar mensaje de deshacer después de un tiempo
            setTimeout(() => {
                undoMessageContainer.style.display = 'none';
                lastDeletedElement = null; 
                lastDeletedData = null;
            }, 8000); 
        }
    }

    // --- LÓGICA DE MODO EDICIÓN (ICONOS Y BOTÓN) ---
    if (editModeToggle) {
        editModeToggle.addEventListener('click', function() {
            isEditMode = !isEditMode;
            const buttonSpan = editModeToggle.querySelector('span');
            const buttonIcon = editModeToggle.querySelector('img');

            if (isEditMode) {
                buttonSpan.textContent = "Salir Edición";
                editModeToggle.classList.add('active');
                if (buttonIcon) {
                    buttonIcon.src = '../img/icons/envio.png'; // Ruta corregida
                }
            } else {
                buttonSpan.textContent = "Modo Edición";
                editModeToggle.classList.remove('active');
                if (buttonIcon) {
                    buttonIcon.src = '../img/icons/lapiz.png'; // Ruta corregida
                }
            }
            initializeEditMode(); // Re-inicializa para aplicar estado a botones
        });

        // Botón Deshacer
        undoButton.addEventListener('click', function() {
            if (lastDeletedData) {
                let storedPosts = JSON.parse(localStorage.getItem('portfolioPosts')) || [];
                const indexToRestore = storedPosts.findIndex(post => post.id === lastDeletedData.id);

                if (indexToRestore !== -1) {
                    storedPosts[indexToRestore].activo = true; // Reactivar en localStorage
                    console.log("Publicación reactivada en localStorage:", lastDeletedData.id);
                } else {
                    lastDeletedData.activo = true; 
                    storedPosts.push(lastDeletedData); 
                    console.log("Publicación añadida de nuevo a localStorage y activada:", lastDeletedData.id);
                }
                localStorage.setItem('portfolioPosts', JSON.stringify(storedPosts));

                // Recargar la página para asegurar que todo se renderice correctamente
                // Esto es una solución simple para asegurar que los elementos HTML estáticos
                // que fueron "removidos" del DOM vuelvan a aparecer correctamente y que
                // los posts de localStorage se añadan.
                location.reload(); 
            
                undoMessageContainer.style.display = 'none';
                lastDeletedElement = null;
                lastDeletedData = null;
            }
        });
    } else {
        console.warn("Botón de modo edición no encontrado. Las funcionalidades de edición estarán deshabilitadas.");
    }

    // Llama a la función de renderizado inicial al cargar la página
    renderPosts();
});