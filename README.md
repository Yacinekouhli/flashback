# 🎉 Flashback App

Flashback is a viral app that allows users to generate fun images by combining their selfie with an iconic photo using text-to-image stable model.

## 📂 Project structure

```plaintext
flashback/
├── flashback-backend (Python FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   ├── services.py
│   │   └── static/
│   │       ├── iconic/ (images prédéfinies)
│   │       └── abbey_road.jpg, etc.
│   │   ├── selfies/ (uploads)
│   │   └── results/ (flashbacks générés)
│   └── pyproject.toml (poetry)
│
├── flashback-frontend-simple (Expo React Native)
│   ├── App.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── UploadScreen.js
│   │   └── ResultScreen.js
│   ├── services/
│   │   └── api.js
│   └── package.json
└── README.md
