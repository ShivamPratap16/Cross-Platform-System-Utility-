import platform
import subprocess

def get_disk_encryption_status():
    system = platform.system()

    try:
        if system == 'Windows':
            output = subprocess.check_output(
                ['powershell', '-Command', 'manage-bde -status C:'],
                stderr=subprocess.DEVNULL,
                universal_newlines=True
            )
            encrypted = "Percentage Encrypted:  100%" in output
            return {"encryption": "Encrypted (BitLocker)" if encrypted else "Not Encrypted"}
        
        elif system == 'Darwin':
            output = subprocess.check_output(['fdesetup', 'status'], universal_newlines=True)
            encrypted = "FileVault is On." in output
            return {"encryption": "Encrypted (FileVault)" if encrypted else "Not Encrypted"}
        
        elif system == 'Linux':
            output = subprocess.getoutput("lsblk -o NAME,MOUNTPOINT,TYPE | grep /$")
            root_device = output.strip().split()[0]
            luks_status = subprocess.getoutput(f"cryptsetup status {root_device}")
            is_encrypted = "is active" in luks_status
            return {"encryption": "Encrypted (LUKS)" if is_encrypted else "Not Encrypted"}

    except Exception as e:
        return {"encryption": f"Error: {str(e)}"}
