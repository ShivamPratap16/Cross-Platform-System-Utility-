import platform
import subprocess
import os

def get_os_update_status():
    system = platform.system()
    version = platform.release()

    if system == 'Windows':
        latest_version = "19045"  # Example: Win 10 22H2
        update_status = "Up to Date" if version.endswith(latest_version) else f"Outdated (Build {version} < {latest_version})"
        return {"current": version, "latest": latest_version, "status": update_status}
    
    elif system == 'Darwin':
        output = subprocess.getoutput("sw_vers -productVersion").strip()
        latest = "14.4.1"
        update_status = "Up to Date" if output == latest else f"Outdated ({output} < {latest})"
        return {"current": output, "latest": latest, "status": update_status}
    
    elif system == 'Linux':
        try:
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
    
    return {"status": "Check not supported", "current": version, "latest": "Unknown"}
