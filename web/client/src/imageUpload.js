import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify'; // Import toast

const ImageUpload = () => {
  const [imageSrc, setImageSrc] = useState(''); // Initial state for the image source
  const fileInputRef = useRef(null); // Ref for the file input element
  const imageContainerRef = useRef(null); // Ref for the image container

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0]; // Get the dropped file
    handleImage(file); // Process the dropped file
  };

  const handleImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("adaew")
      setImageSrc(reader.result); // Set the image source to the uploaded/dropped image
    };
    if (file) {
      reader.readAsDataURL(file); // Convert file to data URL
    }
  };

  const preventDefaultAction = (event) => {
    event.preventDefault(); // Prevent default action for drag events
  };

  const handleContainerClick = () => {
    fileInputRef.current.click(); // Programmatically trigger the file selection dialog
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    handleImage(file); // Process the uploaded file
  };

  const handleSendImage = () => {
    // Check if an image is present
    if (!imageSrc) {
      console.log("No image to send.");
      return;
    }

    // Convert image data URL to Blob
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        // Create FormData object
        const formData = new FormData();
        formData.append('image', blob);
        toast("This may take around 15 seconds...", {
          style: {
            textAlign:'center',
            fontSize: '20px', // Adjust font size
            padding: '20px', // Adjust padding
            width: '300px', // Adjust width
            height:'100px',
            backgroundColor:'#62a192',
            fontWeight:'bold'
          }
        });
        
        // Send POST request to API endpoint
        fetch('http://127.0.0.1:5000/takeimage', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          // Handle response status code
          if (response.ok) {
            console.log('Image sent successfully.');
            
          } else {
            console.error('Failed to send image. Status code:', response.status);
            toast.error("Failed to upload image.", {
              position: toast.POSITION.TOP_CENTER
            });
          }
        })
        .catch(error => {
          // Handle error
          console.error('Error sending image:', error);
        });
      });
  };



  return (
    <div>

      <div
        className="image-container"
        id='upload-container'
        ref={imageContainerRef}
        onClick={handleContainerClick} // Handle click event on the image container
        onDrop={handleImageDrop} // Handle drop event
        onDragOver={preventDefaultAction} // Prevent default action for dragover event
      >
        {imageSrc && <img src={imageSrc} alt="Uploaded Image" style={{ maxWidth: '400px', maxHeight: '300px'}} />} {/* Render the image if imageSrc is not empty */}
        {!imageSrc && <div>
                        <i id='inline' className="material-icons" style={{ fontSize: '48px' }}>upload</i>
                        <p id='inline' style={{ fontWeight: 'bold', fontSize: 18 }}> Insert Image</p>
                      </div>
        } {/* Render "Insert" text if imageSrc is empty */}
      </div>

      {/* Button to trigger image sending */}
      <div id='inline'>
        <button onClick={handleSendImage} className='upload-button' style={{ pointerEvents: imageSrc ? 'auto' : 'none' }}>Upload Image</button>
      </div>

      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;
