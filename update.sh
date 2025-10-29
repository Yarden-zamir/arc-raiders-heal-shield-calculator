#!/bin/bash

# Auto-update script for Arc Raiders Calculator
# Checks for changes and only rebuilds if necessary
# Can also install itself as a systemd service

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to install as systemd service
install_service() {
    echo "======================================"
    echo "📦 Installing Auto-Update Service"
    echo "======================================"
    echo ""

    if [ "$EUID" -ne 0 ]; then
        echo "❌ Installation requires root privileges"
        echo "Run: sudo $0 --install"
        exit 1
    fi

    # Create service file
    cat > /etc/systemd/system/arc-calculator-update.service <<EOF
[Unit]
Description=Arc Raiders Calculator Auto-Update
After=network.target

[Service]
Type=oneshot
User=root
WorkingDirectory=$SCRIPT_DIR
ExecStart=$SCRIPT_DIR/update.sh
StandardOutput=append:/var/log/arc-calculator-update.log
StandardError=append:/var/log/arc-calculator-update.log

[Install]
WantedBy=multi-user.target
EOF

    # Create timer file
    cat > /etc/systemd/system/arc-calculator-update.timer <<EOF
[Unit]
Description=Arc Raiders Calculator Auto-Update Timer
Requires=arc-calculator-update.service

[Timer]
OnBootSec=30sec
OnUnitActiveSec=10sec
AccuracySec=1sec

[Install]
WantedBy=timers.target
EOF

    # Make script executable
    chmod +x "$SCRIPT_DIR/update.sh"

    # Reload systemd
    systemctl daemon-reload

    # Enable and start timer
    systemctl enable arc-calculator-update.timer
    systemctl start arc-calculator-update.timer

    echo "✅ Installation complete!"
    echo ""
    echo "Auto-update will check for changes every 10 seconds."
    echo ""
    echo "📋 Useful commands:"
    echo "  Status:  systemctl status arc-calculator-update.timer"
    echo "  Logs:    tail -f /var/log/arc-calculator-update.log"
    echo "  Stop:    systemctl stop arc-calculator-update.timer"
    echo "  Start:   systemctl start arc-calculator-update.timer"
    echo "  Disable: systemctl disable arc-calculator-update.timer"
    echo ""
    echo "======================================"
    exit 0
}

# Function to uninstall service
uninstall_service() {
    echo "======================================"
    echo "🗑️  Uninstalling Auto-Update Service"
    echo "======================================"
    echo ""

    if [ "$EUID" -ne 0 ]; then
        echo "❌ Uninstallation requires root privileges"
        echo "Run: sudo $0 --uninstall"
        exit 1
    fi

    systemctl stop arc-calculator-update.timer 2>/dev/null || true
    systemctl disable arc-calculator-update.timer 2>/dev/null || true
    rm -f /etc/systemd/system/arc-calculator-update.service
    rm -f /etc/systemd/system/arc-calculator-update.timer
    systemctl daemon-reload

    echo "✅ Uninstalled successfully!"
    exit 0
}

# Check for command line arguments
case "$1" in
    --install)
        install_service
        ;;
    --uninstall)
        uninstall_service
        ;;
    --help)
        echo "Arc Raiders Calculator Auto-Update Script"
        echo ""
        echo "Usage:"
        echo "  $0              Run update check (default)"
        echo "  $0 --install    Install as systemd service (10s interval)"
        echo "  $0 --uninstall  Remove systemd service"
        echo "  $0 --help       Show this help"
        exit 0
        ;;
esac

# Normal update logic
# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Store current commit hash
BEFORE_COMMIT=$(git rev-parse HEAD)

# Fetch latest changes (doesn't modify working directory)
git fetch origin --quiet 2>/dev/null

# Get remote commit hash
CURRENT_BRANCH=$(git branch --show-current)
AFTER_COMMIT=$(git rev-parse origin/"$CURRENT_BRANCH" 2>/dev/null)

# Check if there are changes
if [ "$BEFORE_COMMIT" = "$AFTER_COMMIT" ]; then
    # No changes, exit silently
    exit 0
fi

# Changes detected!
echo "======================================"
echo "🔄 Changes detected! Updating..."
echo "======================================"
echo "From: ${BEFORE_COMMIT:0:7}"
echo "To:   ${AFTER_COMMIT:0:7}"
echo ""

# Pull latest changes
git pull origin "$CURRENT_BRANCH" --quiet

# Check if package.json changed
if git diff "$BEFORE_COMMIT" HEAD --name-only | grep -q "package.json"; then
    echo "📦 Installing dependencies..."
    npm install --quiet
fi

# Build the project
echo "🔨 Building project..."
npm run build

echo ""
echo "✅ Build complete!"

# Reload nginx if it's running
if command -v nginx &> /dev/null; then
    echo "🔄 Reloading nginx..."
    sudo nginx -t 2>&1 | grep -q "successful" && sudo systemctl reload nginx
fi

echo "✨ Update finished at $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================"
echo ""
