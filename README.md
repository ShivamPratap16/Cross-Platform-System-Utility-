# Cross-Platform System Monitoring Utility

A comprehensive system monitoring solution that tracks security settings across Windows, macOS, and Linux systems. The utility monitors disk encryption, OS updates, antivirus status, and power settings, reporting them to a central server.

## Features

- **Cross-Platform Support**

  - Windows
  - macOS
  - Linux

- **Security Monitoring**

  - Disk Encryption Status (BitLocker, FileVault, LUKS)
  - Operating System Updates
  - Antivirus Status
  - Sleep/Power Settings

- **Architecture**
  - Python-based GUI (PyQt5)
  - Background Monitoring Daemon
  - RESTful API Integration
  - Real-time Status Updates

## Project Structure

```
cross-platform-monitoring/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│   └── index.html
└── systemutility/
    ├── gui/
    ├── utils/
    ├── daemon.py
    ├── main.py
    └── config.py
```

## Setup Instructions

### Prerequisites

- Python 3.10 or later
- Node.js 14.x or later
- MongoDB
- pip and npm package managers

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### System Utility Setup

```bash
cd systemutility
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Daemon Operation

The monitoring daemon runs independently and continues monitoring even after the GUI closes:

- **Start Daemon**: `python daemon.py`
- **Check Status**: View logs in `systemutility/logs/daemon.log`
- **Stop Daemon**: Use Task Manager to end the Python process

## Configuration

The system can be configured through `config.py`:

- API endpoint
- Check intervals
- Logging settings
- Compliance thresholds

## API Endpoints

- `POST /api/reports` - Submit system status report
- `GET /api/reports` - Retrieve monitoring history
- `GET /api/reports/export` - Export reports as CSV

## Security Compliance

The system checks for:

- Active disk encryption
- Up-to-date OS
- Active antivirus
- Sleep timeout ≤ 10 minutes

## Development

### Running Tests

```bash
cd systemutility
python -m pytest tests/
```

### Building for Distribution

```bash
cd frontend
npm run build
cd ../systemutility
python setup.py build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

- Report issues on GitHub
- Contact: shivampratap54451@gmail.com
