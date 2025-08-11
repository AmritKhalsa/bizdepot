import os
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime
from utils import load_csv, get_pocketbase_client, get_or_create_broker_id, log_error

def clean_phone_number(phone_number):
    """Removes non-numeric characters and an initial country code (1)."""
    if phone_number == "N/A":
        return "N/A"
    cleaned_number = ''.join(filter(str.isdigit, phone_number))
    if cleaned_number.startswith('1') and len(cleaned_number) > 10:
        cleaned_number = cleaned_number[1:]
    return cleaned_number

def convert_date_format(date_str):
    """Converts MM/DD/YYYY to YYYY-MM-DD 00:00:00."""
    try:
        date_obj = datetime.strptime(date_str, '%m/%d/%Y')
        return date_obj.strftime('%Y-%m-%d 00:00:00')
    except (ValueError, TypeError) as e:
        log_error(f"Failed to convert date '{date_str}': {e}")
        return None
def process_dataframe_row(client, row, column_mapping, get_or_create_broker_id, convert_date_format, clean_phone_number, log_error, Table):
    """
    Processes a single row from a Pandas DataFrame, extracts data based on a column mapping,
    and uploads it to a database.

    Args:
        client: Database client object (e.g., Firebase client).
        row (pd.Series): A row from the Pandas DataFrame.
        column_mapping (dict): A dictionary mapping database field names to DataFrame column names and data types/transformations.
            Example:
            {
                "Buisness_Name": ("Business Name", "str"),
                "Asking_Price": ("Asking Price", "currency_to_int"),
                "Commission_Percentage": ("Commission Percentage", "percentage_to_float"),
                "Date_Listed": ("Date Listed", "date"),
                "Broker_Assigned": ("Broker Assigned", "broker_id"),
                "Owner_Phone": ("Owner Phone", "phone")
            }
        get_or_create_broker_id (function): Function to get or create a broker ID.
        convert_date_format (function): Function to convert date formats.
        clean_phone_number (function): Function to clean phone numbers.
        log_error (function): Function to log errors.

    Returns:
        bool: True if the row was processed successfully, False otherwise.
    """

    upload_data = {}
    try:
        for db_field, (df_column, transform) in column_mapping.items():
            value = row.get(df_column, "N/A")

            if transform == "str":
                upload_data[db_field] = str(value)
            elif transform == "currency_to_int":
                try:
                    upload_data[db_field] = int(str(value).replace("$", '').replace(",", ''))
                except:
                    upload_data[db_field] = None # Handle potential errors in currency conversion
            elif transform == "percentage_to_float":
                commission_str = str(value).strip()
                if commission_str.endswith('%'):
                    upload_data[db_field] = float(commission_str[:-1]) / 100
                else:
                    upload_data[db_field] = 0.0 # Or handle the missing percentage as appropriate.
            elif transform == "date":
                upload_data[db_field] = convert_date_format(str(value))
            elif transform == "numeric":
                 upload_data[db_field] = pd.to_numeric(value, errors='coerce')
            elif transform == "broker_id":
                broker_id = get_or_create_broker_id(client, value)
                if broker_id:
                    upload_data[db_field] = broker_id
                else:
                    log_error(f"broker_id not found.")
                    return False # Skip to the next row
            elif transform == "phone":
                upload_data[db_field] = clean_phone_number(value)
            else:
                upload_data[db_field] = value #Handle default case
                
        client.collection(Table).create(upload_data)
        print(f"Created listing: {upload_data.get('Buisness_Name', 'Unknown Business')}") # Use .get() for safety
        return True

    except Exception as e:
        log_error(f"Error processing row: {e} \n Data: {upload_data}")
        return False


if __name__ == '__main__':
    load_dotenv(dotenv_path='../../client/.env')

    pocketbase_url = os.getenv('POCKETBASE_URL')
    pocketbase_email = os.getenv('POCKETBASE_EMAIL')
    pocketbase_password = os.getenv('POCKETBASE_PASSWORD')

    if not all([pocketbase_url, pocketbase_email, pocketbase_password]):
        log_error("POCKETBASE_URL, POCKETBASE_EMAIL, or POCKETBASE_PASSWORD not set.")
        exit()

    client = get_pocketbase_client(pocketbase_url, pocketbase_email, pocketbase_password)
    if not client:
        exit()

    data = load_csv("listings.csv")
    if data is None:
        exit()

    print(data.head())
    print(f"DataFrame columns: {data.columns.tolist()}")

    column_mapping = {
        "Buisness_Name": ("Business Name", "str"),
        "Confidential_Listing_Name": ("Confidential Listing Name", "str"),
        "Location": ("Location", "str"),
        "Asking_Price": ("Asking Price", "currency_to_int"),
        "Commission_Percentage": ("Commission Percentage", "percentage_to_float"),
        "Agents_Split": ("Agent's Split", "percentage_to_float"),
        "Date_Listed": ("Date Listed", "date"),
        "Day_Stage_Changed": ("Day Stage Changed", "date"),
        "Inquiry_Calls_Taken": ("Inquiry Calls Taken", "numeric"),
        "Current_Stage": ("Current Stage", "str"),
        "Status": ("Status", "str"),
        "Broker_Assigned": ("Broker Assigned", "broker_id"),
        "Owner_Name": ("Owner Name", "str"),
        "Owner_Email": ("Owner Email", "str"),
        "Owner_Phone": ("Owner Phone", "phone"),
        "Description": ("Description", "str"),
        "BizBuySell_Listing_Link": ("BizBuySell Listing Link", "str"),
        "BizDepot_Listing_Link": ("BizDepot Listing Link", "str"),
        "Drive_Link": ("Drive Link", "str"),
    }
    

    for index, row in data.iterrows():
        if not process_dataframe_row(client, row, column_mapping, get_or_create_broker_id, convert_date_format, clean_phone_number, lambda msg: log_error(f"Row {index + 1}: {msg}"), "Listings"):
            continue
