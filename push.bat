@echo off
cd /d "D:\T-Shirt Point"
git add .
git commit -m "update %date% %time%"
git push
echo.
echo Done! GitHub update ho gaya.
pause
