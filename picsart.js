import { FormData } from "formdata-node"
import fs from "fs"


const form = new FormData()
const photo = fs.createReadStream('/Users/rcyerramsetti/Downloads/Strip Detection/striplens/strip.png')
form.append('image_file', photo)

fetch('https://clipdrop-api.co/remove-background/v1', {
  method: 'POST',
  headers: {
    'x-api-key': '337cdabf80c3e5329f19777dd0bff4a6cb9fb0e9f85dbf96261295103bdb2a5f3bd9e077655027efd9b05c00facaa7aa',
  },
  body: form,
})
  .then(response => response.arrayBuffer())
  .then(buffer => {
    // buffer here is a binary representation of the returned image
    const nodeBuffer = Buffer.from(buffer);

    // Write the binary data to an image file (e.g., output.png)
    fs.writeFile('output.png', nodeBuffer, (err) => {
      if (err) {
        console.error('Error saving the image:', err);
      } else {
        console.log('Image saved successfully as output.png');
      }
    });
  })