import cv2
import numpy as np
from PIL import Image
import os
path = 'api/dataset'
recognizer = cv2.face.LBPHFaceRecognizer_create()
detector = cv2.CascadeClassifier("api/haarcascade_frontalface_default.xml")
# function to get the images and label data
def getImagesAndLabels(path):
    imagePaths = [os.path.join(path,f) for f in os.listdir(path)]     
    face_Samples=[]
    ids = []
    for imagePath in imagePaths:
        PIL_img = Image.open(imagePath).convert('L') # grayscale
        img_numpy = np.array(PIL_img,np.uint8)
        id = int(os.path.split(imagePath)[1].split(".")[1])
        print(id)
        face_Samples.append(img_numpy)
        ids.append(id)
        cv2.imshow("Training", img_numpy)
        cv2.waitKey(10)

    return np.array(ids),face_Samples

def Train_model():
    ids, face_samples=getImagesAndLabels(path)
    recognizer.train(face_samples, ids)
    recognizer.save("api/recognizer/trainingdata.yml")
    cv2.destroyAllWindows()
    return ids[1]

Train_model()