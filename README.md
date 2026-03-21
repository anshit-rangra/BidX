# BidX
A social media platform where people can buy items by bidding.

## Cloud Setup (Firebase)

BidX uses **Firebase** (Google Cloud) for its real-time database, authentication, file storage, and hosting.

### Prerequisites

| Tool | Purpose |
|------|---------|
| [Node.js ≥ 18](https://nodejs.org) | JavaScript runtime |
| [Firebase CLI](https://firebase.google.com/docs/cli) | Deploy and manage Firebase services |
| A Google account | Required to access the Firebase Console |

---

### 1. Install the Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Log in to Firebase

```bash
firebase login
```

### 3. Create a Firebase project

Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project, **or** use the CLI:

```bash
firebase projects:create your-project-id
```

### 4. Clone the repository and install dependencies

```bash
git clone https://github.com/anshit-rangra/BidX.git
cd BidX
npm install
```

### 5. Configure environment variables

```bash
cp .env.example .env
# Open .env and replace the placeholder values with your Firebase project credentials.
# You can find these in the Firebase Console → Project Settings → Your apps → SDK setup.
```

### 6. Link the project to your Firebase app

```bash
firebase use --add
# Select your project and give it an alias (e.g. "default")
```

Or edit `.firebaserc` directly:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 7. Enable Firebase services

In the [Firebase Console](https://console.firebase.google.com/) enable:
- **Authentication** → Sign-in method (e.g. Email/Password, Google)
- **Firestore Database** → Create database (start in test mode, then apply `firestore.rules`)
- **Storage** → Create default bucket (then apply `storage.rules`)
- **Hosting** → Set up hosting for the web app

### 8. Deploy to Firebase

Deploy everything at once:

```bash
firebase deploy
```

Or deploy individual services:

```bash
# Hosting only
firebase deploy --only hosting

# Firestore rules + indexes only
firebase deploy --only firestore

# Storage rules only
firebase deploy --only storage
```

### 9. Run locally with Firebase Emulators

```bash
firebase emulators:start
```

This starts local emulators for Firestore, Auth, Storage, and Hosting so you can develop and test without hitting the live cloud.

---

## Project Structure

```
BidX/
├── src/
│   └── config/
│       └── firebase.js     # Firebase SDK initialisation (Auth, Firestore, Storage)
├── .env.example            # Environment variable template
├── .firebaserc             # Firebase project aliases
├── firebase.json           # Firebase service configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── storage.rules           # Cloud Storage security rules
└── package.json
```

## Firebase Services Used

| Service | Usage |
|---------|-------|
| **Authentication** | User sign-up / sign-in |
| **Firestore** | Real-time bid and item data |
| **Cloud Storage** | Item images and user avatars |
| **Hosting** | Serve the web application |
