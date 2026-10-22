from playwright.sync_api import sync_playwright, expect
import json
from pathlib import Path
Path("/tmp/motivation-review").mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 # External fonts are optional at runtime; make local UI checks independent of egress.
 page.route('https://fonts.googleapis.com/**',lambda route:route.abort())
 page.goto('http://127.0.0.1:8080',wait_until='networkidle')
 for width in [320,375,390,430]:
  page.set_viewport_size({'width':width,'height':844})
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
  page.get_by_role('button',name='Typography',exact=True).click()
  assert page.locator('#quote-input').get_attribute('placeholder')=='Enter an author or source…'
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
  page.get_by_role('button',name='Close editor and return home',exact=True).click()
 page.set_viewport_size({'width':390,'height':844})
 assert page.locator('.app').evaluate('(el)=>parseFloat(getComputedStyle(el).paddingTop)')==0
 page.screenshot(path='/tmp/motivation-review/home.png',full_page=True)
 page.get_by_role('button',name='Typography',exact=True).click()
 quote='A quieter mind makes room for possibility.\nLet your words find their way, one gentle line at a time.'
 page.locator('#quote-input').fill(quote)
 page.locator('#source-input').fill('Your own words')
 page.get_by_role('button',name='Align left',exact=True).click()
 page.wait_for_timeout(300)
 assert page.locator('#handle').get_attribute('aria-expanded')=='true'
 page.screenshot(path='/tmp/motivation-review/type.png')
 for copy in page.locator('.wallpaper-copy').all():
  q=copy.locator('.quote').bounding_box();s=copy.locator('.source').bounding_box()
  if q and s: assert q['y']+q['height']<=s['y']
 page.keyboard.press('Escape')
 expect(page.locator('[data-open="type"]')).to_be_focused()
 page.wait_for_timeout(250)
 assert page.locator('#home .quote').inner_text()==quote
 page.locator('#favorite').click()
 assert page.locator('#favorite').get_attribute('aria-pressed')=='true'
 saved_quote=page.locator('#home .quote').inner_text()
 saved_image=page.locator('#home .wallpaper-image').get_attribute('src')
 page.reload(wait_until='networkidle')
 assert page.locator('#home .quote').inner_text()!=saved_quote
 assert page.locator('#home .wallpaper-image').get_attribute('src')!=saved_image
 assert page.locator('#favorite').get_attribute('aria-pressed')=='false'
 page.locator('[data-open="image"]').click()
 page.locator('[data-background="2"]').click()
 assert page.locator('[data-background="2"]').get_attribute('aria-pressed')=='true'
 page.screenshot(path='/tmp/motivation-review/image.png')
 page.get_by_role('tab',name='Ideas',exact=True).click()
 page.locator('[data-category="Motivation"]').click()
 assert page.locator('.idea').count()==3
 page.locator('.idea').first.click()
 assert page.locator('[data-background="2"]').get_attribute('aria-pressed')=='true'
 assert page.locator('[data-align="center"]').get_attribute('aria-pressed')=='true'
 page.get_by_role('button',name='Love',exact=True).click()
 assert page.locator('.idea').count()==3
 assert not page.locator('#ideas-empty').is_visible()
 page.get_by_role('button',name='Recommended',exact=True).click()
 page.screenshot(path='/tmp/motivation-review/ideas.png')
 # Real pointer drag to expand and collapse; content scrolling must not change snap state.
 handle=page.locator('#handle');box=handle.bounding_box();x=box['x']+box['width']/2;y=box['y']+22
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(x,y-150,steps=10);page.mouse.up();page.wait_for_timeout(300)
 assert handle.get_attribute('aria-expanded')=='true'
 page.get_by_role('tab',name='Image',exact=True).click()
 assert handle.get_attribute('aria-expanded')=='true'
 page.wait_for_timeout(300)
 assert abs(page.locator('#sheet').bounding_box()['y']-20)<1
 page.screenshot(path='/tmp/motivation-review/image-expanded.png')
 tabs_before=page.locator('.tabs').bounding_box()
 page.locator('#sheet-content').evaluate('(el)=>el.scrollTop=78')
 page.screenshot(path='/tmp/motivation-review/image-scrolled.png')
 assert page.locator('.tabs').bounding_box()['y']==tabs_before['y']
 page.locator('#sheet-content').evaluate('(el)=>el.scrollTop=250')
 assert handle.get_attribute('aria-expanded')=='true'
 # Verify keyboard trap at both edges.
 page.locator('#preview-close').focus();page.keyboard.press('Shift+Tab')
 assert page.evaluate('document.activeElement.closest("#editor")!==null')
 page.keyboard.press('Escape')
 assert errors==[],errors
 page.locator('#save').click()
 assert 'isn’t enabled in this demo' in page.locator('#toast').inner_text()
 # Clear both fields and verify placeholders stay out of preview.
 page.locator('[data-open="type"]').click();page.locator('#quote-input').fill('');page.locator('#source-input').fill('')
 assert page.locator('#home .quote').inner_text()==''
 assert page.locator('#quote-input').evaluate('(el)=>getComputedStyle(el).color')=='rgb(196, 191, 186)'
 assert page.locator('#quote-input').evaluate('(el)=>getComputedStyle(el, "::placeholder").color')=='rgb(196, 191, 186)'
 assert page.locator('#close-editor').count()==0
 assert page.locator('.ideas-label').count()==0
 page.screenshot(path='/tmp/motivation-review/empty-type.png')
 # Background geometry must remain aligned even inside the centered preview button.
 for wallpaper in page.locator('.wallpaper:not(.fit-measure)').all():
  rect=wallpaper.bounding_box();img=wallpaper.locator('img').bounding_box()
  if rect and img:
   assert abs(rect['x']-img['x'])<1 and abs(rect['y']-img['y'])<1
 page.keyboard.press('Escape')
 page.locator('[data-open="image"]').click()
 page.locator('#editor:not(.is-transitioning)').wait_for()
 box=page.locator('#handle').bounding_box();x=box['x']+65;y=box['y']+22
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(x,y+100,steps=8);page.mouse.up()
 expect(page.locator('#editor')).to_be_hidden()
 # Settings navigation, full-design favorites, language preference and truthful feedback.
 page.locator('#menu').click()
 page.locator('[data-settings="favorites"]').click()
 expect(page.locator('.favorite-item')).to_have_count(1)
 favorite_quote=page.locator('.favorite-item .quote').inner_text()
 assert favorite_quote==quote
 page.screenshot(path='/tmp/motivation-review/favorites.png')
 page.locator('.favorite-restore').click()
 assert page.locator('#home .quote').inner_text()==quote
 expect(page.locator('#editor')).to_be_hidden()
 page.locator('#menu').click()
 page.screenshot(path='/tmp/motivation-review/settings.png')
 page.locator('[data-settings="favorites"]').click()
 page.locator('.favorite-remove').click()
 assert page.locator('#favorites-empty').is_visible()
 page.reload(wait_until='networkidle')
 assert page.locator('#favorites-empty').is_visible()
 page.locator('#detail-back').click()
 page.locator('[data-settings="language"]').click()
 page.locator('#english-language').click()
 assert page.evaluate('localStorage.getItem("motivation.language")')=='en'
 page.locator('#detail-back').click()
 page.locator('[data-settings="feedback"]').click()
 page.locator('#copy-feedback').click()
 assert page.locator('#feedback-status').inner_text()=='Please enter your feedback first.'
 page.locator('#feedback-input').fill('The panel could feel smoother.')
 page.evaluate("Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:()=>Promise.reject(new Error('denied'))}})")
 page.locator('#copy-feedback').click()
 assert 'manually' in page.locator('#feedback-status').inner_text()
 page.locator('#detail-back').click()
 page.locator('#settings-back').click()
 expect(page.locator('#home')).to_be_visible()
 assert not errors, errors
 # A denied storage write must not claim that a favorite was persisted.
 denied=browser.new_page(viewport={'width':390,'height':844})
 denied.add_init_script("Storage.prototype.setItem = function(){throw new DOMException('denied','SecurityError')}")
 denied.goto('http://127.0.0.1:8080',wait_until='networkidle')
 denied.locator('#favorite').click()
 assert denied.locator('#favorite').get_attribute('aria-pressed')=='false'
 assert denied.locator('#storage-error').is_visible()
 assert 'couldn’t be saved' in denied.locator('#toast').inner_text()
 denied.close()
 print(json.dumps({'result':'passed','widths':[320,375,390,430],'checks':['layout overflow','placeholder copy','long quote attribution','fresh inspiration on reload','full-design favorite persistence','background selection','idea filtering and retained layout','populated AI quote categories','pointer drag','tab snap preservation','focus return and trap','truthful export status','empty preview','background geometry','downward dismiss','storage failure rollback','no simulated status gap','expanded sheet top','sticky tabs','specified placeholder and entered text color','no close icon or AI heading','settings navigation','favorite restore and removal','language preference','feedback failure handling'],'pageErrors':errors}))
 browser.close()
