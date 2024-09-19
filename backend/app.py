"""
This module contains the Flask application for the AtlasCopco backend API.
It provides endpoints to interact with an Excel sheet, including:
- Reading
- Appending
- Updating
- Deleting rows.
"""

import os
from pprint import pprint
from typing import Any, Optional

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mail import Mail, Message
from send_mail import send_mail
from spreadsheet.excel_sheet import (
    append_excel_rows,
    delete_excel_row_by_id,
    insert_excel_row_by_id,
    read_excel_rows,
    update_excel_row_by_id,
)

app = Flask(__name__)
CORS(app)
load_dotenv()

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS")
app.config["MAIL_USE_SSL"] = os.getenv("MAIL_USE_SSL")
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)


@app.route("/api/data", methods=["GET"])
def get_rows():
    """
    Get all rows from the Excel sheet.

    Returns:
        A JSON response containing all the rows from the Excel sheet.
    """
    rows = read_excel_rows()
    return jsonify(rows)


@app.route("/api/data/<int:row_id>", methods=["GET"])
def get_row_by_id(row_id: int):
    """
    Get a specific row from the Excel sheet by its ID.

    Args:
        row_id: The ID of the row to retrieve.

    Returns:
        A JSON response containing the row with the specified ID.
    """
    row = read_excel_rows()[row_id]
    return jsonify(row)


@app.route("/api/data", methods=["POST"])
def append_rows():
    """
    Append new rows to the Excel sheet.

    Returns:
        A JSON response containing the appended rows.
    """
    rows: Optional[list[dict[str, Any]]] = request.json
    if not isinstance(rows, list):
        return jsonify({"error": "rows must be a list"}), 400
    for row in rows:
        if not isinstance(row, dict):
            return jsonify({"error": "row must be a dict"}), 400
    append_excel_rows(rows)
    return jsonify(rows), 201


@app.route("/api/data/<int:row_id>", methods=["POST"])
def insert_row_by_id(row_id: int):
    """
    Insert a new row at a specific position in the Excel sheet.

    Args:
        row_id: The ID of the row where the new row should be inserted.

    Returns:
        A JSON response containing the inserted row.
    """
    row: Optional[dict[str, Any]] = request.json
    if not isinstance(row, dict):
        return jsonify({"error": "row must be a dict"}), 400
    if insert_excel_row_by_id(row_id, row):
        return jsonify(row), 201
    return jsonify({"status": "failed"}), 400


@app.route("/api/data/<int:row_id>", methods=["PUT"])
def update_row_by_id(row_id: int):
    """
    Update a specific row in the Excel sheet.

    Args:
        row_id: The ID of the row to update.

    Returns:
        A JSON response containing the updated row.
    """
    row: Optional[dict[str, Any]] = request.json
    if not isinstance(row, dict):
        return jsonify({"error": "row must be a dict"}), 400
    if update_excel_row_by_id(row_id, row):
        return jsonify(row), 200
    return jsonify({"status": "failed"}), 400


@app.route("/api/data/<int:row_id>", methods=["PATCH"])
def patch_row_by_id(row_id: int):
    """
    Partially update a specific row in the Excel sheet.

    Args:
        row_id: The ID of the row to update.

    Returns:
        A JSON response containing the updated row.
    """
    row: Optional[dict[str, Any]] = request.json
    if row is None:
        return jsonify({"error": "row must be a dict"}), 400
    if update_excel_row_by_id(row_id, row):
        updated_row = read_excel_rows()[row_id]
        return jsonify(updated_row), 200
    return jsonify({"status": "failed"}), 400


@app.route("/api/data/<int:row_id>", methods=["DELETE"])
def delete_row_by_id(row_id: int):
    """
    Delete a specific row from the Excel sheet.

    Args:
        row_id: The ID of the row to delete.

    Returns:
        A JSON response indicating the status of the deletion.
    """
    if delete_excel_row_by_id(row_id):
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "failed"}), 400


@app.route("/api/mail", methods=["POST"])
def send_mail_to_all():
    """
    Send an email to all rows in the Excel sheet.

    Returns:
      A JSON response indicating the status of the email sending.
    """
    rows = read_excel_rows()
    for row in rows:
        if not send_mail(row):
            return jsonify({"status": "failed"}), 400
    return jsonify({"status": "success"}), 200


@app.route("/api/mail/<int:row_id>", methods=["POST"])
def send_mail_by_id(row_id: int):
    """
    Send an email using the ID of the row.

    Returns:
        A JSON response indicating the status of the email sending.
    """
    row = read_excel_rows()[row_id]
    if send_mail(row):
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "failed"}), 400


@app.route("/api/mail/flask", methods=["POST"])
def send_flask_mail():
    """
    Sends an email using Flask-Mail extension.

    This function is a route handler for the "/api/mail/flask" endpoint. \
    It expects a POST request with a JSON payload containing the email details. \
    The payload should have the following structure:
    {
        "subject": str,  # The subject of the email
        "to": str,  # The recipient's email address
        "html": str  # The HTML content of the email
    }

    The function retrieves the email details from the request payload, creates an HTML template \
    with the provided HTML content, and sends the email using the Flask-Mail extension.

    Returns:
        A JSON response with the status "success" and HTTP status code 200.
    """
    msg = request.get_json()
    html = f"""
    <html lang="en" className="scroll-smooth">
    <head></head>
    <body>
    <p>{msg["html"]}</p></body>
    """
    with app.app_context():
        msg = Message(msg["subject"], recipients=[msg["to"]], html=html)
        mail.send(msg)
    return jsonify({"status": "success"}), 200


@app.route("/graph/access_token")
def get_access_token():
    """
    Get the access token from the query parameters.

    Returns:
        A JSON response containing the access token.
    """
    access_token = request.args.get("access_token")
    pprint(access_token)
    return jsonify(access_token)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
