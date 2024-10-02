import sys
import cv2
import numpy as np
from PIL import Image
import os
import matplotlib.pyplot as plt

def detect_arrow_direction(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 0)
    edges = cv2.Canny(blurred_image, threshold1=50, threshold2=150)
    lines = cv2.HoughLines(edges, 1, np.pi / 180, 100)
    angles = []
    if lines is not None:
        for rho, theta in lines[:, 0]:
            angle = np.degrees(theta)
            angles.append(angle)
        avg_angle = np.mean(angles)
        return avg_angle
    else:
        return None

def straighten_and_crop_transparent(image):
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)

    # Straighten the image
    _, _, _, alpha = cv2.split(image)
    mask = cv2.threshold(alpha, 0, 255, cv2.THRESH_BINARY)[1]
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        cnt = max(contours, key=cv2.contourArea)
        rect = cv2.minAreaRect(cnt)
        angle = rect[2]
        if angle < 90:
            angle = 360 + angle
        elif angle > 90:
            angle = -180 + angle

        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))

        # Crop the image
        _, _, _, alpha = cv2.split(rotated)
        coords = cv2.findNonZero(alpha)
        if coords is not None:
            x, y, w, h = cv2.boundingRect(coords)
            cropped = rotated[y:y+h, x:x+w]
            return cropped
        else:
            print("No non-transparent pixels found in the image.")
            return None
    else:
        print("No contours found.")
        return None

def process_image(image_path):
    with Image.open(image_path) as pil_img:
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGBA2BGRA)
        straightened_image = straighten_and_crop_transparent(cv_img)
        if straightened_image is not None:
            avg_angle = detect_arrow_direction(straightened_image)
            if avg_angle is not None and (avg_angle > -90 and avg_angle < 90):
                straightened_image = cv2.flip(straightened_image, 0)

            output_path = os.path.splitext(image_path)[0] + '_processed.png'
            cv2.imwrite(output_path, straightened_image)
            return straightened_image, output_path  # Return the processed image for further use
        else:
            print("Processing failed.")
            return None

def crop_and_display(image):
    img = Image.fromarray(image)
    width, height = img.size
    mid = width // 2
    upper = 0
    left=mid - 150
    right = mid + 500
    lower = height
    lower = img.height

    cropped_img = img.crop((left, upper, right, lower))
    cropped_img.show()
    return cropped_img

def convert_to_bw_and_plot(cropped_img, output_folder):
    img = cropped_img.convert('L')
    threshold = 190
    bw_img = img.point(lambda x: 255 if x > threshold else 0, '1')
    bw_array = np.array(bw_img)
    signal_array = 1 - bw_array / 255
    signal = np.mean(signal_array, axis=0)

    plt.figure(figsize=(5, 1))
    plt.plot(signal, label= 'intensity')
    plt.legend()
    plt.grid(True)

    #saving the plot in the same folder of input image

    plot_output_path = os.path.join(output_folder, 'intensity_plot.png')
    plt.savefig(plot_output_path)
    plt.close()

    return plot_output_path
    

    


#Main Execution
# input_image = "/Users/rcyerramsetti/Documents/WebDev_Local/Striplens_app/Backend/20240929_144041_no_bg.jpg"
# processed_image = process_image(input_image)

# if processed_image is not None:
#     cropped_image = crop_and_display(processed_image)
#     convert_to_bw_and_plot(cropped_image)

if __name__ == '__main__':
    if len(sys.argv) < 2: # Check if the image path is provided
        print("Usage: python output.py <image_path>") # Provide usage message
        sys.exit(1) # Exit the program

    input_image = sys.argv[1] # Get the image path from the command line argument
    straightened_image, processed_output_path = process_image(input_image) # Process the image


    if straightened_image is not None:
        cropped_image = crop_and_display(straightened_image)
        plot_output_path = convert_to_bw_and_plot(cropped_image, os.path.dirname(processed_output_path))

        print(f"{processed_output_path}\n{plot_output_path}")

    