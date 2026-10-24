"""Render video.html to MP4 + WebM + poster: every frame is window.render(t), captured headless.

Usage: python render.py <out-dir>
Needs: playwright (chromium), numpy, ffmpeg on PATH.
"""
import pathlib
import subprocess
import sys

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else HERE.parent).resolve()
OUT.mkdir(parents=True, exist_ok=True)
FPS, DUR, W, H = 30, 20.0, 1920, 1080
POSTER_T = 17.9  # outro: mark, name, line and call to action all settled

audio = OUT / "audio.wav"
subprocess.run([sys.executable, str(HERE / "make_audio.py"), str(audio)], check=True)

mp4 = OUT / "kairo-tour.mp4"
encoder = subprocess.Popen(
    ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
     "-i", str(audio), "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
     "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(mp4)],
    stdin=subprocess.PIPE,
)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": W, "height": H})
    page.goto((HERE / "video.html").as_uri())
    page.wait_for_function("window.__ready === true", timeout=60000)
    frames = int(FPS * DUR)
    for i in range(frames):
        page.evaluate(f"window.render({i / FPS})")
        encoder.stdin.write(page.screenshot(type="png"))
        if i % 60 == 0:
            print(f"frame {i}/{frames}", flush=True)
    page.evaluate(f"window.render({POSTER_T})")
    page.screenshot(path=str(OUT / "kairo-tour.jpg"), type="jpeg", quality=88)
    browser.close()

encoder.stdin.close()
if encoder.wait() != 0:
    sys.exit("ffmpeg failed while encoding the MP4")

subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp4), "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34",
                "-row-mt", "1", "-c:a", "libopus", "-b:a", "128k", str(OUT / "kairo-tour.webm")], check=True)
audio.unlink()
print("wrote", mp4, OUT / "kairo-tour.webm", OUT / "kairo-tour.jpg")
