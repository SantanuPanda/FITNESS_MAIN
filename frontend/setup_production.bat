@echo off
echo Setting up production mode for frontend
echo ====================================
echo.

node set_production.js
node force_production_mode.js

echo.
echo Setup complete. Press any key to exit...
pause > nul 