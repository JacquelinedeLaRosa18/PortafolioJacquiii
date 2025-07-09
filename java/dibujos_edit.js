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

document.addEventListener('DOMContentLoaded', function() {
    const editModeToggleBtn = document.getElementById('editModeToggle');
    const body = document.body;
    const undoMessageContainer = document.getElementById('undo-message-container');
    const undoMessageText = document.getElementById('undo-message-text');
    const undoButton = document.getElementById('undo-button');
    const galleryContainer = document.querySelector('.contenedor-imagenes'); // Selecciona el contenedor de la galería

    let lastDeletedElement = null; // Para almacenar el último elemento eliminado
    let lastDeletedParent = null; // Para almacenar el padre del elemento eliminado (contenedor)
    let lastDeletedNextSibling = null; // Para saber dónde reinsertar
    let undoTimer = null; // Para el temporizador de deshacer

    // --- Lógica del botón de Modo Edición ---
    if (editModeToggleBtn) {
        editModeToggleBtn.addEventListener('click', function() {
            body.classList.toggle('editing-mode-active');

            if (body.classList.contains('editing-mode-active')) {
                editModeToggleBtn.textContent = 'Salir Edición';
            } else {
                editModeToggleBtn.textContent = 'Modo Edición';
                // Ocultar mensaje de deshacer si salimos del modo edición
                hideUndoMessage(); 
            }
        });
    }

    // --- Lógica de los botones de Eliminar (Delegación de eventos) ---
    // Usamos delegación de eventos en el contenedor de la galería
    // para no tener que añadir un listener a cada botón de borrar/editar individualmente.
    if (galleryContainer) {
        galleryContainer.addEventListener('click', function(event) {
            // Si el botón "Borrar" fue clickeado
            if (event.target.classList.contains('delete-btn')) {
                const imageContainer = event.target.closest('.imagen'); // Encuentra el div.imagen padre
                if (imageContainer) {
                    deleteImage(imageContainer);
                }
            }
            // Si el botón "Editar" fue clickeado (por ahora solo un placeholder)
            else if (event.target.classList.contains('edit-btn')) {
                const imageContainer = event.target.closest('.imagen');
                if (imageContainer) {
                    const title = imageContainer.querySelector('.overlay h2').textContent;
                    alert(`Has clickeado en Editar para: ${title}. La funcionalidad de edición no está implementada aún.`);
                }
            }
        });
    }

    // --- Funciones para la eliminación y el "deshacer" ---

    function deleteImage(elementToDelete) {
        // Almacena el elemento, su padre y el siguiente hermano para poder deshacer
        lastDeletedElement = elementToDelete;
        lastDeletedParent = elementToDelete.parentNode;
        lastDeletedNextSibling = elementToDelete.nextElementSibling; // Guarda el siguiente hermano

        // Elimina el elemento del DOM
        elementToDelete.remove();

        // Muestra el mensaje de deshacer
        showUndoMessage(`"${lastDeletedElement.querySelector('.overlay h2').textContent}" eliminado.`);

        // Inicia el temporizador para la eliminación final
        startUndoTimer();
    }

    function showUndoMessage(message) {
        undoMessageText.textContent = message;
        undoMessageContainer.classList.add('show');

        // Limpia cualquier temporizador existente
        if (undoTimer) {
            clearTimeout(undoTimer);
        }
    }

    function hideUndoMessage() {
        undoMessageContainer.classList.remove('show');
        clearTimeout(undoTimer); // Asegúrate de limpiar el temporizador si se oculta manualmente
        lastDeletedElement = null; // Limpia la referencia al elemento eliminado
    }

    function startUndoTimer() {
        undoTimer = setTimeout(() => {
            // Esta función se ejecutará después de 10 segundos
            hideUndoMessage(); // Oculta el mensaje
            // En este punto, la eliminación se considera "final" (para esta sesión)
            console.log("Elemento eliminado permanentemente (visual en esta sesión).");
        }, 10000); // 10,000 milisegundos = 10 segundos
    }

    // --- Lógica del botón "Deshacer" ---
    if (undoButton) {
        undoButton.addEventListener('click', function() {
            if (lastDeletedElement && lastDeletedParent) {
                // Reinserta el elemento en su posición original si es posible
                if (lastDeletedNextSibling) {
                    lastDeletedParent.insertBefore(lastDeletedElement, lastDeletedNextSibling);
                } else {
                    // Si no había siguiente hermano, simplemente añádelo al final del padre
                    lastDeletedParent.appendChild(lastDeletedElement);
                }
                
                hideUndoMessage(); // Oculta el mensaje de deshacer
                console.log("Eliminación deshecha.");
            }
        });
    }
});