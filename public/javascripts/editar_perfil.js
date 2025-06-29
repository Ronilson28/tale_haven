document.getElementById('fotoPerfil').addEventListener('change', function(event) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const imgPreview = document.querySelector('.foto-contain img');
        imgPreview.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
});