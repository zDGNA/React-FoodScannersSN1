from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io
import os
import logging

app = Flask(__name__)
CORS(app)

# Konfigurasi Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Model
MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n.pt')
model = None

def load_model():
    global model
    try:
        logger.info(f"Loading YOLO model from {MODEL_PATH}...")
        model = YOLO(MODEL_PATH)
        logger.info("Model loaded successfully!")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

# Inisialisasi model saat startup
load_model()

# Database Nutrisi (Food-101 Categories)
FOOD_CATEGORIES = {
    'apple_pie': {'calories': 237, 'protein': 2.4, 'carbs': 34, 'fat': 11},
    'baby_back_ribs': {'calories': 360, 'protein': 27, 'carbs': 0, 'fat': 28},
    'baklava': {'calories': 330, 'protein': 5, 'carbs': 40, 'fat': 18},
    'beef_carpaccio': {'calories': 120, 'protein': 20, 'carbs': 1, 'fat': 4},
    'beef_tartare': {'calories': 220, 'protein': 17, 'carbs': 2, 'fat': 16},
    'beet_salad': {'calories': 89, 'protein': 2.5, 'carbs': 12, 'fat': 4},
    'beignets': {'calories': 280, 'protein': 5, 'carbs': 35, 'fat': 14},
    'bibimbap': {'calories': 490, 'protein': 22, 'carbs': 68, 'fat': 14},
    'bread_pudding': {'calories': 310, 'protein': 8, 'carbs': 48, 'fat': 10},
    'breakfast_burrito': {'calories': 380, 'protein': 18, 'carbs': 38, 'fat': 17},
    'bruschetta': {'calories': 160, 'protein': 5, 'carbs': 22, 'fat': 6},
    'caesar_salad': {'calories': 470, 'protein': 25, 'carbs': 15, 'fat': 35},
    'cannoli': {'calories': 290, 'protein': 7, 'carbs': 30, 'fat': 16},
    'caprese_salad': {'calories': 240, 'protein': 12, 'carbs': 8, 'fat': 18},
    'carrot_cake': {'calories': 415, 'protein': 5, 'carbs': 52, 'fat': 22},
    'ceviche': {'calories': 145, 'protein': 18, 'carbs': 8, 'fat': 4},
    'cheesecake': {'calories': 320, 'protein': 6, 'carbs': 26, 'fat': 22},
    'cheese_plate': {'calories': 350, 'protein': 22, 'carbs': 3, 'fat': 28},
    'chicken_curry': {'calories': 350, 'protein': 25, 'carbs': 20, 'fat': 18},
    'chicken_quesadilla': {'calories': 540, 'protein': 28, 'carbs': 42, 'fat': 28},
    'chicken_wings': {'calories': 430, 'protein': 25, 'carbs': 12, 'fat': 31},
    'chocolate_cake': {'calories': 352, 'protein': 5, 'carbs': 50, 'fat': 16},
    'chocolate_mousse': {'calories': 310, 'protein': 4, 'carbs': 28, 'fat': 21},
    'churros': {'calories': 315, 'protein': 5, 'carbs': 42, 'fat': 15},
    'clam_chowder': {'calories': 230, 'protein': 12, 'carbs': 18, 'fat': 12},
    'club_sandwich': {'calories': 590, 'protein': 32, 'carbs': 45, 'fat': 32},
    'crab_cakes': {'calories': 340, 'protein': 18, 'carbs': 20, 'fat': 20},
    'creme_brulee': {'calories': 290, 'protein': 4, 'carbs': 28, 'fat': 18},
    'croque_madame': {'calories': 510, 'protein': 28, 'carbs': 32, 'fat': 30},
    'cup_cakes': {'calories': 305, 'protein': 3, 'carbs': 45, 'fat': 13},
    'deviled_eggs': {'calories': 145, 'protein': 10, 'carbs': 2, 'fat': 11},
    'donuts': {'calories': 290, 'protein': 4, 'carbs': 35, 'fat': 15},
    'dumplings': {'calories': 280, 'protein': 12, 'carbs': 35, 'fat': 10},
    'edamame': {'calories': 120, 'protein': 11, 'carbs': 10, 'fat': 5},
    'eggs_benedict': {'calories': 460, 'protein': 20, 'carbs': 25, 'fat': 32},
    'escargots': {'calories': 180, 'protein': 15, 'carbs': 2, 'fat': 12},
    'falafel': {'calories': 333, 'protein': 13, 'carbs': 32, 'fat': 18},
    'filet_mignon': {'calories': 277, 'protein': 26, 'carbs': 0, 'fat': 19},
    'fish_and_chips': {'calories': 585, 'protein': 32, 'carbs': 45, 'fat': 30},
    'foie_gras': {'calories': 462, 'protein': 11, 'carbs': 4, 'fat': 44},
    'french_fries': {'calories': 312, 'protein': 3.4, 'carbs': 41, 'fat': 15},
    'french_onion_soup': {'calories': 190, 'protein': 8, 'carbs': 18, 'fat': 9},
    'french_toast': {'calories': 360, 'protein': 12, 'carbs': 48, 'fat': 14},
    'fried_calamari': {'calories': 330, 'protein': 15, 'carbs': 28, 'fat': 17},
    'fried_rice': {'calories': 333, 'protein': 8, 'carbs': 54, 'fat': 9},
    'frozen_yogurt': {'calories': 127, 'protein': 4, 'carbs': 24, 'fat': 2},
    'garlic_bread': {'calories': 350, 'protein': 9, 'carbs': 43, 'fat': 16},
    'gnocchi': {'calories': 250, 'protein': 6, 'carbs': 48, 'fat': 3},
    'greek_salad': {'calories': 210, 'protein': 7, 'carbs': 12, 'fat': 15},
    'grilled_cheese_sandwich': {'calories': 440, 'protein': 18, 'carbs': 38, 'fat': 24},
    'grilled_salmon': {'calories': 367, 'protein': 40, 'carbs': 0, 'fat': 22},
    'guacamole': {'calories': 160, 'protein': 2, 'carbs': 9, 'fat': 15},
    'gyoza': {'calories': 280, 'protein': 12, 'carbs': 32, 'fat': 11},
    'hamburger': {'calories': 540, 'protein': 28, 'carbs': 42, 'fat': 28},
    'hot_and_sour_soup': {'calories': 90, 'protein': 5, 'carbs': 10, 'fat': 3},
    'hot_dog': {'calories': 290, 'protein': 11, 'carbs': 24, 'fat': 17},
    'huevos_rancheros': {'calories': 410, 'protein': 18, 'carbs': 36, 'fat': 22},
    'hummus': {'calories': 166, 'protein': 8, 'carbs': 14, 'fat': 10},
    'ice_cream': {'calories': 207, 'protein': 3.5, 'carbs': 24, 'fat': 11},
    'lasagna': {'calories': 360, 'protein': 18, 'carbs': 30, 'fat': 18},
    'lobster_bisque': {'calories': 280, 'protein': 14, 'carbs': 12, 'fat': 19},
    'lobster_roll_sandwich': {'calories': 436, 'protein': 24, 'carbs': 36, 'fat': 20},
    'macaroni_and_cheese': {'calories': 370, 'protein': 15, 'carbs': 40, 'fat': 16},
    'macarons': {'calories': 140, 'protein': 2, 'carbs': 20, 'fat': 6},
    'miso_soup': {'calories': 40, 'protein': 3, 'carbs': 5, 'fat': 1},
    'mussels': {'calories': 172, 'protein': 24, 'carbs': 7, 'fat': 4.5},
    'nachos': {'calories': 560, 'protein': 16, 'carbs': 56, 'fat': 30},
    'omelette': {'calories': 154, 'protein': 11, 'carbs': 1.2, 'fat': 12},
    'onion_rings': {'calories': 411, 'protein': 5, 'carbs': 38, 'fat': 27},
    'oysters': {'calories': 68, 'protein': 7, 'carbs': 4, 'fat': 2.5},
    'pad_thai': {'calories': 690, 'protein': 28, 'carbs': 82, 'fat': 26},
    'paella': {'calories': 360, 'protein': 22, 'carbs': 42, 'fat': 11},
    'pancakes': {'calories': 227, 'protein': 6, 'carbs': 28, 'fat': 10},
    'panna_cotta': {'calories': 290, 'protein': 5, 'carbs': 26, 'fat': 19},
    'peking_duck': {'calories': 336, 'protein': 19, 'carbs': 0, 'fat': 28},
    'pho': {'calories': 350, 'protein': 22, 'carbs': 45, 'fat': 8},
    'pizza': {'calories': 266, 'protein': 11, 'carbs': 33, 'fat': 10},
    'pork_chop': {'calories': 231, 'protein': 26, 'carbs': 0, 'fat': 14},
    'poutine': {'calories': 740, 'protein': 28, 'carbs': 82, 'fat': 34},
    'prime_rib': {'calories': 320, 'protein': 25, 'carbs': 0, 'fat': 24},
    'pulled_pork_sandwich': {'calories': 520, 'protein': 30, 'carbs': 46, 'fat': 22},
    'ramen': {'calories': 436, 'protein': 18, 'carbs': 54, 'fat': 16},
    'ravioli': {'calories': 350, 'protein': 14, 'carbs': 42, 'fat': 14},
    'red_velvet_cake': {'calories': 478, 'protein': 5, 'carbs': 68, 'fat': 22},
    'risotto': {'calories': 360, 'protein': 8, 'carbs': 52, 'fat': 12},
    'samosa': {'calories': 262, 'protein': 5, 'carbs': 32, 'fat': 13},
    'sashimi': {'calories': 127, 'protein': 23, 'carbs': 0, 'fat': 3.5},
    'scallops': {'calories': 137, 'protein': 24, 'carbs': 6, 'fat': 1.4},
    'seaweed_salad': {'calories': 45, 'protein': 2, 'carbs': 8, 'fat': 1},
    'shrimp_and_grits': {'calories': 420, 'protein': 24, 'carbs': 38, 'fat': 18},
    'spaghetti_bolognese': {'calories': 370, 'protein': 18, 'carbs': 48, 'fat': 11},
    'spaghetti_carbonara': {'calories': 540, 'protein': 22, 'carbs': 52, 'fat': 26},
    'spring_rolls': {'calories': 140, 'protein': 5, 'carbs': 18, 'fat': 5},
    'steak': {'calories': 271, 'protein': 26, 'carbs': 0, 'fat': 18},
    'strawberry_shortcake': {'calories': 340, 'protein': 5, 'carbs': 48, 'fat': 15},
    'sushi': {'calories': 145, 'protein': 6, 'carbs': 21, 'fat': 4},
    'tacos': {'calories': 226, 'protein': 10, 'carbs': 20, 'fat': 12},
    'takoyaki': {'calories': 240, 'protein': 10, 'carbs': 28, 'fat': 9},
    'tiramisu': {'calories': 240, 'protein': 5, 'carbs': 28, 'fat': 12},
    'tuna_tartare': {'calories': 120, 'protein': 23, 'carbs': 2, 'fat': 2},
    'waffles': {'calories': 291, 'protein': 7, 'carbs': 37, 'fat': 13},
}

