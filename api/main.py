

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PEPPER = tf.keras.models.load_model("../models/pepper_1")
MODEL_POTATO = tf.keras.models.load_model("../models/pepper_1")

CLASS_NAMES_PEPPER = ["Bacterial Spot", "Healthy"]
CLASS_NAMES_POTATO = ["Early Blight", "Late Blight", "Healthy"]


def read_file_as_image(data):
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict_pepper")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL_PEPPER.predict(img_batch)

    predicted_class = CLASS_NAMES_PEPPER[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

@app.post("/predict_potato")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL_POTATO.predict(img_batch)

    predicted_class = CLASS_NAMES_POTATO[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

