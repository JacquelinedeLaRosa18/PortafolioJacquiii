// ../js/dibujos_edit.js

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