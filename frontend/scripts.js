function uploadImage() {
    const form = document.getElementById('uploadForm');
    const statusElement = document.getElementById('status');

    const formData = new FormData(form);
    console.log(formData);
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            statusElement.innerText = data;
        })
        .catch(error => {
            console.error('Error al subir la imagen:', error);
            statusElement.innerText = 'Error al subir la imagen. Por favor, inténtalo de nuevo.';
        });
}
