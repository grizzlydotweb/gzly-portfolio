jQuery(document).ready(function($) {
    $('#gzly-term-image-upload-button').on('click', function(e) {
        e.preventDefault();

        // Öffne das WordPress-Medienfenster
        var frame = wp.media({
            title: 'Bild auswählen',
            button: { text: 'Bild auswählen' },
            multiple: false
        });

        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            $('#term-image').val(attachment.id);
            console.log(attachment)
            let previewContainer =  $('#gzly-preview-image');
            previewContainer.html('')
            previewContainer.append(`<img src="${attachment.sizes.thumbnail.url}"/>`)
        });

        frame.open();
    });
});
