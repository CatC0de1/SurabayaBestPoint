// Draft image cache
let imageDrafts = [];

document.getElementById('image').addEventListener('change', function(e) {
  // Tambahkan file baru ke cache
  for (const file of e.target.files) {
    imageDrafts.push(file);
  }
  
  renderDraftImages();
  // Reset input supaya bisa pilih file yang sama lagi jika perlu
  e.target.value = '';
});

function renderDraftImages() {
  const preview = document.getElementById('image-preview');
  preview.innerHTML = '';
  imageDrafts.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = document.createElement('img');
      img.src = ev.target.result;
      img.className = 'rounded border custom-images-size';
      img.title = file.name;

      // Tombol hapus draft
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-sm btn-outline-danger mt-1 d-flex align-items-center justify-content-center';
      delBtn.innerHTML = 
      `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
      `;
      delBtn.onclick = () => {
        imageDrafts.splice(idx, 1);
        renderDraftImages();
      };

      const wrapper = document.createElement('div');
      wrapper.className = 'd-flex flex-column align-items-center';
      wrapper.appendChild(img);
      wrapper.appendChild(delBtn);

      preview.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });
}

// Saat submit, tambahkan semua file di cache ke FormData
document.querySelector('.validated-form').addEventListener('submit', function(e) {
  if (imageDrafts.length > 0) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    imageDrafts.forEach(file => {
      formData.append('image', file);
    });
    fetch(form.action, {
      method: form.method,
      body: formData,
    }).then(res => {
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        window.location.reload();
      }
    });
  }
});