#!/bin/sh

# Start backend
cd /app/backend && node dist/index.js &

# Start frontend  
cd /app && serve -s frontend/dist -l 3000 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
