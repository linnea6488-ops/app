"""Rasterize the supplied SVG without changing its canvas, colors or whitespace.

Development-only utility: requires Playwright and Chromium. No runtime dependency.
"""
from pathlib import Path
import base64
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
source = root / 'assets/icons/app-icon.svg'
url = 'data:image/svg+xml;base64,' + base64.b64encode(source.read_bytes()).decode()
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for size, filename in [(180, 'apple-touch-icon.png'), (192, 'app-icon-192.png'), (512, 'app-icon-512.png')]:
        page = browser.new_page(viewport={'width': size, 'height': size}, device_scale_factor=1)
        page.set_content('<!doctype html><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}img{display:block;width:100%;height:100%;object-fit:contain}</style><img src="' + url + '">')
        page.wait_for_function('document.querySelector("img").complete && document.querySelector("img").naturalWidth === 512')
        page.screenshot(path=str(root / 'assets/icons' / filename), omit_background=False)
        page.close()
    browser.close()
