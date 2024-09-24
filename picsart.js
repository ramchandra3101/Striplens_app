import fetch from 'node-fetch';

const postData = new URLSearchParams({
  format: 'PNG',
  output_type: 'cutout',
  image_url:
    '',
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
    'X-Picsart-API-Key':"eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtNjg1MjZmMWItZGEyMi00ODMxLTk5YTQtYjJkY2Y1OWZjZDg1IiwiYXVkIjoiNDM0MDM3MzkzMDAxMTAxIiwibmJmIjoxNzI3MTk5NTE2LCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDM0MDM3MzkzMDAxMTAxIiwiaWF0IjoxNzI3MTk5NTE2LCJqdGkiOiJlMzg5ODY3NS1kNDk4LTRkNmMtYjg3OS1jMzFkNDdkZmQ4OGIifQ.dxIs5svUt7BSacLi91XasAtZcP4ccYXjPmHFr4Q4dVWDhu30tbE0qLIMtrM_zLgjtBMwtGzaL011bBDeoOgP5ndMK5GML24bf2mbUTgiE4gx12algslsNPapMI3BLPDK92E7V4z_N5lcuB0tAonqRc6Dd9RxezGOphrKdNV7kiMSm4-dESRdvcHrbj_irU2jg1Ule-til7xJlsbwg79JK9AQrj-7zlNfcaKoCbBkdCkoGNA9prVamtkWkhUs8WJBXYF7t9YROHfWI7aDFQmEeBq-mHxOVBUh8AsU141CCRTNIgDnpaYhXv4YQAZeFE6xIfv01u5hi7etTZblRnKMjQ"
,
  },
  body: postData,
};

const removeBg = async () => {
  try {
    const response = await fetch(
      'https://api.picsart.io/tools/1.0/removebg',
      options
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

removeBg();