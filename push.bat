@echo off
cd /d "D:\T-Shirt Point"
git add .
git add Backend/uploads/ -f
git commit -m "update %date% %time%"
git pull origin main --rebase
git push
echo.
echo Done! GitHub update ho gaya.
pause
