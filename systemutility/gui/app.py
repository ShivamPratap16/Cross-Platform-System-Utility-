# gui/app.py
import sys
from PyQt5.QtWidgets import (QApplication, QWidget, QLabel, QVBoxLayout, 
                            QPushButton, QMessageBox, QFrame, QGridLayout)
from PyQt5.QtGui import QFont, QIcon
from PyQt5.QtCore import Qt, QTimer
from utils.disk_encryption import get_disk_encryption_status
from utils.os_update import get_os_update_status
from utils.antivirus import get_antivirus_status
from utils.sleep_settings import get_sleep_settings

class StatusCard(QFrame):
    def __init__(self, title, parent=None):
        super().__init__(parent)
        self.setFrameStyle(QFrame.StyledPanel | QFrame.Raised)
        self.setStyleSheet("""
            QFrame {
                background-color: #f8f9fa;
                border-radius: 10px;
                padding: 10px;
                margin: 5px;
            }
        """)
        layout = QVBoxLayout(self)
        
        self.title = QLabel(title)
        self.title.setStyleSheet("color: #495057; font-weight: bold;")
        self.status = QLabel("Checking...")
        self.status.setStyleSheet("color: #6c757d;")
        
        layout.addWidget(self.title)
        layout.addWidget(self.status)

class SystemUtilityApp(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
        
    def initUI(self):
        self.setWindowTitle("System Security Monitor")
        self.setGeometry(100, 100, 600, 400)
        self.setStyleSheet("""
            QWidget {
                background-color: #ffffff;
                font-family: 'Segoe UI', Arial;
            }
            QPushButton {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #0056b3;
            }
        """)
        
        main_layout = QVBoxLayout()
        grid_layout = QGridLayout()
        
        # Create status cards
        self.disk_card = StatusCard("Disk Encryption")
        self.update_card = StatusCard("OS Update Status")
        self.antivirus_card = StatusCard("Antivirus Status")
        self.sleep_card = StatusCard("Sleep Settings")
        
        # Arrange cards in grid
        grid_layout.addWidget(self.disk_card, 0, 0)
        grid_layout.addWidget(self.update_card, 0, 1)
        grid_layout.addWidget(self.antivirus_card, 1, 0)
        grid_layout.addWidget(self.sleep_card, 1, 1)
        
        # Create and style refresh button
        self.refresh_btn = QPushButton("⟳ Refresh Status")
        self.refresh_btn.setCursor(Qt.PointingHandCursor)
        self.refresh_btn.clicked.connect(self.refresh_status)
        
        main_layout.addLayout(grid_layout)
        main_layout.addWidget(self.refresh_btn, alignment=Qt.AlignCenter)
        self.setLayout(main_layout)
        
        # Add auto-refresh timer
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.refresh_status)
        self.timer.start(300000)  # Auto-refresh every 5 minutes
        
        self.refresh_status()

    def refresh_status(self):
        try:
            encryption_status = get_disk_encryption_status()
            status_text = encryption_status['encryption']
            color = "#28a745" if "Encrypted" in status_text else "#dc3545"
            self.disk_card.status.setStyleSheet(f"color: {color}; font-weight: bold;")
            self.disk_card.status.setText(status_text)
        except Exception as e:
            self.disk_card.status.setStyleSheet("color: #dc3545;")
            self.disk_card.status.setText(f"Error: {str(e)}")

        try:
            update_status = get_os_update_status()
            status_text = update_status['status']
            color = "#28a745" if "Up to Date" in status_text else "#dc3545"
            self.update_card.status.setStyleSheet(f"color: {color}; font-weight: bold;")
            self.update_card.status.setText(status_text)
        except Exception as e:
            self.update_card.status.setStyleSheet("color: #dc3545;")
            self.update_card.status.setText(f"Error: {str(e)}")

        try:
            antivirus_status = get_antivirus_status()
            status_text = antivirus_status['antivirus']
            color = "#28a745" if "Enabled" in status_text else "#dc3545"
            self.antivirus_card.status.setStyleSheet(f"color: {color}; font-weight: bold;")
            self.antivirus_card.status.setText(status_text)
        except Exception as e:
            self.antivirus_card.status.setStyleSheet("color: #dc3545;")
            self.antivirus_card.status.setText(f"Error: {str(e)}")

        try:
            sleep_status = get_sleep_settings()
            compliance = "Compliant" if sleep_status['compliant'] else "Not Compliant"
            color = "#28a745" if sleep_status['compliant'] else "#dc3545"
            self.sleep_card.status.setStyleSheet(f"color: {color}; font-weight: bold;")
            self.sleep_card.status.setText(compliance)
        except Exception as e:
            self.sleep_card.status.setStyleSheet("color: #dc3545;")
            self.sleep_card.status.setText(f"Error: {str(e)}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = SystemUtilityApp()
    window.show()
    sys.exit(app.exec_())
