from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import aiofiles
import uvicorn
import base64
import httpx
import os
import tempfile
from typing import Optional

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

# Ensure image folder exists
os.makedirs(IMAGE_FOLDER_PATH, exist_ok=True)


# -----------------------------
# Request models
# -----------------------------
class GenerateRequest(BaseModel):
    gridSizeX: int
    gridSizeY: int
    symmetryType: str


# -----------------------------
# Helper function to convert base64 to data URI
# -----------------------------
def base64_to_data_uri(base64_string: str, mime_type: str = "image/png") -> str:
    """Convert base64 string to data URI"""
    return f"data:{mime_type};base64,{base64_string}"


# -----------------------------
# Kolam gallery endpoint (GET)
# -----------------------------
@app.get("/gallery")
async def get_kolam_gallery():
    """
    Return generated kolams grouped by type, for the mobile gallery.
    Groups by filename prefix: 1d-*, diamond-*, lotus-*, star-*.
    Response:
    {
      "1d": [dataUriPng, ...],
      "diamond": [...],
      "lotus": [...],
      "star": [...]
    }
    """
    try:
        gallery: dict[str, list[str]] = {
            "1d": [],
            "diamond": [],
            "lotus": [],
            "star": [],
        }

        if not os.path.exists(IMAGE_FOLDER_PATH):
            return JSONResponse(content=gallery)

        for file_name in os.listdir(IMAGE_FOLDER_PATH):
            if not file_name.lower().endswith(".png"):
                continue

            type_key = file_name.split("-")[0].lower()
            file_path = os.path.join(IMAGE_FOLDER_PATH, file_name)

            try:
                with open(file_path, "rb") as f:
                    encoded = base64.b64encode(f.read()).decode()
                    uri = base64_to_data_uri(encoded, "image/png")
                    gallery.setdefault(type_key, []).append(uri)
            except Exception as e:
                print(f"Failed to read gallery file {file_path}: {e}")
                continue

        return JSONResponse(content=gallery)
    except Exception as e:
        print(f"Gallery error: {e}")
        return JSONResponse(
            content={"error": "Failed to load kolam gallery"},
            status_code=500,
        )


# -----------------------------
# Analyze Kolam endpoint (POST)
# -----------------------------
@app.post("/analyze")
async def analyze_kolam(kolamImage: UploadFile = File(...)):
    """
    Analyze a kolam image and return detected patterns and metadata.
    Frontend expects: originalImageUri, detectedPatternUri, gridSize, symmetry, lines, complexity
    """
    temp_path = None
    try:
        # Read the uploaded image content
        content = await kolamImage.read()
        
        if not content or len(content) == 0:
            return JSONResponse(
                content={"error": "Empty file uploaded"},
                status_code=400
            )
        
        # Validate it's actually an image (basic check)
        if len(content) < 100:  # Too small to be a real image
            return JSONResponse(
                content={"error": "File too small to be a valid image"},
                status_code=400
            )
        
        # Convert original image to base64 data URI
        original_image_base64 = base64.b64encode(content).decode()
        content_type = kolamImage.content_type or "image/jpeg"
        original_image_uri = base64_to_data_uri(original_image_base64, content_type)
        
        # Save uploaded image temporarily for ML pipeline
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        temp_path = temp_file.name
        temp_file.write(content)
        temp_file.close()
        
        # Call ML pipeline for prediction
        ml_result = {"predictions": []}
        try:
            with open(temp_path, "rb") as f:
                files = {"image": (kolamImage.filename or "kolam.jpg", f, content_type)}
                resp = requests.post(ML_PIPELINE_URL, files=files, timeout=30)
                if resp.status_code == 200:
                    ml_result = resp.json()
                    print(f"ML Pipeline success: {len(ml_result.get('predictions', []))} predictions")
                else:
                    print(f"ML Pipeline returned status {resp.status_code}: {resp.text}")
        except requests.exceptions.ConnectionError:
            print("ML Pipeline connection error - service may be down")
        except requests.exceptions.Timeout:
            print("ML Pipeline timeout - service took too long to respond")
        except Exception as e:
            # If ML pipeline fails, log but continue with empty predictions
            print(f"ML Pipeline error: {e}")
            import traceback
            traceback.print_exc()
        
        # Extract predictions from ML model
        predictions = ml_result.get("predictions", [])

        # Default metadata
        grid_size = "Unknown"
        symmetry = "Unknown"
        lines = len(predictions) if predictions else 0
        complexity = "Low" if lines < 5 else "Medium" if lines < 10 else "High"

        if predictions:
            # Use ML label (e.g. "Kolam", "Rangoli") as the symmetry/type field
            # If multiple detections, join unique labels in a readable way
            labels = list({p.get("label", "").strip() for p in predictions if p.get("label")})
            if labels:
                symmetry = ", ".join(labels)

            # Simple heuristic for grid size based on number of detections
            if lines > 20:
                grid_size = "Large"
            elif lines > 10:
                grid_size = "Medium"
            elif lines > 0:
                grid_size = "Small"
        
        # For detected pattern, use the original image for now
        # In a real implementation, you'd process the image and return the detected pattern
        # The ML pipeline saves annotated images, but we don't have access to them here
        detected_pattern_uri = original_image_uri
        
        return JSONResponse(content={
            "originalImageUri": original_image_uri,
            "detectedPatternUri": detected_pattern_uri,
            "gridSize": grid_size,
            "symmetry": symmetry,
            "lines": str(lines),
            "complexity": complexity,
        })
        
    except Exception as e:
        print(f"Analyze error: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            content={"error": f"Failed to analyze image: {str(e)}"},
            status_code=500
        )
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception as cleanup_error:
                print(f"Failed to cleanup temp file: {cleanup_error}")


