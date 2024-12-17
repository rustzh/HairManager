import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import sys
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import re

tf.get_logger().setLevel('ERROR')

# 클래스 이름
face_types = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']

# 모델 로드
model_path = os.path.join(os.path.dirname(__file__), 'first_model.keras')
model = tf.keras.models.load_model(model_path)

def process(image_path):
    try:
        # # 그냥 이미지로 들어온 경우
        image = cv2.imread(image_path)

        # 이미지 전처리
        image = cv2.resize(image, (224, 224))
        image_array = img_to_array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가

        # 예측
        predictions = model.predict(image_array, verbose=0)[0]  # 첫 번째 배치의 결과

        # 딕셔너리 생성: 각 face_type과 그에 해당하는 확률을 매칭
        result = {face_type: f"{percentage * 100:.2f}%" for face_type, percentage in zip(face_types, predictions)}

        # JSON으로 변환
        json_result = json.dumps(result)
        return json_result
    except Exception as e:
        return {"error": f"Server encountered an error: {str(e)}"}


if __name__ == "__main__":
    image_path = sys.argv[1]
    result = process(image_path)
    print(result)