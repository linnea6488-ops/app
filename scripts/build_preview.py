"""Build a portable review HTML from the current static application."""
from pathlib import Path
import base64
import re

root = Path(__file__).resolve().parents[1]

def embedded(path):
    asset = root / path
    mime = {'.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2'}[asset.suffix]
    return 'data:' + mime + ';base64,' + base64.b64encode(asset.read_bytes()).decode()

css = re.sub(r'url\("(assets/[^\"]+)"\)', lambda match: 'url("' + embedded(match[1]) + '")', (root / 'styles.css').read_text())
html = re.sub(r'<link rel="stylesheet" href="styles\.css[^"]*">', lambda _: '<style>' + css + '</style>', (root / 'index.html').read_text())
html = re.sub(r'<script src="(?:app|i18n)\.js[^"]*" defer></script>', '', html)
html = re.sub(r'src="(assets/[^\"]+)"', lambda match: 'src="' + embedded(match[1]) + '"', html)
html = html.replace('</body>', '<script>' + (root / 'i18n.js').read_text() + '\n' + (root / 'app.js').read_text() + '</script></body>')
(root / 'motivation-preview.html').write_text(html)
print('Built motivation-preview.html')
