from utils.disk_encryption import get_disk_encryption_status
from utils.os_update import get_os_update_status
from utils.antivirus import get_antivirus_status
from utils.sleep_settings import get_sleep_settings

def collect_all_status():
    return {
        "encryption": get_disk_encryption_status(),
        "os_update": get_os_update_status(),
        "antivirus": get_antivirus_status(),
        "sleep": get_sleep_settings()
    }