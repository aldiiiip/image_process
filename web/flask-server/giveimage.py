from flask import send_from_directory, jsonify, request
import os
from PIL import Image
import numpy as np
import io
import json
import atexit


def list_images():
    image_folder = os.path.join(os.getcwd(), "test-receive-image")
    folders = os.listdir(image_folder)
    all_images = []
    
    for folder in folders:
        folder_path = os.path.join(image_folder, folder)
        if os.path.isdir(folder_path):
            print(folder_path)
            images = os.listdir(folder_path)
            for image in images:
                all_images.append(f"{folder}/{image}")

    return jsonify(all_images)


def serve_image(folder_filename):
    image_folder = os.path.join(os.getcwd(), "test-receive-image")
    return send_from_directory(image_folder, folder_filename)


def return_result():

    # print(request.files)
    image_url = request.form['image_url']
    turbidity = request.form['turbidity_value']
    suspended = request.form['suspended_solids_value']

    with open(os.getcwd()+'\\return.txt', 'w') as file:
        file.write(f"image_url: {image_url}\n")
        file.write(f"turbidity: {turbidity}\n")
        file.write(f"suspended: {suspended}\n")

    return "Sent"

def remove_file():
    if os.path.exists(os.getcwd()+'\\return.txt'):
        os.remove(os.getcwd()+'\\return.txt')

# Register the remove_file function to be called on exit
atexit.register(remove_file)