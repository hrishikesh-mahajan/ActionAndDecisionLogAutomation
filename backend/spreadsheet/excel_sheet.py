"""
This module provides functions for loading and saving data from an Excel file using pandas.
"""

import json
import os
from typing import Any

import pandas as pd


def load_excel_data() -> pd.DataFrame:
    """
    Load data from an Excel file and return it as a pandas DataFrame.

    Returns:
        pd.DataFrame: The loaded Excel data as a DataFrame.
    """
    current_config: dict[str, Any] = json.load(
        open(os.path.join(os.getcwd(), "config.json"), encoding="utf-8")
    )
    current_config["EXCEL_FILEPATH"] = os.path.join(os.getcwd())
    dataframe = pd.read_excel(
        os.path.join(current_config["EXCEL_FILEPATH"], current_config["EXCEL_FILENAME"])
    )
    return dataframe


def save_excel_data(dataframe: pd.DataFrame) -> bool:
    """
    Save a pandas DataFrame to an Excel file.

    Args:
        dataframe (pd.DataFrame): The DataFrame to be saved.

    Returns:
        bool: True if the DataFrame is successfully saved, False otherwise.
    """
    current_config: dict[str, Any] = json.load(
        open(os.path.join(os.getcwd(), "config.json"), encoding="utf-8")
    )
    current_config["EXCEL_FILEPATH"] = os.path.join(os.getcwd())
    dataframe.to_excel(
        os.path.join(
            current_config["EXCEL_FILEPATH"], current_config["EXCEL_FILENAME"]
        ),
        index=False,
    )
    return True


def read_excel_rows() -> list[dict[str, Any]]:
    """
    Read the rows of an Excel file and return them as a list of dictionaries.

    Returns:
        list[dict[str, Any]]: The rows of the Excel file as a list of dictionaries.
    """
    dataframe: pd.DataFrame = load_excel_data()
    list_of_rows: list[dict[str, Any]] = []
    for idx in dataframe.index:
        excel_row: dict[str, Any] = {"id": str(dataframe.index[idx])}
        for key, value in dataframe.iloc[idx].items():
            excel_row[str(key)] = str(value)
        list_of_rows.append(excel_row)
    return list_of_rows


def append_excel_rows(list_of_rows: list[dict[str, Any]]) -> bool:
    """
    Append rows to an Excel file.

    Args:
        list_of_rows (list[dict[str, Any]]): The rows to be appended.

    Returns:
        bool: True if the rows are successfully appended, False otherwise.
    """
    dataframe: pd.DataFrame = load_excel_data()
    list_of_rows_to_append: list[dict[str, Any]] = []
    for row in list_of_rows:
        list_of_rows_to_append.append(row)
    dataframe = pd.concat(
        [dataframe, pd.DataFrame(list_of_rows_to_append)], ignore_index=True
    )
    save_excel_data(dataframe)
    return True


def insert_excel_row_by_id(row_id: int, row: dict[str, Any]) -> bool:
    """
    Insert a row into an Excel file at a specific index.

    Args:
        row_id (int): The index at which the row should be inserted.
        row (dict[str, Any]): The row to be inserted.

    Returns:
        bool: True if the row is successfully inserted, False otherwise.
    """
    dataframe: pd.DataFrame = load_excel_data()
    if row_id > dataframe.shape[0]:
        return False
    dataframe = pd.concat(
        [dataframe.iloc[:row_id], pd.DataFrame([row]), dataframe.iloc[row_id:]],
        ignore_index=True,
    )
    save_excel_data(dataframe)
    return True


def update_excel_row_by_id(row_id: int, row: dict[str, Any]) -> bool:
    """
    Update a row in an Excel file at a specific index.

    Args:
        row_id (int): The index of the row to be updated.
        row (dict[str, Any]): The updated row.

    Returns:
        bool: True if the row is successfully updated, False otherwise.
    """
    dataframe: pd.DataFrame = load_excel_data()
    if row_id in dataframe.index:
        excel_row = dataframe.loc[row_id].to_dict()
        for key, value in row.items():
            excel_row[str(key)] = value
        dataframe.loc[row_id] = pd.Series(excel_row)
        save_excel_data(dataframe)
        return True
    return False


def delete_excel_row_by_id(row_id: int) -> bool:
    """
    Delete a row from an Excel file at a specific index.

    Args:
        row_id (int): The index of the row to be deleted.

    Returns:
        bool: True if the row is successfully deleted, False otherwise.
    """
    dataframe: pd.DataFrame = load_excel_data()
    if row_id in dataframe.index:
        dataframe = dataframe.drop(row_id)
        save_excel_data(dataframe)
        return True
    return False
