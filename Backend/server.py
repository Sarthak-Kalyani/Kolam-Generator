from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import aiofiles
import uvicorn
import base64
import httpx

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or put your site origin here, e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Config: Your ML pipeline URL (via ngrok)
# -----------------------------
ML_PIPELINE_URL = "http://ML-Pipeline:5000/predict"
GENERATION_URL = "http://Generation:3000/api/generate-Kolams"
IMAGE_FOLDER_PATH = "/photos"

# -----------------------------
# Dummy image generation endpoint
# -----------------------------
@app.get("/generate")
async def generate_images(type:str = "1D", size:int = 7, count: int = 10) :
    result = {}

    url = f"{GENERATION_URL}?type={type}&size={size}"

    async with httpx.AsyncClient() as client:
        for i in range(count):
            try:
                res = await client.get(url)
                res_data = res.json()
                if not res_data.get("success"):
                    continue

                file_path = res_data["filePath"]
                file_name = file_path.split("/")[-1]

                async with aiofiles.open(file_path, "rb") as f:
                    encoded = base64.b64encode(await f.read()).decode()

                result[file_name] = encoded
            except Exception as e:
                # Optionally log errors
                continue

    return result


# -----------------------------
# Forward file to your ML pipeline
# -----------------------------
@app.post("/ml-predict")
async def ml_predict(file: UploadFile):
    try:
        files = {"image": (file.filename, file.file, file.content_type)}
        resp = requests.post(ML_PIPELINE_URL, files=files, timeout=20)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
