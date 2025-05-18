import platform
import subprocess
import re
import logging

def get_sleep_settings():
    system = platform.system()
    
    try:
        if system == 'Windows':
            # Use elevated PowerShell command
            output = subprocess.check_output(
                ['powershell', '-Command', 'powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE'],
                stderr=subprocess.PIPE,
                universal_newlines=True
            )
            
            ac = re.search(r'Current AC Power Setting Index:\s*0x([0-9a-fA-F]+)', output)
            dc = re.search(r'Current DC Power Setting Index:\s*0x([0-9a-fA-F]+)', output)

            # Convert hex values to minutes
            ac_minutes = int(ac.group(1), 16) // 60 if ac else None
            dc_minutes = int(dc.group(1), 16) // 60 if dc else None

            # Check compliance (sleep timeout should be 10 minutes or less)
            compliant = (ac_minutes is not None and dc_minutes is not None and
                        0 < ac_minutes <= 10 and 0 < dc_minutes <= 10)

            return {
                "sleepTimeoutMinutes": str(ac_minutes) if ac_minutes is not None else "Unknown",
                "platform": system.lower(),
                "details": {
                    "ac": str(ac_minutes) if ac_minutes is not None else "Unknown",
                    "dc": str(dc_minutes) if dc_minutes is not None else "Unknown"
                },
                "compliant": compliant
            }

        elif system == 'Darwin':  # macOS
            output = subprocess.check_output(['pmset', '-g'], universal_newlines=True)
            match = re.search(r'sleep\s+(\d+)', output)
            minutes = int(match.group(1)) if match else None
            compliant = minutes is not None and 0 < minutes <= 10

            return {
                "sleepTimeoutMinutes": str(minutes) if minutes is not None else "Unknown",
                "platform": system.lower(),
                "details": {"sleep": str(minutes) if minutes is not None else "Unknown"},
                "compliant": compliant
            }

    except subprocess.CalledProcessError as e:
        logging.error(f"Error running sleep check command: {e}")
        return {
            "sleepTimeoutMinutes": "Error",
            "platform": system.lower(),
            "details": {"error": str(e)},
            "compliant": False
        }
    except Exception as e:
        logging.error(f"Unexpected error in sleep check: {e}")
        return {
            "sleepTimeoutMinutes": "Unknown",
            "platform": system.lower(),
            "details": {"error": str(e)},
            "compliant": False
        }

    return {
        "sleepTimeoutMinutes": "Unsupported",
        "platform": system.lower(),
        "details": {"status": "Unsupported OS"},
        "compliant": False
    }
