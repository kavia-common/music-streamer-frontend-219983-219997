#!/bin/bash
cd /home/kavia/workspace/code-generation/music-streamer-frontend-219983-219997/spotify_clone_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

