import multiprocessing
import time
import json
import requests
import logging
import platform
import sys
import os
from datetime import datetime
from utils.system_checks import collect_all_status
from config import CHECK_INTERVAL_MIN, API_ENDPOINT

# Set up logging with absolute path
log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, 'daemon.log')),
        logging.StreamHandler()
    ]
)

def send_report(data):
    try:
        # Format data to match schema
        formatted_data = {
            "timestamp": datetime.now().isoformat(),
            "diskEncryption": {
                "encryption": data["encryption"]["encryption"],
                "platform": platform.system().lower()
            },
            "osUpdate": {
                "updateStatus": data["os_update"]["status"],
                "lastChecked": datetime.now().isoformat(),
                "platform": platform.system().lower()
            },
            "antivirus": {
                "antivirus": data["antivirus"]["antivirus"],
                "platform": platform.system().lower()
            },
            "sleepSettings": {
                "sleepTimeoutMinutes": str(data["sleep"]["sleepTimeoutMinutes"]),
                "platform": platform.system().lower()
            }
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(API_ENDPOINT, json=formatted_data, headers=headers, timeout=10)
        response.raise_for_status()
        logging.info(f"Server response: {response.status_code}")
        return True
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to send report: {str(e)}")
        return False

def has_changed(current, last):
    if last is None:
        return True
    return current != last

def run_daemon():
    logging.info("System monitoring daemon started")
    last_report = None
    last_error = None

    # Initial data collection and send
    try:
        initial_data = collect_all_status()
        logging.info("Sending initial system status...")
        if send_report(initial_data):
            last_report = initial_data
            logging.info("Successfully sent initial status to server")
        else:
            logging.error("Failed to send initial status")
    except Exception as e:
        logging.error(f"Error during initial status check: {str(e)}")
    
    # Main monitoring loop
    while True:
        try:
            current = collect_all_status()
            
            if has_changed(current, last_report):
                logging.info("Changes detected in system status")
                if send_report(current):
                    last_report = current
                    logging.info("Successfully reported changes to server")
            else:
                logging.info("No changes detected in system status")
                
            time.sleep(CHECK_INTERVAL_MIN * 60)  # Wait for interval
            
            # Reset error state if successful
            if last_error:
                last_error = None
                logging.info("Recovered from previous error state")
                
        except Exception as e:
            if str(e) != last_error:
                last_error = str(e)
                logging.error(f"Error during status check: {last_error}")

def start_daemon():
    daemon_process = multiprocessing.Process(target=run_daemon, daemon=False)
    daemon_process.start()
    return daemon_process

if __name__ == "__main__":
    try:
        run_daemon()
    except KeyboardInterrupt:
        logging.info("Daemon stopped by user")
    except Exception as e:
        logging.error(f"Daemon stopped due to error: {str(e)}")
