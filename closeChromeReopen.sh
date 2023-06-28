killall "Google Chrome"
echo "Killed Chrome Processes"
sleep 4
open -a "Google Chrome" --args --start-fullscreen --kiosk /Users/mikeland/WeatherWindow/home.html 
echo "Reopend Chrome with home.html"
