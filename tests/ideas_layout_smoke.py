from playwright.sync_api import sync_playwright, expect
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8080',wait_until='networkidle')
 page.locator('[data-open="ideas"]').click()
 page.locator('[data-category="Family"]').click()
 page.locator('.idea').first.click()
 assert page.locator('#home .quote').text_content()=='Home is made in the ways we care.'
 page.locator('#tab-type').click()
 assert page.locator('#quote-input').input_value()==''
 assert '\n' not in page.locator('#quote-input').input_value()
 assert page.locator('#source-input').input_value()==''
 assert page.locator('#source-input').get_attribute('placeholder')=='Add your custom text / quote'
 assert page.locator('#source-input').evaluate('(el)=>getComputedStyle(el,"::placeholder").color')=='rgb(196, 191, 186)'
 page.screenshot(path='/tmp/motivation-review/type-placeholder.png')
 page.locator('#source-input').fill('My source')
 page.keyboard.press('Escape')
 expected={
  'zh-Hant':'家，藏在我們照顧彼此的方式裡。',
  'fr':'Un foyer se construit dans l’attention que l’on se porte.',
  'de':'Zuhause entsteht dort, wo wir füreinander sorgen.',
  'it':'La casa nasce nei gesti con cui ci prendiamo cura l’uno dell’altro.',
  'nl':'Een thuis ontstaat in de zorg voor elkaar.',
  'ko':'집은 서로를 돌보는 마음으로 만들어져요.',
  'ja':'思いやりを重ねることで、家は居場所になる。'}
 for language,text in expected.items():
  page.locator('#menu').click();page.locator('[data-settings="language"]').click()
  page.locator('[data-language="'+language+'"]').click();page.locator('#detail-back').click();page.locator('#settings-back').click()
  assert page.locator('#home .quote').text_content()==text
  assert page.locator('#home .source').text_content()=='My source'
  page.locator('[data-open="ideas"]').click();page.locator('[data-category="Family"]').click()
  assert page.locator('.idea').first.locator('span').first.inner_text()==text
  page.keyboard.press('Escape')
 # Independently packed columns keep exactly 10px vertical gaps.
 page.locator('[data-open="ideas"]').click();page.locator('[data-category="Recommended"]').click();page.locator('#handle').click()
 page.wait_for_timeout(300)
 for column in page.locator('.idea-column').all():
  rects=[el.bounding_box() for el in column.locator('.idea').all()]
  for before,after in zip(rects,rects[1:]):assert abs(after['y']-before['y']-before['height']-10)<1
 page.locator('#tab-ideas').focus()
 assert page.locator('#tab-ideas').evaluate('(el)=>getComputedStyle(el).outlineWidth')=='0px'
 page.screenshot(path='/tmp/motivation-review/ideas-localized.png')
 page.locator('#tab-type').click();page.locator('#quote-input').fill('My own first line.\nMy own second line.')
 page.keyboard.press('Escape');page.locator('#menu').click();page.locator('[data-settings="language"]').click();page.locator('[data-language="en"]').click();page.locator('#detail-back').click();page.locator('#settings-back').click()
 assert page.locator('#home .quote').text_content()=='My own first line.\nMy own second line.'
 assert errors==[],errors
 print('PASS: 8-language built-in quote sync, preserved custom copy/source, natural input wrapping, built-in attribution and Source guidance, 10px masonry gaps and no tab focus box.')
 b.close()
