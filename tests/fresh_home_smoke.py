from playwright.sync_api import sync_playwright, expect
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=b.new_context(viewport={'width':390,'height':844})
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8080',wait_until='networkidle')
 initial_quote=page.locator('#home .quote').inner_text()
 initial_image=page.locator('#home .wallpaper-image').get_attribute('src')
 page.locator('[data-open="type"]').click()
 page.locator('#quote-input').fill('My custom words for this visit.')
 page.locator('#source-input').fill('My source')
 page.locator('[data-align="right"]').click()
 page.keyboard.press('Escape')
 page.locator('#favorite').click()
 # Internal navigation must not discard current editing.
 page.locator('#menu').click();page.locator('[data-settings="language"]').click()
 page.locator('[data-language="fr"]').click();page.locator('#detail-back').click();page.locator('#settings-back').click()
 assert page.locator('#home .quote').inner_text()=='My custom words for this visit.'
 context.storage_state(path='/tmp/motivation-fresh-state.json')
 page.close()
 # Reopen an actual new tab with the same browser storage.
 page=context.new_page();page.goto('http://127.0.0.1:8080',wait_until='networkidle')
 assert page.locator('html').get_attribute('lang')=='fr'
 assert page.locator('#home .quote').inner_text() not in ['My custom words for this visit.',initial_quote]
 assert page.locator('#home .wallpaper-image').get_attribute('src')!=initial_image
 quote=page.locator('#home .quote').inner_text();image=page.locator('#home .wallpaper-image').get_attribute('src')
 for _ in range(4):
  page.reload(wait_until='networkidle')
  assert page.locator('#home .quote').inner_text()!=quote
  assert page.locator('#home .wallpaper-image').get_attribute('src')!=image
  quote=page.locator('#home .quote').inner_text();image=page.locator('#home .wallpaper-image').get_attribute('src')
 page.locator('#menu').click();page.locator('[data-settings="favorites"]').click()
 expect(page.locator('.favorite-item')).to_have_count(1)
 assert page.locator('.favorite-item .quote').inner_text()=='My custom words for this visit.'
 page.locator('.favorite-restore').click()
 assert page.locator('#home .quote').inner_text()=='My custom words for this visit.'
 assert page.locator('[data-align="right"]').get_attribute('aria-pressed')=='true'
 # Simulate BFCache lifecycle without a fresh document; a duplicate resume must not refresh twice.
 page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));")
 assert page.locator('#home .quote').inner_text()!='My custom words for this visit.'
 resumed=page.locator('#home .quote').inner_text()
 page.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));")
 assert page.locator('#home .quote').inner_text()==resumed
 # A restored state in a fresh browser context still preserves favorites and locale.
 state=json.load(open('/tmp/motivation-fresh-state.json'))
 restored=b.new_context(storage_state=state);other=restored.new_page();other.goto('http://127.0.0.1:8080',wait_until='networkidle')
 assert other.locator('html').get_attribute('lang')=='fr'
 assert other.locator('#home .quote').inner_text()!='My custom words for this visit.'
 assert not errors,errors
 print('PASS: new tab/reload/BFCache show fresh quote and artwork; internal edits, saved favorites and language survive correctly.')
 b.close()
