import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

# Ensure the credentials file exists
cred_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')

if not os.path.exists(cred_path):
    print(f"WARNING: Firebase credentials not found at {cred_path}")
    print("Please download your service account JSON and place it there.")
    db = None
else:
    try:
        # Initialize the Firebase Admin SDK
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        
        # Get a reference to the Firestore database
        db = firestore.client()
        print("Successfully connected to Firebase Firestore!")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        db = None
