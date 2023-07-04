echo "Starting setQuery.sh"
QUERY_LOG=$(node grabMidjourneyQuery.js)

if [ $? -ne 0 ]; then
    echo "FAILED TO GET QUERY"
    echo "$QUERY_LOG"
    exit 1
fi

QUERY=$(echo "$QUERY_LOG" | tail -1)

echo "Query Captured As: $QUERY"

# Update to production
osascript setQuery-sandbox.scpt "$QUERY"
