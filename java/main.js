$(document).ready(function() {

    // --- Funcionalidad para los GIFs al pasar el cursor ---
    $('.gif-on-hover img').each(function() {
        const $img = $(this);
        const staticSrc = $img.data('static-src'); // Obtiene la ruta de la imagen estática
        const gifSrc = $img.data('gif-src');     // Obtiene la ruta del GIF

        // Al pasar el ratón por encima
        $img.on('mouseenter', function() {
            if (gifSrc) { // Solo si hay una ruta de GIF definida
                $img.attr('src', gifSrc); // Cambia la fuente de la imagen a la del GIF
            }
        });

        // Al retirar el ratón
        $img.on('mouseleave', function() {
            if (staticSrc) { // Solo si hay una ruta de imagen estática definida
                $img.attr('src', staticSrc); // Vuelve a la fuente de la imagen estática
            }
        });
    });

    // --- El código anterior para los slides de categorías ya no es necesario aquí,
    // --- si lo tenías, puedes eliminarlo o comentarlo.
    // Ejemplo de cómo se vería el código a eliminar si existía:
    /*
    $('.category-slide').each(function() {
        // ... (todo el código del carrusel/slide que tenías antes) ...
    });
    */

});