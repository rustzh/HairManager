import sys
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array

# 클래스 이름
face_types = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']

# 모델 로드
model = tf.keras.models.load_model('first_model.keras')

def process():
    file = sys.argv[1:]
    try:
        # 바이너리 데이터로 온 경우
        file_bytes = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        # 그냥 이미지로 들어온 경우
        #image = file 

        # 이미지 전처리
        image = image.resize((224, 224))
        image_array = img_to_array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가

        # 예측
        predictions = model.predict(image_array)[0]  # 첫 번째 배치의 결과
        predictions = predictions * 100 # 확률을 %로 변환

        result = {face_type: f"{percentage:.2f}%" for face_type, percentage in zip(face_types, predictions)}

        ansi_escape = re.compile(r'\x1B[@-_][0-?]*[ -/]*[@-~]')
        return ansi_escape.sub('', result), 200
        # return result, 200
    except Exception as e:
        return {"error": f"Server encountered an error: {str(e)}"}, 500


if __name__ == "__main__":
    process()