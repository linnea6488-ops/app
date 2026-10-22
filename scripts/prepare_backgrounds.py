"""Encode generated PNG artwork as same-size JPEGs for the mobile gallery.

Usage: python3 scripts/prepare_backgrounds.py /path/to/source-map.json
The map is an array of {name, path}; original PNGs are left untouched.
"""
from pathlib import Path
import base64
import json
import re
import struct
import sys
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
items = json.loads(Path(sys.argv[1]).read_text())
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for item in items:
        name = item['name']
        if not re.fullmatch('[a-z]+', name):
            raise ValueError('Invalid asset name')
        source = Path(item['path']).read_bytes()
        if source[:8] != b'\x89PNG\r\n\x1a\n':
            raise ValueError('Expected PNG')
        width, height = struct.unpack('>II', source[16:24])
        page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
        uri = 'data:image/png;base64,' + base64.b64encode(source).decode()
        page.set_content('<!doctype html><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}img{display:block;width:100%;height:100%}</style><img src="' + uri + '">')
        page.wait_for_function('document.querySelector("img").complete && document.querySelector("img").naturalWidth > 0')
        output = root / 'assets' / ('rich-' + name + '.jpg')
        page.screenshot(path=str(output), type='jpeg', quality=85)
        print(name, str(width)+'x'+str(height), str(output.stat().st_size)+' bytes')
        page.close()
    browser.close()
