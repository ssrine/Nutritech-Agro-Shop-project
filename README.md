


# Nutritech Agro Shop: Running Django and React Together
## Prerequisites
Ensure you have the following installed on your system:

- **Python** (for Django backend) - [Download Python](https://www.python.org/downloads/)
- **Node.js** (for React frontend) - [Download Node.js](https://nodejs.org/)
- **npm** (Node Package Manager, comes with Node.js)
- **pip** (Python package manager)
---

## 1. Running Django Backend
### Step 1: Install Dependencies
First, navigate to your backend directory (nutritech_backend) and set up your virtual environment to isolate the dependencies:

```bash
cd nutritech_backend
python3 -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate the virtual environment (for Linux/macOS)
venv\Scripts\activate  # Activate the virtual environment (for Windows)
```
### Step 2: Install Python Requirements
Now, install the required Python packages listed in the requirements.txt file (if you have one):

```bash
Copier le code
pip install -r requirements.txt
```
If you don't have a requirements.txt file, you'll need to install Django and other dependencies manually:

```bash
Copier le code
pip install django
pip install djangorestframework 
pip install psycopg2  
pip install django-cors-headers  
```
## Step 3: Set Up Database (if necessary)
If you're using SQLite (as shown in your directory structure), you don't need any additional setup. However, if you're using another database (like PostgreSQL), you'll need to configure it in the settings.py file.

### Run migrations to set up the database:

```bash
python3 manage.py migrate
```
## Step 4: Run Django Server
Now that the environment is set up, run the Django development server:

```bash
python3 manage.py runserver
```
This will start the Django backend on http://127.0.0.1:8000/ by default.

## 2. Running React Frontend
### Step 1: Install Node.js Dependencies
Navigate to the frontend directory and install the required Node.js dependencies:

```bash
cd frontend
npm install
```
### Step 2: Run React Development Server
Once the dependencies are installed, start the React development server:

```bash
npm run dev
```
This will start the React development server, and you should be able to access the frontend at http://localhost:PORT/.

## 3. Accessing Both Servers Together
Django Backend: Running at http://127.0.0.1:8000/
React Frontend: Running at http://localhost:PORT/
When developing locally, you can make API calls from the React frontend to the Django backend. For example, if you want to fetch a list of products from the Django API, your React app can make a request to http://127.0.0.1:8000/api/products/ (assuming you’ve set up a REST API endpoint at this URL).

# 4. Conclusion
Backend: Django handles the business logic, API endpoints, and database operations.
Frontend: React handles the UI and user interactions, consuming the backend APIs.
