from flask import request, jsonify, send_file
from PIL import Image
import io
import numpy as np
import requests
import os
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array # type: ignore
import cv2

def process_image():
    
    print("processing")
    #turbidity model
    turbidity_model = load_model(os.getcwd()+'\\turbidity_best_model.keras')
    suspended_model = load_model(os.getcwd()+'\\suspended_solids_best_model.keras')
    
    # Get the image data from the request
    image_file = request.files['image']
    path = request.form['path']
    image_path = request.form['path_to_image']


    ## Read the image
    image = load_img(io.BytesIO(image_file.read()))

    image_data = []
  

    img_array = img_to_array(image)
    image_data.append(img_array)
    image_data = np.array(image_data)

    #turbidity
    real_data_generator = ImageDataGenerator()
    real_generator = real_data_generator.flow(
        image_data,
        batch_size=1
    )
    
    #turbidity predict
    prediction = turbidity_model.predict(real_generator)
    turbidity_value = prediction[0][0]
    if turbidity_value < 0:
        turbidity_value = 0


     #suspended solids
    prediction = suspended_model.predict(real_generator)
    suspended_solids_value = prediction[0][0]
    if suspended_solids_value < 0:
        suspended_solids_value = 0

    values = {"image_url":image_path,"turbidity_value":turbidity_value, "suspended_solids_value":suspended_solids_value}

    # Open a text file in write mode
    with open(path+'\\values.txt', 'w') as file:
        # Write each value to a new line
        for value in values.values():
            file.write(str(value) + '\n')
            print(value)
    
    try:
        response = requests.post('http://127.0.0.1:5000/processedimage', data=values)
        # Check the response status
        if response.status_code == 200:
            return 'Image sent successfully to the other API'
        else:
            return 'Failed to send image to the other API'
    except Exception as e:
        return f'Error sending image to the other API: {e}'
    
