echo "Starting repostEphemeralMessage"

QUERY_LOG=$(/usr/local/bin/node /Users/mikeland/WeatherWindow/grabStuckMidjourney.js)

if [ $? -ne 0 ]; then
    echo "FAILED TO GET QUERY"
    echo "$QUERY_LOG"
    exit 1
fi

QUERY=$(echo "$QUERY_LOG" | tail -1)

echo "Query Captured As: $QUERY"

osascript /Users/mikeland/WeatherWindow/activateDiscord.scpt

echo "Activated Discord, Checking for Ephemeral Message"

EPHEMERAL_MESSAGE_QUERY_LOG=$(/usr/local/bin/node /Users/mikeland/WeatherWindow/checkForEphemeralMessage.js)

EPHEMERAL_MESSAGE_QUERY=$(echo "$EPHEMERAL_MESSAGE_QUERY_LOG" | tail -1)

if [ "$EPHEMERAL_MESSAGE_QUERY" == "FOUND EPHEMERAL MESSAGE" ]; then
    echo "Detected Ephemeral Message Proceeding"
else
    echo "NO Ephemeral Message Detected Ending Process"
    exit 0
fi

osascript /Users/mikeland/WeatherWindow/saveAndPostLastDiscordImage.scpt