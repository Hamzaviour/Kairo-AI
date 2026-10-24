"""Print kairo-proposal.html to docs/Kairo_Product_Proposal.pdf with headless Chromium."""
import pathlib

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "Kairo_Product_Proposal.pdf"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto((HERE / "kairo-proposal.html").as_uri(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.pdf(path=str(OUT), format="A4", print_background=True, prefer_css_page_size=True)
    browser.close()

print("wrote", OUT)
