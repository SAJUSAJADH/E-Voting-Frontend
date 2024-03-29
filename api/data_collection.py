import cv2
import numpy as np
import os
face_detector = cv2.CascadeClassifier('api/haarcascade_frontalface_default.xml')
cam = cv2.VideoCapture(0)

cv2.namedWindow('Face', cv2.WINDOW_NORMAL | cv2.WINDOW_KEEPRATIO)
# cv2.resizeWindow('Face', 400, 400)

cv2.setWindowProperty('Face', cv2.WND_PROP_TOPMOST, 1)

def Collect_data():
    face_id = input('enter user id end press <return> ==>  ')
    count = 0
    while(True):
        ret, img = cam.read()
        img = cv2.flip(img, 1) # 1 stright, 0 reverse
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            count=count+1
            cv2.imwrite("api/dataset/voter." + str(face_id) + '.' +  
                        str(count) + ".jpg", gray[y:y+h,x:x+w])
            cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
            cv2.waitKey(100)            
        cv2.imshow('Face', img)
        cv2.waitKey(1)
        if(count>20):
            break

    cam.release()
    cv2.destroyAllWindows()

Collect_data()