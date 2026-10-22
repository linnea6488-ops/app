from playwright.sync_api import sync_playwright, expect
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8080',wait_until='networkidle')
 expect(page.locator('[data-background]')).to_have_count(21)
 expect(page.locator('#share')).to_have_count(0)
 expect(page.locator('#home .source')).to_have_text('AI original')
 for _ in range(6):
  before=page.locator('#home .quote').text_content(),page.locator('#home .wallpaper-image').get_attribute('src')
  page.locator('#refresh').tap()
  after=page.locator('#home .quote').text_content(),page.locator('#home .wallpaper-image').get_attribute('src')
  assert before[0]!=after[0] and before[1]!=after[1]
  expect(page.locator('#home .source')).to_have_text('AI original')
 favorite=page.locator('#favorite').bounding_box();wall=page.locator('#home .wallpaper').bounding_box()
 assert abs(wall['x']+wall['width']-favorite['x']-favorite['width']-18)<1
 page.locator('#menu').tap();page.locator('[data-settings="favorites"]').tap()
 expect(page.locator('.favorites-empty-icon')).to_be_visible()
 assert page.locator('.favorites-empty-icon').evaluate('(el)=>el.complete && el.naturalWidth===480')
 assert page.locator('.empty-state h2').evaluate('(el)=>getComputedStyle(el).marginBottom')=='3px'
 page.locator('#detail-back').tap();page.locator('#settings-back').tap()

 assert page.get_by_text('Choose a background for your words.',exact=True).count()==0
 for width in [320,375,390,430]:
  page.set_viewport_size({'width':width,'height':844})
  assert page.locator('.header').evaluate('(el)=>getComputedStyle(el).marginBottom')=='8px'
  home=page.locator('#home .wallpaper').bounding_box()
  entries=page.locator('.entries').bounding_box()
  assert abs(entries['y']-(home['y']+home['height'])-18)<1
  for tab in ['image','type','ideas']:
   page.locator('[data-open="'+tab+'"]').tap();page.locator('#editor:not(.is-transitioning)').wait_for()
   mini=page.locator('#preview-close .wallpaper').bounding_box()
   assert abs(mini['y']-(24 if tab=='type' else home['y']))<1,(width,tab,home,mini)
   if tab=='type':
    assert page.locator('#quote-input').get_attribute('placeholder')==page.locator('#source-input').get_attribute('placeholder')
    page.locator('#quote-input').dispatch_event('pointerdown',{'pointerType':'touch','bubbles':True})
    expect(page.locator('#handle')).to_have_attribute('aria-expanded','true')
    page.locator('#source-input').tap();page.wait_for_timeout(280)
    assert abs(page.locator('#sheet').bounding_box()['y']-20)<1
   page.keyboard.press('Escape');expect(page.locator('#editor')).to_be_hidden()
 page.set_viewport_size({'width':390,'height':844})
 page.locator('[data-open="image"]').tap();page.locator('#editor:not(.is-transitioning)').wait_for()
 for index in range(12,21):
  page.locator('[data-background="'+str(index)+'"]').tap()
  page.wait_for_function('document.querySelector("#home .wallpaper-image").complete && document.querySelector("#home .wallpaper-image").naturalWidth===1024')
  assert page.locator('[data-background="'+str(index)+'"]').get_attribute('aria-pressed')=='true'
 page.locator('#handle').tap();page.wait_for_timeout(280)
 page.locator('#sheet-content').evaluate('(el)=>el.scrollTop=el.scrollHeight')
 page.screenshot(path='/tmp/motivation-review/new-backgrounds.png')
 assert errors==[],errors
 print('PASS: 21 backgrounds; all 9 new assets load; 18px home gap; matching preview top at 320–430px; identical placeholders; touch-down fully expands inputs.')
 browser.close()
