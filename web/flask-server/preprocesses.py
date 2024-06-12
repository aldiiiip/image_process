import numpy as np
import cv2

def resize_and_crop_image(image, desired_width, desired_height):
    
    # Calculate resize ratio to maintain aspect ratio
    original_height, original_width = image.shape[:2]
    resize_ratio = min(desired_width / original_width, desired_height / original_height)
    
    # Resize image while maintaining aspect ratio
    resized_width = int(original_width * resize_ratio)
    resized_height = int(original_height * resize_ratio)
    resized_image = cv2.resize(image, (resized_width, resized_height))
    
    # Crop Area
    crop_width = 200
    crop_height = 200
    
    # Calculate cropping region to ensure center remains at center
    crop_x = max(0, (resized_width - crop_width) // 2)
    crop_x_end = min(resized_width, (resized_width + crop_width) // 2)
    crop_y = max(0, (resized_height - crop_height) // 2)
    crop_y_end = min(resized_height, (resized_height + crop_height) // 2)
    
    # Crop image to desired dimensions
    cropped_image = resized_image[crop_y:crop_y_end, crop_x:crop_x_end]
    
    return cropped_image


def normalize_image(image):
    # Convert image to float32
    normalized_image = image.astype('float32')
    # Scale pixel values to range [0, 1]
    normalized_image /= 255.0
    # Scale pixel values to range [0, 255]
    normalized_image *= 255
    return normalized_image.astype('uint8')


def convert_to_grayscale(image):
    grayscale_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    return grayscale_image


def bilateral_filter(image):
    result_image = cv2.bilateralFilter(image, d=3, sigmaColor=45, sigmaSpace=45)
    return result_image


def histogram_equalization(image):
    equalized_image = cv2.equalizeHist(image)
    return equalized_image


def clahe_equalization(image):
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    clahe_image = clahe.apply(image)
    return clahe_image

