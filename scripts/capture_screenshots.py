"""Capture the README screenshots from a running dev build.

Usage: python scripts/capture_screenshots.py [base-url] [--ask]   (default http://localhost:5173)
Start the backend and `npm run dev` first. Images land in docs/screenshots/.
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

_args = [a for a in sys.argv[1:] if not a.startswith("--")]
BASE = (_args[0] if _args else "http://localhost:5173").rstrip("/")
OUT = pathlib.Path(__file__).resolve().parent.parent / "docs" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)
ADMIN = ("alexander.wright@enterprise.com", "P@ssw0rd!2026")
USER = ("sarah.jenkins@enterprise.com", "Secur3_Token#88")


def shot(page, name, full_page=False):
    page.wait_for_timeout(700)
    page.screenshot(path=str(OUT / f"{name}.png"), full_page=full_page)
    print("saved", name)


def sign_in(page, creds):
    page.goto(f"{BASE}/login")
    page.evaluate("localStorage.clear()")
    page.goto(f"{BASE}/login")
    page.fill("#email", creds[0])
    page.fill("#password", creds[1])
    page.click("button[type=submit]")
    page.wait_for_url(f"{BASE}/app")
    # Sarah's scope never contains Alexander's tasks, so wait on one she owns
    page.wait_for_selector("text=Weekly sprint retro notes")


with sync_playwright() as p:
    browser = p.chromium.launch()
    desktop = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1.5)
    page = desktop.new_page()

    # Marketing and sign-in
    page.goto(BASE)
    page.wait_for_selector("text=Viewing as")
    page.emulate_media(reduced_motion="reduce")  # freeze the auto-flipping scope demo
    shot(page, "01-landing")
    page.get_by_role("radio", name="Sarah").click()
    page.wait_for_timeout(900)
    page.locator("text=Viewing as").first.scroll_into_view_if_needed()
    page.evaluate("window.scrollBy(0, -120)")
    shot(page, "02-landing-scope")
    page.goto(f"{BASE}/login")
    shot(page, "03-login")

    # Admin workspace
    sign_in(page, ADMIN)
    shot(page, "04-workspace-admin")
    page.click("aside >> text=Board")
    shot(page, "05-board")
    page.click("aside >> text=Calendar")
    shot(page, "06-calendar")
    page.click("aside >> text=Tasks")
    page.click("text=Prepare Q4 budget report")
    page.wait_for_timeout(600)
    shot(page, "07-task-drawer")
    page.keyboard.press("Escape")
    page.goto(f"{BASE}/app")
    page.wait_for_selector("text=Prepare Q4 budget report")
    page.click("header >> text=Copilot")
    shot(page, "08-copilot")
    page.goto(f"{BASE}/app")
    page.wait_for_selector("text=Prepare Q4 budget report")
    page.click("aside >> text=Team & roles")
    page.wait_for_selector("text=sarah.jenkins@enterprise.com")
    shot(page, "09-admin-team")

    # Admin chat assistant (pass --ask to capture a live Groq answer; needs GROQ_API_KEY)
    page.click("button[aria-label='Open Admin Assistant']")
    if "--ask" in sys.argv:
        page.fill("textarea", "How many tasks does each person have, by status?")
        page.keyboard.press("Enter")
        page.wait_for_selector("text=Working on it", state="detached", timeout=90000)
    shot(page, "10-admin-assistant")

    # Member scope
    sign_in(page, USER)
    page.click("button[aria-label='Open Kairo Assistant']")
    shot(page, "11-workspace-member")

    page.goto(f"{BASE}/brand")
    page.wait_for_selector("text=Brand kit")
    shot(page, "12-brand-kit")

    # Phone
    phone = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    mp = phone.new_page()
    mp.emulate_media(reduced_motion="reduce")
    mp.goto(BASE)
    mp.wait_for_selector("h1")
    shot(mp, "13-mobile-landing")
    browser.close()
