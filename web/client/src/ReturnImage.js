import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProcessedImageDisplay = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const fetchDataAndImage = () => {
    setIsLoading(true);

    // Fetch data
    fetch('http://127.0.0.1:5000/get_file_data')
      .then(response => response.json())
      .then(data => {
        if (data.turbidity && data.suspended) {
          setData(data);
        } else {
          toast.error(data.error || "Failed to fetch data.");
        }
        return fetch('http://127.0.0.1:5000/imageretrieve');
      })
      .then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to fetch image.");
        }
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setIsLoading(false);
      })
      .catch(error => {
        toast.error("Error fetching data or image: " + error.message);
        setIsLoading(false);
      });
  };

  return (
    <div style={{textAlign:'center'}}>
      
      {isLoading && <p>Loading...</p>}
      <div className='image-container'>
      {imageUrl && (
        <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src={imageUrl} alt="Processed" style={{ maxWidth: '300px', maxHeight: '300px', marginBottom: '20px' }} />
        </div>
      )}
      </div>
      
      <button className='upload-button' onClick={fetchDataAndImage} style={{ marginBottom: '10px',textAlign: 'center'}}>Fetch Data</button>
      {data && (
        <div style={{marginTop:'40px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '100px'}}>
          <p style={{ fontWeight: 'bold', margin: '0 10px' }}>Turbidity: {data.turbidity}</p>
          <p style={{ fontWeight: 'bold', margin: '0 10px' }}>Suspended Solids: {data.suspended}</p>
        </div>
      )}
    </div>
  );
};

export default ProcessedImageDisplay;
