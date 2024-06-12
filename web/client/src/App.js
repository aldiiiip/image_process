import Navbar from './navbar';
import React, {useState, useEffect} from 'react'
import ImageUpload from './imageUpload';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ImageGalleryPage from './ImageGallery';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import ImageReturnComponent from './ReturnImage';
import ProcessedImageDisplay from './ReturnImage';

function App() {

  return (
    <Router>
    <div className="App">
      <Navbar></Navbar>
        <Routes>

          <Route path="/" element={
            <React.Fragment>
            <div className="content"> 
              <div className="section">
                <ImageUpload></ImageUpload>
                <ToastContainer position="top-center" autoClose={15000}/> {/* Initialize ToastContainer */}
                <div className='texts'>
                
                <p style={{color:'#34766c', fontSize:20, fontWeight:"bold", textShadow:'1px 1px 1px #848484'}}><i className="material-icons" style={{ fontSize: '28px',verticalAlign: 'middle'  }}>notifications_active</i> Major Pre-processing techniques  </p>
                <p  style={{marginTop:'20px', paddingRight:'70px'}}><span style={{fontWeight:'bold'}}>Bilateral Filtering:</span> Smooths images while preserving edges, useful for noise reduction without blurring important details</p>
                <p style={{marginTop:'10px', paddingRight:'70px'}}><span style={{fontWeight:'bold'}}>CLAHE Equalization:</span> Used to enhance the local contrast of an image, particularly in regions where the contrast might be low. Unlike standard histogram equalization, 
                which operates on the entire image, CLAHE works on small regions or tiles of the image.</p>
                </div>
              </div>
              <div className="section">
                
                <ProcessedImageDisplay></ProcessedImageDisplay>
                 
                <p style={{color:'#34766c', fontSize:20, fontWeight:"bold", textShadow:'1px 1px 1px #848484', marginRight:'30px', marginTop:'30px', textAlign:'right'}}><i className="material-icons" style={{ fontSize: '28px',verticalAlign: 'middle' }}>announcement</i> Insights - Solutions</p>
                <p style={{textAlign:'right', marginRight:'30px', marginTop:'10px', paddingLeft:'60px'}}>Regularly test turbidity and suspended solids to ensure wastewater quality and compliance, and use data to identify contamination sources.</p>
                <p style={{textAlign:'right', marginRight:'30px', marginTop:'10px', paddingLeft:'60px'}}>Use sedimentation, filtration, and coagulation to reduce turbidity and solids, and apply advanced treatments for further purification</p>
                <p style={{textAlign:'right', marginRight:'30px', marginTop:'10px', paddingLeft:'60px'}}>Reduce pollutants at the source and use best practices to limit runoff and erosion</p>

              </div>  
            </div>
            </React.Fragment>} /> {'http://localhost:3000/'}

          <Route path="/image-gallery" element={
            <React.Fragment>
                <ImageGalleryPage />
            </React.Fragment>
            
            } /> {'http://localhost:3000/image-gallery'}
        </Routes>

      
    </div>
    </Router>
    
  );
}

export default App;

