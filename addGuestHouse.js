const guestHouseForm = document.querySelector('#guestHouseForm');

guestHouseForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const formData = new FormData();

  formData.append('name', document.querySelector('#name').value);
  formData.append('location', document.querySelector('#location').value);
  formData.append('price', document.querySelector('#price').value);

  formData.append(
    'image',
    document.querySelector('#image').files[0]
  );

  formData.append(
    'parking',
    document.querySelector('#parking').checked
  );

  formData.append(
    'wifi',
    document.querySelector('#wifi').checked
  );

  formData.append(
    'kitchen',
    document.querySelector('#kitchen').checked
  );

  formData.append(
    'aircon',
    document.querySelector('#aircon').checked
  );

  formData.append(
    'tv',
    document.querySelector('#tv').checked
  );

  formData.append(
    'pets',
    document.querySelector('#pets').checked
  );

  formData.append(
    'bathrooms',
    document.querySelector('#bathrooms').value
  );

  formData.append(
    'pool',
    document.querySelector('#pool').checked
  );

  formData.append(
    'close_to_mall',
    document.querySelector('#mall').checked
  );

  formData.append(
    'close_to_cbd',
    document.querySelector('#cbd').checked
  );


  const response = await fetch('/api/guest-houses', {

    method: 'POST',

    body: formData

  });


  const result = await response.json();


  if (response.ok) {

    alert('Guest house added successfully');

    window.location.href = 'hostessFrontend.html';

  } else {

    alert(result.message);

  }

});