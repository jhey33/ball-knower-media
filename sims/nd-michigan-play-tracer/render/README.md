# ND vs Michigan play tracer: build and render

`src.html` is the editable source. `../index.html` is the built, self-contained sim
(fonts and Three.js inlined). `../play.mp4` is the 10-second 1080p60 render.

## Edit and rebuild the sim
```bash
cd sims/nd-michigan-play-tracer/render
npm install          # first time only
# edit src.html
npm run build        # writes ../index.html
```

## Re-render the MP4
```bash
npm run render             # 10 s at 60 fps -> ../play.mp4
node render.js 10 30       # optional: seconds, fps (faster test renders)
```
`all` runs build then render. Requires `ffmpeg` and Playwright's Chromium.
On a machine with a real GPU, drop the `--use-angle=swiftshader` flags in
`render.js` for a much faster render. In this sandbox a full 10 s render takes about 15 minutes.

## Notes
- Editing `src.html` is the only way to change the sim. Do not hand-edit `../index.html`,
  because the next build overwrites it.
- Scripts run from any directory, because they resolve paths from their own location.
