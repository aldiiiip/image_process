import React, { useEffect, useState } from 'react';

const ImageGalleryPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/images')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  // Function to group images by folder
  const groupImagesByFolder = (images) => {
    const groupedImages = {};
    images.forEach(imagePath => {
      const [folder, filename] = imagePath.split('/');
      if (filename.startsWith('value')) {
        return; // Skip files that start with 'value'
      }
      if (!groupedImages[folder]) {
        groupedImages[folder] = [];
      }
      groupedImages[folder].push({ folder, filename, imagePath });
    });
    return groupedImages;
  };

   // Function to map filename prefix to descriptive text
   const getDescriptiveText = (filename) => {
    if (filename.startsWith('all')) {
      return 'All Techniques';
    } else if (filename.startsWith('clahe')) {
      return 'CLAHE Equalization';
    } else if (filename.startsWith('cropped')) {
      return 'Cropped';
    } else if (filename.startsWith('bilateral')) {
      return 'Bilateral Filtering';
    }
    return filename; // Default to filename if no prefix matches
  };

  const groupedImages = groupImagesByFolder(images);

  return (
    <div>
      <h1 style={{textAlign:"center", margin:"40px"}}>Image Gallery</h1>
      <div className="image-gallery">
        {Object.entries(groupedImages).map(([folder, images]) => (
          <div key={folder} className="image-folder">
            <h2 style={{color:"#f2f2f2", marginBottom:"10px"}}>Input {folder}</h2>
            <div className="image-row" style={{display:"flex", backgroundColor:"#62a192", textAlign:"center", borderRadius: "10px"}}>
              {images.map(({ imagePath, filename }, index) => (
                <div>

                  <div key={index}>
                    <img src={`http://127.0.0.1:5000/images/${imagePath}` } className='image-gallery-images' style={{height: '300px', width: '300px' }}alt={filename} />
                  </div>
                  <p style={{fontWeight:"bold"}}>{getDescriptiveText(filename)}</p> 
                  <br />
                </div>                
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryPage;
