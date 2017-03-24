## Super Time Warp: Battle Force

Submission for Global Game Jam 2015! Multiplayer 2D arena shooter with spontaneous time warps.

```
git clone https://github.com/jaburns/super-time-warp
cd super-time-warp
npm install
node .
open localhost:3000
```

Using Docker:
```
docker run -it \
    -p 3000:80                   \ # The game runs on port 80 inside of the docker container
    -e USE_SMOOTHING=true        \ # Set this to render at 60 FPS and lerp between frames. Has sound and particle issues.
    -e IO_URL=http://host:port   \ # Force a specific URL for the socket client to connect to. Useful to dodge nginx overhead.
    -e STATUS_URL=http://url     \ # Send a GET request with ?status=up or =down here when a game starts or finishes.
    jaburns/super-time-warp
```
