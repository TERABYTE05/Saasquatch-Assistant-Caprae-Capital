# Myopia-Detection-Using-Fundus-Images

# Myopia Detection Assistant

**Myopia Detection Assistant** is a classical machine-learning tool designed to classify **retinal fundus images** as either **Myopic** or **Normal**.  
It uses handcrafted image features and a **Random Forest classifier** to provide fast, interpretable, and accurate eye-health screening without deep learning.

---

## Features

- **Fundus Image Classification:** Detects whether a retina image shows Myopia.  
- **Explainable Model:** Uses interpretable features like brightness, contrast, entropy, edges, and sharpness  
- **High Accuracy:** 97.50% accuracy on 2000 fundus images  
- **Lightweight & Fast:** Runs on CPU — no GPU required  
- **Easy to Use:** Supports local + Google Colab setups  

---

## How It Works

1. Upload retina images  
2. Extract handcrafted image features  
3. Train Random Forest model  
4. Predict: **Myopic / Normal**  
5. Optionally retrain on your dataset  

---

#  Model Metrics

This document summarizes the evaluation metrics for the **Myopia Detection ML Model** trained on 2000 retinal fundus images.

---

##  Performance Summary

| Metric       | Score     |
|--------------|----------|
| Accuracy     | **97.50%** |
| Precision    | **98%** |
| Recall       | **97–98%** |
| F1-Score     | **97–98%** |

---

## Confusion Matrix

|                | Pred Normal | Pred Myopic |
|----------------|-------------|-------------|
| **Actual Normal** | 194 |  7 |
| **Actual Myopic** |  3 | 196 |

---

##  Interpretation

- **High accuracy (97.5%)**: Model is highly reliable
- **Balanced precision + recall**: Good for medical screening
- **Low false positives & false negatives**: Suitable as a baseline diagnostic assistant

---

###  Notes

This is a **non-deep-learning model** using handcrafted features, proving traditional ML can still perform well in medical classification tasks.

Future versions will compare with **RETFound and CNNs**.


# 🧠 Tech Stack

This project uses a classical Machine Learning pipeline for medical image analysis.

---

## Languages & Frameworks
| Category | Tools |
|---|---|
| Programming Language | **Python** |
| ML Framework | **Scikit-Learn** |
| Image Processing | **OpenCV**, **Scikit-Image** |
| Math & Data | **NumPy**, **Pandas** |
| Visualization | **Matplotlib** |
| Notebook Environment | **Google Colab / Jupyter** |



### Author  
**Teesha**  
Biomedical + AI enthusiast passionate about medical imaging research ✨

---

### Purpose  
This project demonstrates that **classical machine learning** can still deliver strong results in medical imaging before moving to deep learning.

