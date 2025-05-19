import platform
import subprocess
import os
import winreg
import win32com.client

def get_windows_update_status():
    try:
        # Using Windows Update Agent API
        update_session = win32com.client.Dispatch('Microsoft.Update.Session')
        update_searcher = update_session.CreateUpdateSearcher()
        search_result = update_searcher.Search("IsInstalled=0")  # Search for pending updates
        
        updates_pending = search_result.Updates.Count
        
        if updates_pending > 0:
            return {
                "current": platform.release(),
                "latest": f"{updates_pending} updates pending",
                "status": "Updates Available"
            }
        
        # Check Windows Update last check time
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, 
                           r"SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\Results\Detect",
                           0, winreg.KEY_READ)
        last_check = winreg.QueryValueEx(key, "LastSuccessTime")[0]
        winreg.CloseKey(key)

        return {
            "current": platform.release(),
            "latest": "System is current",
            "status": "Up to Date",
            "lastCheck": last_check
        }
        
    except Exception as e:
        return {
            "current": platform.release(),
            "latest": "Unknown",
            "status": f"Error checking updates: {str(e)}"
        }

def get_os_update_status():
    system = platform.system()
    
    if system == 'Windows':
        return get_windows_update_status()
    
    elif system == 'Darwin':
        output = subprocess.getoutput("sw_vers -productVersion").strip()
        latest = "14.4.1"
        update_status = "Up to Date" if output == latest else f"Outdated ({output} < {latest})"
        return {"current": output, "latest": latest, "status": update_status}
    
    elif system == 'Linux':
        try:
            # Get Linux version
            version = platform.release()
            # Check for different package managers
            if os.path.exists('/usr/bin/apt'):
                # Debian/Ubuntu
                subprocess.run(['apt-get', 'update'], check=True, capture_output=True)
                output = subprocess.check_output(['apt-get', '-s', 'upgrade'], universal_newlines=True)
                updates_available = '0 upgraded, 0 newly installed, 0 to remove' not in output
            
            elif os.path.exists('/usr/bin/dnf'):
                # Fedora/RHEL
                output = subprocess.check_output(['dnf', 'check-update'], universal_newlines=True)
                updates_available = len(output.strip().split('\n')) > 1
            
            elif os.path.exists('/usr/bin/pacman'):
                # Arch Linux
                subprocess.run(['pacman', '-Sy'], check=True, capture_output=True)
                output = subprocess.check_output(['pacman', '-Qu'], universal_newlines=True)
                updates_available = len(output.strip()) > 0
            
            else:
                return {"status": "Unknown package manager", "current": version, "latest": "Unknown"}

            update_status = "Updates Available" if updates_available else "Up to Date"
            return {
                "current": version,
                "latest": "System updates available" if updates_available else "Current",
                "status": update_status
            }

        except subprocess.CalledProcessError:
            return {"status": "Error checking updates", "current": version, "latest": "Unknown"}
        except Exception as e:
            return {"status": f"Error: {str(e)}", "current": version, "latest": "Unknown"}
    
    version = platform.release()
    return {"status": "Check not supported", "current": version, "latest": "Unknown"}
