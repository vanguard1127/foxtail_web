import Resizer from "react-image-file-resizer";

export default function(file) {
  console.log("File before resize: ", file); // todo remove after test
  return new Promise(resolve => {
    Resizer.imageFileResizer(
      file, // is the file of the current image
      1920, // is the maxWidth of the new image
      1080, // is the maxHeight of the new image
      "JPEG", // is the compressFormat of the new image
      70, // is the quality of the new image 0-100
      0, // is the rotation of the new image
      uri => {
        fetch(uri)
          .then(data => data.blob())
          .then(datablob => {
            const newFile = new File([datablob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now()
            });
            resolve(newFile);
          });
      }, // is the callBack function of the new image URI
      "base64" // is the output type of the new image
    );
  });
}
