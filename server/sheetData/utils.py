import os
import pandas as pd
from datetime import datetime
from pocketbase import PocketBase

LOG_FILE = "error_log.txt"

# ------------------ Logging ------------------ #
def log_error(message: str):
    """
    Logs an error message to a designated log file.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f"[{timestamp}] ERROR: {message}\n")


# ------------------ CSV Utilities ------------------ #
def load_csv(file_name: str) -> pd.DataFrame:
    """
    Loads data from a CSV file into a pandas DataFrame.

    Args:
        file_name (str): The CSV file name (relative to this file's directory).

    Returns:
        pd.DataFrame: Loaded DataFrame, or None on error.
    """
    try:
        file_path = os.path.join(os.path.dirname(__file__), file_name)
        if not os.path.exists(file_path):
            log_error(f"File not found: {file_name}")
            return None
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        log_error(f"Error loading {file_name}: {e}")
        return None


# ------------------ PocketBase Utilities ------------------ #
def get_pocketbase_client(url: str, email: str, password: str) -> PocketBase:
    """
    Authenticates with PocketBase and returns the client instance.
    """
    try:
        client = PocketBase(url)
        client.collection('_superusers').auth_with_password(email, password)
        print("Successfully authenticated with PocketBase.")
        return client
    except Exception as e:
        log_error(f"Error authenticating with PocketBase: {e}")
        return None


def get_or_create_broker_id(client, broker_name: str) -> str:
    """
    Gets the ID of a broker by name, creating one if it does not exist.
    """
    if not broker_name or not isinstance(broker_name, str):
        log_error(f"Invalid broker name provided: '{broker_name}'")
        return None

    try:
        broker_record = client.collection("Broker").get_first_list_item(filter=f'Name="{broker_name}"')
        return broker_record.id
    except Exception:
        log_error(f"Broker '{broker_name}' not found. Attempting to create a new one.")
        try:
            new_broker_record = client.collection("Broker").create({"Name": broker_name})
            return new_broker_record.id
        except Exception as create_e:
            log_error(f"Failed to create new broker '{broker_name}': {create_e}")
            return None
