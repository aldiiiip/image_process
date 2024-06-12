import io
import os
import requests
from preprocesses import resize_and_crop_image, normalize_image, convert_to_grayscale, bilateral_filter, histogram_equalization, clahe_equalization
from flask import request
import random
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import cv2



def get_image():
    image_file = request.files['image']
    
    save_directory = os.getcwd()+"\\test-receive-image\\"
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    folder_path = save_directory

    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        folders = [name for name in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, name))]
        num_folders = len(folders)+1

    input_identifier = str(num_folders)

    #make the folder for every input
    

    new_directory_path = os.path.join(save_directory, input_identifier)
    os.makedirs(new_directory_path, exist_ok=True)
    
    ## Read the image using PIL
    image = Image.open(io.BytesIO(image_file.read()))
    image = np.array(image) 


    image = resize_and_crop_image(image,2048,2048)
    filename = "cropped " + input_identifier + ".jpg"  # Add file extension
    # Construct the full path for saving the image
    image_save_path = os.path.join(new_directory_path, filename)
    # Save the preprocessed image
    plt.imsave(image_save_path, image)

    image_send = normalize_image(image)
    image_send = convert_to_grayscale(image_send)    

    image_send = bilateral_filter(image_send)
    filename = "bilateral " + input_identifier + ".jpg"  # Add file extension
    # Construct the full path for saving the image
    image_save_path = os.path.join(new_directory_path, filename)
    preprocess_image_step = bilateral_filter(image)
    # Save the preprocessed image
    plt.imsave(image_save_path, preprocess_image_step)

    image_send = histogram_equalization(image_send)

    image_send = clahe_equalization(image_send)
    filename = "clahe " + input_identifier + ".jpg"  # Add file extension
    # Construct the full path for saving the image
    image_save_path = os.path.join(new_directory_path, filename)
    preprocess_image_step = clahe_equalization(convert_to_grayscale(image))
    preprocess_image_step = cv2.cvtColor(preprocess_image_step, cv2.COLOR_GRAY2RGB)
    # Save the preprocessed image
    plt.imsave(image_save_path, preprocess_image_step)

    #save preprocess
    image_send_save = cv2.cvtColor(image_send, cv2.COLOR_GRAY2RGB)
    all_image_save = os.path.join(new_directory_path, "all "+input_identifier+".jpg")
    plt.imsave(os.path.join(all_image_save), image_send_save)

    # Convert the NumPy array to an image
    pil_image = Image.fromarray(image_send)

    # Convert the PIL image to bytes
    img_bytes = io.BytesIO()
    pil_image.save(img_bytes, format='JPEG')  # Change the format as needed
    img_bytes.seek(0)

    # Prepare the payload for the POST request
    payload = {'image': img_bytes}
    path = {'path':new_directory_path, 'path_to_image':all_image_save}
    
    # Send the image data to another API
    try:
        response = requests.post('http://127.0.0.1:5000/imageprocess', files=payload, data=path)
        # Check the response status
        if response.status_code == 200:
            return 'Image sent successfully to the other API'
        else:
            return 'Failed to send image to the other API'
    except Exception as e:
        return f'Error sending image to the other API: {e}'