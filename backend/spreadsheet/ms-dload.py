import json
import os

import pandas as pd
import requests
# from flask import jsonify

from .ms_graph import GRAPH_API_ENDPOINT, generate_access_token

APP_ID = '13335156-e225-4aea-abef-34c23bd3ff5d'
SCOPES = ['Files.Read']
save_location = os.getcwd()

file_ids = ['6960D96AF51CDAE6!9669']

access_token = generate_access_token(APP_ID, scopes=SCOPES)
headers = {
    'Authorization': 'Bearer ' + access_token['access_token']
}

# Step 1. get the file name
for file_id in file_ids:
    response_file_info = requests.get(
        GRAPH_API_ENDPOINT + f'/me/drive/items/{file_id}',
        headers=headers,
        params={'select': 'name'}
    )
    file_name = response_file_info.json().get('name')

    # Step 2. downloading OneDrive file
    response_file_content = requests.get(
        GRAPH_API_ENDPOINT + f'/me/drive/items/{file_id}/content',
        headers=headers)
    data = pd.read_excel(response_file_content.content)

project_id = data.Project_Id
designation = data.Designation
employee_id = data.Employee_Id
task_id = data.Task_Id
task_name = data.Task_Name
due_date = data.Due_Date
task_status = data.Task_Status
reminders = data.N0_OF_REMINDERS
Email = data.Email

container = []
x = 0

while x < len(project_id):
    temp = {
        "Project_Id": str(project_id[x]),
        "Designation": str(designation[x]),
        "Employee_Id": str(employee_id[x]),
        "Mail": str(Email[x]),
        "Task_Id": str(task_id[x]),
        "Due": str(due_date[x]),
        "Task_status": str(task_status[x]),
        "Reminders": str(reminders[x]),
        "Task_name": str(task_name[x])
    }

    container.append(temp)
    x += 1

print(container)
json_data = json.dumps(container)
print(json_data)
# df = pd.DataFrame(container)
# json = container.to_json()
json = json.dumps(container)
print(json)
# Print json object


def excel_data():
    return json_data
# Step 3: Process the data (e.g., print it in the console)

    # with open(os.path.join(save_location, file_name), 'wb') as _f:
    # _f.write(response_file_content.content)


'''file_id = '6960D96AF51CDAE6!9669'''
