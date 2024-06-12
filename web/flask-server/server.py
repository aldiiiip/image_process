import os
from flask import Flask, jsonify, send_from_directory, request, send_file
from takeimage import get_image
from processing import process_image
from flask_cors import CORS
from giveimage import list_images, serve_image, return_result
import requests 
import matplotlib.pyplot as plt
import matplotlib.image as mpimg


app = Flask(__name__)

CORS(app)

@app.route("/takeimage",methods=['POST']) #take image from frontend and preprocess
def takeimage_route():
    return get_image()


@app.route("/imageprocess",methods=['POST','GET']) #image processing
def imageprocess_route():
    return process_image()


@app.route("/images", methods=['GET']) #display images
def list_images_route():
    return list_images()


@app.route("/images/<path:filename>")
def serve_image_route(filename):
    return serve_image(filename)

@app.route("/processedimage",methods=['POST'])
def return_image_route():
    return return_result()
    

@app.route('/get_file_data', methods=['GET'])
def get_file_data():
    file_path = os.getcwd()+"\\return.txt" # Replace with your actual file path

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    data = {}
    with open(file_path, 'r') as file:
        for idx,line in enumerate(file):
            key, value = line.strip().split(': ', 1)
            if idx > 0:
                data[key] = value

    # requests.post('http://127.0.0.1:5000/imageretrieve')

    return jsonify(data), 200


def get_latest_image():
    base_folder = os.path.join(os.getcwd(), "test-receive-image")
    subfolders = [os.path.join(base_folder, d) for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d))]
    latest_folder = max(subfolders, key=os.path.getmtime)
    print(latest_folder)

    for filename in os.listdir(latest_folder):
        if filename.startswith("all"):
            print(os.path.join(latest_folder, filename))
            return os.path.join(latest_folder, filename)
    return None

@app.route('/imageretrieve', methods=['GET','POST'])
def serve_main_image():
    print("serve image")
    image_path = get_latest_image()
    if image_path:
        folder, filename = os.path.split(image_path)
        return send_from_directory(folder, filename)
    return jsonify({"error": "Image not found"}), 404



if __name__ == "__main__":
    app.run(debug=True, port=5000)

