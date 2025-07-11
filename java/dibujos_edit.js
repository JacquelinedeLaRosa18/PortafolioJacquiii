// ../js/dibujos_edit.js
/*
document.addEventListener('DOMContentLoaded', function() {
    const editModeToggleBtn = document.getElementById('editModeToggle');
    const body = document.body;

    if (editModeToggleBtn) {
        editModeToggleBtn.addEventListener('click', function() {
            // Alterna la clase 'editing-mode-active' en el body
            body.classList.toggle('editing-mode-active');

            // Cambia el texto del botón según el estado
            if (body.classList.contains('editing-mode-active')) {
                editModeToggleBtn.textContent = 'Salir Edición';
            } else {
                editModeToggleBtn.textContent = 'Modo Edición';
            }
        });
    }
});


/*cambios -----------------*/

// ../js/dibujos_edit.js
document.addEventListener('DOMContentLoaded', () => {
    const editModeToggle = document.getElementById('editModeToggle');
    const galleryContainer = document.getElementById('gallery-container');
    const undoMessageContainer = document.getElementById('undo-message-container');
    const undoMessageText = document.getElementById('undo-message-text');
    const undoButton = document.getElementById('undo-button');

    let lastDeletedImage = null; // Para almacenar la imagen eliminada para la función de deshacer

    // Función para activar/desactivar el modo edición
    editModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('editing-mode-active');
        
        // Opcional: Cambiar el texto o el icono del botón de toggle si el modo cambia visualmente
        // Actualmente, el CSS maneja esto para el hover, pero si quieres un cambio permanente en el texto al clic:
        // const isEditing = document.body.classList.contains('editing-mode-active');
        // if (isEditing) {
        //     editModeToggle.querySelector('span').textContent = 'Salir Edición';
        //     // Puedes cambiar el src del img aquí si quieres otro icono para el modo activo
        //     // editModeToggle.querySelector('img').src = 'ruta/a/otro/icono.png';
        // } else {
        //     editModeToggle.querySelector('span').textContent = 'Modo Edición';
        //     // Restablecer el icono original si lo cambiaste
        //     // editModeToggle.querySelector('img').src = 'ruta/a/icono/original.png';
        // }
    });

    // Delegación de eventos para los botones de editar y borrar (se añaden dinámicamente)
    galleryContainer.addEventListener('click', (event) => {
        const target = event.target;
        
        // Lógica para el botón Borrar
        if (target.classList.contains('delete-btn')) {
            const imageContainer = target.closest('.imagen');
            if (imageContainer) {
                // Guarda la imagen antes de eliminarla
                lastDeletedImage = imageContainer.cloneNode(true); // Clona para deshacer
                const parent = imageContainer.parentNode;
                const nextSibling = imageContainer.nextElementSibling; // Para reinsertar en la posición correcta

                imageContainer.remove(); // Elimina la imagen del DOM

                // Muestra el mensaje de deshacer
                undoMessageText.textContent = `"${lastDeletedImage.querySelector('h2').textContent}" eliminada.`;
                undoMessageContainer.classList.add('show');

                // Almacena la referencia para deshacer
                lastDeletedImage.originalParent = parent;
                lastDeletedImage.originalNextSibling = nextSibling;

                // Ocultar el mensaje de deshacer automáticamente después de un tiempo
                setTimeout(() => {
                    undoMessageContainer.classList.remove('show');
                }, 5000); // 5 segundos
            }
        }

        // Lógica para el botón Editar (esto es solo un placeholder, la lógica real de edición iría aquí)
        if (target.classList.contains('edit-btn')) {
            const imageContainer = target.closest('.imagen');
            if (imageContainer) {
                const titleElement = imageContainer.querySelector('.overlay h2');
                const priceElement = imageContainer.querySelector('.overlay p');

                // Ejemplo simple: editar directamente el texto (puedes expandir con modales, etc.)
                const newTitle = prompt('Editar título:', titleElement.textContent);
                if (newTitle !== null && newTitle.trim() !== '') {
                    titleElement.textContent = newTitle;
                }

                const newPrice = prompt('Editar precio:', priceElement.textContent);
                if (newPrice !== null && newPrice.trim() !== '') {
                    priceElement.textContent = newPrice;
                }
            }
        }
    });

    // Lógica para el botón Deshacer
    undoButton.addEventListener('click', () => {
        if (lastDeletedImage) {
            const parent = lastDeletedImage.originalParent;
            const nextSibling = lastDeletedImage.originalNextSibling;

            if (nextSibling) {
                parent.insertBefore(lastDeletedImage, nextSibling);
            } else {
                parent.appendChild(lastDeletedImage);
            }
            
            lastDeletedImage = null; // Limpia la referencia después de deshacer
            undoMessageContainer.classList.remove('show'); // Oculta el mensaje
        }
    });
});