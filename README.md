# PharmaManager - SMARTHOLOL

PharmaManager est une application fullstack de gestion de pharmacie. Elle permet de gérer le stock de médicaments, les catégories, et de réaliser des ventes tout en déduisant automatiquement le stock en temps réel. Les médicaments en alerte de stock (stock actuel <= stock minimum) sont mis en évidence de la même manière.

## 🛠️ Stack Technique
- **Backend** : Django REST Framework, PostgreSQL
- **Frontend** : React 18, Vite, Tailwind CSS, Axios
- **Documentation API** : Swagger UI (drf-spectacular)

---

## 🚀 Installation & Démarrage (Moins de 10 minutes)

### 1. Prérequis
Vous devez avoir installé :
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL**

---

### 2. Configuration du Backend (Django)

Ouvrez un terminal et placez-vous à la racine du projet :

```bash
cd backend
```

**Création et activation de l'environnement virtuel :**
```bash
python -m venv venv
# Sur Windows :
.\venv\Scripts\activate
# Sur Linux/Mac :
source venv/bin/activate
```

**Installation des dépendances :**
```bash
pip install -r requirements.txt
```

**Variables d'environnement :**
Copiez le fichier d'exemple et renommez-le en `.env` :
```bash
cp .env.example .env
```
_(Modifiez les valeurs de DB_NAME, DB_USER, DB_PASSWORD dans le fichier `.env` pour correspondre à votre base de données PostgreSQL locale)._

**Migrations et Fixtures :**
```bash
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json
```
_Les fixtures chargeront automatiquement des catégories, des médicaments (dont deux en alerte) ainsi que quelques ventes d'exemple._

**Démarrage du serveur Django :**
```bash
python manage.py runserver
```
Le backend sera disponible sur : **http://localhost:8000**
👉 **Documentation Swagger** accessible sur : **http://localhost:8000/api/docs/**

---

### 3. Configuration du Frontend (React/Vite)

Ouvrez un second terminal et placez-vous à la racine du projet :

```bash
cd frontend
```

**Installation des dépendances :**
```bash
npm install
```

**Variables d'environnement :**
Assurez-vous qu'un fichier `.env` est présent et contient :
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Démarrage du serveur Vite :**
```bash
npm run dev
```
Le frontend sera accessible sur : **http://localhost:5173** (ou port défini par Vite).

---

## 🧪 Tests Manuels & Fonctionnalités clés
1. **Créer une Vente** : Ajouter des médicaments au panier depuis `/ventes`. Le total se calcule automatiquement, et après validation, le stock de chaque médicament est déduit.
2. **Annuler une Vente** : Depuis l'historique `/historique`, l'annulation d'une vente modifie le statut et **réintègre automatiquement le stock** des articles concernés.
3. **Soft Delete Médicament** : Supprimer un médicament le marque comme `Inactif` (est_actif=False) et préserve l'historique des ventes qui y sont liées, sans perte d'intégrité de la BDD.

---

## 🔄 Relancer le projet au quotidien

Si vous fermez le projet et que vous souhaitez le relancer plus tard pour voir le site, voici les 2 étapes simples à faire à chaque fois :

**Terminal 1 (Backend) :**
```bash
cd backend
# Activer l'environnement virtuel (Windows)
.\venv\Scripts\activate
# Lancer le serveur
python manage.py runserver
```

**Terminal 2 (Frontend) :**
```bash
cd frontend
# Lancer l'interface
npm run dev
```
