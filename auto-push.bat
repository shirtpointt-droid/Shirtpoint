@echo off
cd /d "D:\T-Shirt Point"
git add .
git diff --cached --quiet && exit /b 0
git commit -m "auto-save %date% %time%"
git pull origin main --rebase
git push
