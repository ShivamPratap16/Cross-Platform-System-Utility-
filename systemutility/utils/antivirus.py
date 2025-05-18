import platform
import subprocess
import os

def get_antivirus_status():
    system = platform.system()
    
    if system == 'Windows':
        try:
            output = subprocess.check_output(
                ['powershell', 'Get-MpComputerStatus'],
                stderr=subprocess.DEVNULL,
                universal_newlines=True
            )
            enabled = "AntivirusEnabled" in output and "True" in output
            return {"antivirus": "Enabled" if enabled else "Disabled"}
        except Exception:
            return {"antivirus": "Error or Unknown"}
            
    elif system == 'Darwin':  # macOS
        try:
            # Check for common macOS antivirus products
            av_paths = [
                '/Applications/Sophos',
                '/Applications/Symantec',
                '/Applications/McAfee',
                '/Applications/Kaspersky',
                '/Library/Application Support/Malwarebytes'
            ]
            
            # Check XProtect (built-in)
            xprotect = os.path.exists('/System/Library/CoreServices/XProtect.bundle')
            
            installed_av = [path for path in av_paths if os.path.exists(path)]
            
            if xprotect or installed_av:
                return {"antivirus": "Enabled"}
            return {"antivirus": "Not Detected"}
        except Exception:
            return {"antivirus": "Error or Unknown"}
            
    elif system == 'Linux':
        try:
            # Check for common Linux antivirus products
            av_processes = [
                'clamav',
                'sophos',
                'mcafee',
                'symantec',
                'kaspersky'
            ]
            
            # Use ps command to check running AV processes
            ps_output = subprocess.check_output(
                ['ps', 'aux'],
                stderr=subprocess.DEVNULL,
                universal_newlines=True
            ).lower()
            
            # Check if any AV process is running
            av_running = any(av in ps_output for av in av_processes)
            
            # Check if ClamAV is installed
            try:
                clamscan = subprocess.check_output(
                    ['which', 'clamscan'],
                    stderr=subprocess.DEVNULL,
                    universal_newlines=True
                )
                if clamscan or av_running:
                    return {"antivirus": "Enabled"}
            except:
                if av_running:
                    return {"antivirus": "Enabled"}
                
            return {"antivirus": "Not Detected"}
        except Exception:
            return {"antivirus": "Error or Unknown"}
            
    return {"antivirus": f"Check not supported on {system}"}
