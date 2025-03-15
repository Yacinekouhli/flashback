# 🎉 Flashback App

Flashback est une application virale qui permet aux utilisateurs de générer des images amusantes combinant leur selfie à une photo iconique grâce à l'intelligence artificielle.

## 📂 Structure du projet

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