# -----------------------------
# Generate Kolam endpoint (POST) - Frontend compatible
# -----------------------------
@app.post("/generate")
async def generate_kolam(request: GenerateRequest):
    """
    Generate a kolam based on grid size and symmetry type.
    Frontend expects: generatedKolamUri, gridSize, symmetry, lines, complexity
    """
    try:
        # Validate input
        if request.gridSizeX < 5 or request.gridSizeX > 25:
            return JSONResponse(
                content={"error": "gridSizeX must be between 5 and 25"},
                status_code=400
            )
        if request.gridSizeY < 5 or request.gridSizeY > 25:
            return JSONResponse(
                content={"error": "gridSizeY must be between 5 and 25"},
                status_code=400
            )
        
        # Kolam type from frontend is already the generator type: 1d / diamond / lotus / star
        # Normalise to lowercase and fall back to 1d
        generation_type = (request.symmetryType or "1d").lower()
        
        # Use average of gridSizeX and gridSizeY, or max
        grid_size = max(request.gridSizeX, request.gridSizeY)
        # Clamp grid size to reasonable values
        grid_size = max(5, min(grid_size, 25))
        
        print(f"Generating kolam: type={generation_type}, size={grid_size}")
        
        # Call Generation service
        url = f"{GENERATION_URL}?type={generation_type}&size={grid_size}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                res = await client.get(url)
                res.raise_for_status()
                res_data = res.json()
            except httpx.HTTPStatusError as e:
                error_text = e.response.text if hasattr(e.response, 'text') else str(e)
                raise Exception(f"Generation service HTTP error {e.response.status_code}: {error_text}")
            
            if not res_data.get("success"):
                error_msg = res_data.get('error', 'Unknown error')
                details = res_data.get('details', '')
                raise Exception(f"Generation service failed: {error_msg}. {details}")
            
            file_path = res_data.get("filePath")
            if not file_path:
                raise Exception("Generation service did not return file path")
            
            print(f"Generation service returned file path: {file_path}")
            
            # Read the generated SVG file
            # Try multiple possible paths
            file_content = None
            possible_paths = [
                file_path,  # Original path from service
                os.path.join(IMAGE_FOLDER_PATH, os.path.basename(file_path)),  # In /photos folder
                file_path.replace("/src/kolams/", "/photos/"),  # Alternative path
                os.path.join("/app/src/kolams", os.path.basename(file_path)),  # Next.js app path
            ]
            
            for path_to_try in possible_paths:
                try:
                    if os.path.exists(path_to_try):
                        async with aiofiles.open(path_to_try, "rb") as f:
                            file_content = await f.read()
                            print(f"Successfully read file from: {path_to_try}")
                            break
                    else:
                        print(f"Path does not exist: {path_to_try}")
                except Exception as e:
                    print(f"Tried path {path_to_try}, error: {e}")
                    continue
            
            if file_content is None:
                # List files in /photos directory for debugging
                try:
                    if os.path.exists(IMAGE_FOLDER_PATH):
                        files_in_photos = os.listdir(IMAGE_FOLDER_PATH)
                        print(f"Files in /photos: {files_in_photos}")
                except:
                    pass
                raise Exception(f"Could not read generated file from any of these paths: {possible_paths}. File path from service: {file_path}")
            
            if len(file_content) == 0:
                raise Exception("Generated file is empty")
            
            # Convert to base64 data URI (PNG generated by Generation service)
            encoded = base64.b64encode(file_content).decode()
            generated_kolam_uri = base64_to_data_uri(encoded, "image/png")
            
            # Calculate metadata
            dimensions = res_data.get("dimensions", {})
            if dimensions:
                lines = dimensions.get("width", grid_size)
            else:
                # Estimate lines from grid size
                lines = grid_size * 2  # Rough estimate
            
            complexity = "Low" if grid_size < 7 else "Medium" if grid_size < 15 else "High"
            
            return JSONResponse(content={
                "generatedKolamUri": generated_kolam_uri,
                "gridSize": f"{request.gridSizeX}x{request.gridSizeY}",
                "symmetry": request.symmetryType,
                "lines": str(lines),
                "complexity": complexity,
            })
            
    except httpx.TimeoutException:
        print("Generate error: Timeout calling Generation service")
        return JSONResponse(
            content={"error": "Generation service timeout. Please try again."},
            status_code=504
        )
    except httpx.RequestError as e:
        print(f"Generate error: Request error - {e}")
        return JSONResponse(
            content={"error": f"Could not connect to generation service: {str(e)}. Make sure the Generation service is running."},
            status_code=503
        )
    except Exception as e:
        print(f"Generate error: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )


# -----------------------------
# Legacy GET endpoint for generate (keep for backward compatibility)
# -----------------------------
@app.get("/generate")
async def generate_images(type: str = "1D", size: int = 7, count: int = 10):
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
# Health check endpoint
# -----------------------------
@app.get("/health")
async def health_check():
    """Health check endpoint to verify service is running"""
    return JSONResponse(content={
        "status": "healthy",
        "service": "KolamExplorer Backend",
        "ml_pipeline_url": ML_PIPELINE_URL,
        "generation_url": GENERATION_URL,
    })


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
