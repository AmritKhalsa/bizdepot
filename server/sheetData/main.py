
import os
import pandas as pd
from dotenv import load_dotenv
from pocketbase import PocketBase
from datetime import datetime

# Define a log file name
LOG_FILE = "error_log.txt"
def clean_phone_number(phone_number):
    """Removes non-numeric characters and an initial country code (1) from a phone number string."""
    if phone_number == "N/A":
        return "N/A"  # Or any other default value you want to use

    cleaned_number = ''.join(filter(str.isdigit, phone_number))

    if cleaned_number.startswith('1') and len(cleaned_number) > 10:
        cleaned_number = cleaned_number[1:]  # Remove the leading '1'

    return cleaned_number

def log_error(message: str):
    """
    Logs an error message to a designated log file.
    
    Args:
        message (str): The error message to be logged.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f"[{timestamp}] ERROR: {message}\n")

def convert_date_format(date_str):
    """
    Converts a date string from MM/DD/YYYY to YYYY-MM-DD HH:MM:SS format.
    
    Args:
        date_str (str): The date string to convert.
        
    Returns:
        str: The converted date string, or None if conversion fails.
    """
    try:
        date_obj = datetime.strptime(date_str, '%m/%d/%Y')
        return date_obj.strftime('%Y-%m-%d 00:00:00')
    except (ValueError, TypeError) as e:
        log_error(f"Failed to convert date '{date_str}': {e}")
        return None

def sheetData():
    """
    Loads data from listings.csv into a pandas DataFrame.
    
    Returns:
        pd.DataFrame: DataFrame containing data from listings.csv, or None on error.
    """
    try:
        file_path = os.path.join(os.path.dirname(__file__), 'listings.csv')
        if not os.path.exists(file_path):
            log_error("File not found: listings.csv")
            return None
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        log_error(f"Error loading listings.csv: {e}")
        return None

def get_or_create_broker_id(client, broker_name):
    """
    Gets the ID of a broker by name, creating a new broker if not found.
    
    Args:
        client (PocketBase): The PocketBase client instance.
        broker_name (str): The name of the broker.
        
    Returns:
        str: The ID of the broker, or None on error.
    """
    if not broker_name or not isinstance(broker_name, str):
        log_error(f"Invalid broker name provided: '{broker_name}'")
        return None
    try:
        # Note: PocketBase's get_first_list is deprecated, use get_first_full_list instead.
        # Assuming get_first_list works for now.
        
        broker_record = client.collection("Broker").get_first_list_item(filter=f'Name="{broker_name}"')
        return broker_record.id
    except Exception as e:
        print('err')
        log_error(f"Broker '{broker_name}' not found. Attempting to create a new one.")
        try:
            new_broker_record = client.collection("Broker").create({"Name": broker_name})
            
            return new_broker_record.id
        except Exception as create_e:
            log_error(f"Failed to create new broker '{broker_name}': {create_e}")
            return None

if __name__ == '__main__':
    load_dotenv(dotenv_path='../../client/.env')

    pocketbase_email = os.getenv('POCKETBASE_EMAIL')
    pocketbase_url = os.getenv('POCKETBASE_URL')
    pocketbase_password = os.getenv('POCKETBASE_PASSWORD')

    if not pocketbase_url or not pocketbase_password or not pocketbase_email:
        log_error("POCKETBASE_URL, POCKETBASE_PASSWORD, or POCKETBASE_EMAIL environment variables not set.")
        exit()

    client = PocketBase(pocketbase_url)

    try:
        client.collection('_superusers').auth_with_password(pocketbase_email, pocketbase_password)
        print("Successfully authenticated with PocketBase.")
    except Exception as e:
        log_error(f"Error authenticating with PocketBase: {e}")
        exit()
    
    data = sheetData()
    if data is not None:
        print(data.head())
        
        # Log column names for debugging
        print(f"DataFrame columns: {data.columns.tolist()}")

        for index, row in data.iterrows():
            # print(f"Processing row {index + 1}...")
            
            # Use a dictionary to store data to be uploaded, and handle potential errors.
            upload_data = {}
            
            # Centralize data validation and conversion to make error handling cleaner
            try:
                # Assign default values or handle potential missing keys/data
                upload_data["Buisness_Name"] = row.get("Business Name", "N/A")
                upload_data["Confidential_Listing_Name"] = row.get("Confidential Listing Name", "N/A")
                upload_data["Location"] = row.get("Location", "N/A")
                
                # Handle numeric conversions and potential format errors
                
                
                upload_data["Asking_Price"] = int(row.get("Asking Price").replace("$", '').replace(",", ''))
                
                commission_str = str(row.get("Commission Percentage", "0%")).strip()
                
                if commission_str.endswith('%'):
                    upload_data["Commission_Percentage"] = float(commission_str[:-1]) / 100
                
                    
                agent_split_str = str(row.get("Agent's Split", "0%")).strip()
                if agent_split_str.endswith('%'):
                    upload_data["Agents_Split"] = float(agent_split_str[:-1]) / 100
                
                
                # Handle date conversions
                upload_data["Date_Listed"] = convert_date_format(str(row.get("Date_Listed", "")))
                upload_data["Day_Stage_Changed"] = convert_date_format(str(row.get("Day Stage Changed", "")))
                
                # Handle other fields
                upload_data["Inquiry_Calls_Taken"] = pd.to_numeric(row.get("Inquiry Calls Taken", 0), errors='coerce')
                upload_data["Current_Stage"] = row.get("Current Stage", "N/A")
                upload_data["Status"] = row.get("Status", "N/A")
                
                # Handle foreign key lookup
                broker_name = row.get("Broker Assigned", "Unknown Broker")
                broker_id = get_or_create_broker_id(client, broker_name)
                if broker_id:
                    upload_data["Broker_Assigned"] = broker_id
                else:
                    log_error(f"Skipping row {index + 1} due to missing or invalid broker_id for '{broker_name}'.")
                    continue
                    
                # Other simple string fields
                upload_data["Owner_Name"] = row.get("Owner Name", "N/A")
                upload_data["Owner_Email"] = row.get("Owner Email", "N/A")
                upload_data["Owner_Phone"] = clean_phone_number(row.get("Owner Phone", "N/A"))

                upload_data["Description"] = row.get("Description", "N/A")
                upload_data["BizBuySell_Listing_Link"] = row.get("BizBuySell Listing Link", "N/A")
                upload_data["BizDepot_Listing_Link"] = row.get("BizDepot Listing Link", "N/A")
                upload_data["Drive_Link"] = row.get("Drive Link", "N/A")
                
                # Create the listing record
                
                result = client.collection("Listings").create(upload_data)
                print(f"Successfully created listing for '{upload_data.get('Buisness_Name', 'N/A')}'.")

            except Exception as e:
                # Log any error encountered during data processing or upload for the specific row
                print("err", upload_data["Buisness_Name"])
                log_error(f"Error processing row {index + 1} with data '{upload_data}': {e}")
                continue # Continue to the next row despite the error