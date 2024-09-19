# Flask App

## Description

This is the Flask backend for the Atlas Copco Project. It provides REST API endpoints for creating, reading, updating and deleting projects and tasks. It also provides endpoints for sending reminder mails.

## Installation

1. Clone the repository.
2. Navigate to the project directory:

  ```sh
  cd backend
  ```

3. Create a virtual environment:

   - For Windows:

    ```bat
    python -m venv .venv
    ```

   - For macOS/Linux:

    ```sh
    python3 -m venv .venv
    ```

4. Activate the virtual environment:

   - For Windows:

    ```bat
    venv\Scripts\activate.bat
    ```

   - For macOS/Linux:

    ```sh
    source venv/bin/activate
    ```

5. Install the dependencies:

  ```sh
  pip install -r requirements.txt
  ```

## Usage

1. Run the Flask app:

  ```sh
  python app.py
  ```

1. Open your web browser and go to `http://localhost:5000` to access the app.

## Dependencies

- [Flask](https://pypi.org/project/Flask/)
- [Flask_Cors](https://pypi.org/project/Flask-Cors/)
- [Flask_Mail](https://pypi.org/project/Flask-Mail/)
- [msal](https://pypi.org/project/msal/)
- [openpyxl](https://pypi.org/project/openpyxl/)
- [pandas](https://pypi.org/project/pandas/)
- [python-dotenv](https://pypi.org/project/python-dotenv/)
- [Requests](https://pypi.org/project/requests/)
