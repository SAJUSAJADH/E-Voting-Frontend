import cv2
import numpy as np
import os

facedetector=cv2.CascadeClassifier("api/haarcascade_frontalface_default.xml")
cam=cv2.VideoCapture(0)


def Detect_face():
    recognizer=cv2.face.LBPHFaceRecognizer_create()
    recognizer.read("api/recognizer/trainingdata.yml")
    while(True):
        ret,img=cam.read()
        img = cv2.flip(img, 1)
        gray=cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces=facedetector.detectMultiScale(gray, 1.3, 5)
        for(x,y,w,h) in faces:
            cv2.rectangle(img, (x,y), (x+w, y+h), (0,255,0), 2)
            id, conf=recognizer.predict(gray[y:y+h,x:x+w])
            if(conf>100):
                id='unknown'
            cv2.putText(img, "Name: ", (x,y+h+20), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 127), 2)
            cv2.putText(img, str(id), (x+5,y-45), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,0), 1)
            cv2.putText(img, str(conf), (x+5,y-65), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,0), 1)
        cv2.imshow("Face_Detection",img)
        if(cv2.waitKey(1)==ord('q')):
            break
    cam.release()
    cv2.destroyAllWindows()
    return id

Detect_face()