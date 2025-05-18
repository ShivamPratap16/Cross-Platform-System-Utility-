from PyQt5.QtWidgets import QApplication
from gui.app import SystemUtilityApp
from utils.system_checks import collect_all_status
from daemon import start_daemon
import sys
import atexit
import logging

def cleanup_daemon(daemon_process):
    if daemon_process and daemon_process.is_alive():
        logging.info("GUI closed but daemon continues running")

if __name__ == '__main__':
    # Start daemon as independent process
    daemon_process = start_daemon()
    
    # Register cleanup function
    atexit.register(cleanup_daemon, daemon_process)
    
    # Start GUI
    app = QApplication(sys.argv)
    window = SystemUtilityApp()
    window.show()
    sys.exit(app.exec_())