def get_nutrition_info(food_name):
    # Membersihkan nama dari model agar cocok dengan key database
    food_key = food_name.lower().replace(' ', '_')
    return FOOD_CATEGORIES.get(food_key, {
        'calories': 0,
        'protein': 0,
        'carbs': 0,
        'fat': 0
    })

def run_inference(file, conf_threshold=0.25):
    # Helper untuk memproses gambar dan menjalankan model
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    results = model(np.array(img), conf=conf_threshold)
    
    detections = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            conf = float(box.conf[0])
            class_name = model.names[class_id]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            
            detections.append({
                'food_name': class_name.replace('_', ' ').title(),
                'confidence': round(conf * 100, 2),
                'bounding_box': {
                    'x1': int(x1), 'y1': int(y1), 'x2': int(x2), 'y2': int(y2)
                },
                'nutrition': get_nutrition_info(class_name),
                'portion': '100g'
            })
    return detections

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model': MODEL_PATH,
        'loaded': model is not None
    })

@app.route('/detect', methods=['POST'])
def detect_food():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        detections = run_inference(request.files['image'])
        
        if not detections:
            return jsonify({'success': False, 'message': 'No food detected'})
        
        # Ambil yang akurasinya paling tinggi
        best_match = max(detections, key=lambda x: x['confidence'])
        
        return jsonify({
            'success': True,
            'detection': best_match,
            'all_detections': detections
        })
    except Exception as e:
        logger.error(f"Error in detect_food: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/detect-multiple', methods=['POST'])
def detect_multiple():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        detections = run_inference(request.files['image'], conf_threshold=0.3)
        
        return jsonify({
            'success': True,
            'count': len(detections),
            'detections': detections
        })
    except Exception as e:
        logger.error(f"Error in detect_multiple: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Port 5001 agar tidak bentrok dengan backend Node.js (biasanya 5000)
    port = int(os.getenv('PORT', 5001))
    print(f"Starting AI Service on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)