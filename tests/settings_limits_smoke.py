from playwright.sync_api import sync_playwright, expect
from pathlib import Path
Path('/tmp/motivation-review').mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8080',wait_until='networkidle')
 page.locator('#menu').click();page.locator('[data-settings="language"]').click()
 expect(page.locator('[data-language]')).to_have_count(8)
 for code in ['en','zh-Hant','fr','de','it','nl','ko','ja']:
  page.locator('[data-language="'+code+'"]').click()
  assert page.locator('html').get_attribute('lang')==code
  assert page.locator('[data-language="'+code+'"]').get_attribute('aria-pressed')=='true'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.reload(wait_until='networkidle')
  assert page.locator('html').get_attribute('lang')==code
 page.locator('[data-language="en"]').click();page.locator('#detail-back').click()
 page.locator('[data-settings="privacy"]').click()
 assert page.locator('#detail-privacy').inner_text().find('GitHub Pages')>=0
 assert 'Demo 0.1' in page.locator('#detail-privacy').inner_text()
 page.screenshot(path='/tmp/motivation-review/privacy.png')
 page.locator('#detail-back').click();page.locator('[data-settings="feedback"]').click()
 assert page.locator('.demo-email').inner_text()=='feedback@motivation.example'
 assert 'does not receive' in page.locator('#feedback-note').inner_text()
 page.locator('#feedback-input').fill('Demo feedback')
 page.evaluate("Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:async(value)=>{window.copied=value}}})")
 page.locator('#copy-feedback').click()
 expect(page.locator('#feedback-status')).to_have_text('Feedback copied. It has not been sent.')
 assert page.evaluate('window.copied')=='Demo feedback'
 page.screenshot(path='/tmp/motivation-review/feedback.png')
 page.locator('#detail-back').click();page.locator('#settings-back').click()
 page.locator('[data-open="type"]').click()
 page.locator('#source-input').fill('Writer')
 page.locator('#quote-input').fill('A calmer mind brings a brighter life. '*100)
 accepted=page.locator('#quote-input').input_value()
 assert 0<len(accepted)<1000
 expect(page.locator('#text-limit')).to_be_visible()
 # Canonical composition must fit without a scrollbar or reduced font size.
 def fits():
  return page.locator('.fit-measure .wallpaper-copy').evaluate('''el=>[...el.children].filter(x=>getComputedStyle(x).display!=='none').reduce((sum,x)=>sum+x.getBoundingClientRect().height+parseFloat(getComputedStyle(x).marginTop)+parseFloat(getComputedStyle(x).marginBottom),0)<=el.clientHeight''')
 assert fits()
 page.locator('#quote-input').press('End')
 page.keyboard.insert_text(' MORE WORDS '*100)
 assert len(page.locator('#quote-input').input_value())<1000
 assert fits()
 page.screenshot(path='/tmp/motivation-review/text-limit.png')
 for value in ['你好。'*300,'静かな夜。'*300,'조용한 밤. '*300,'🌙✨🍃 '*300,'line\n'*300]:
  page.locator('#quote-input').fill(value)
  assert page.locator('#quote-input').input_value()!=value
  assert fits()
 # Selection replacement preserves an existing suffix instead of discarding it.
 page.locator('#quote-input').fill('Keep this ending.')
 page.locator('#quote-input').evaluate('(el)=>el.setSelectionRange(0,0)')
 page.keyboard.insert_text('A long introduction. '*100)
 assert page.locator('#quote-input').input_value().endswith('Keep this ending.')
 # IME commits are measured after composition; incomplete composition is not blocked.
 page.locator('#quote-input').fill('')
 page.locator('#quote-input').evaluate('''el=>{el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='静かな夜。'.repeat(300);el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));}''')
 assert fits()
 page.locator('#source-input').fill('Source '*500)
 assert fits()
 page.keyboard.press('Escape')
 page.wait_for_timeout(250);page.reload(wait_until='networkidle')
 for width in [320,375,390,430]:
  page.set_viewport_size({'width':width,'height':844})
  geometry=page.locator('#home .wallpaper').evaluate('''el=>{const card=el.getBoundingClientRect(),copy=el.querySelector('.wallpaper-copy').getBoundingClientRect(),quote=el.querySelector('.quote').getBoundingClientRect(),source=el.querySelector('.source').getBoundingClientRect();return {top:copy.top-card.top,left:copy.left-card.left,right:card.right-copy.right,quoteTop:quote.top,copyTop:copy.top,sourceBottom:source.bottom,copyBottom:copy.bottom,width:card.width}}''')
  unit=geometry['width']/342
  assert abs(geometry['left']-24*unit)<1
  assert abs(geometry['right']-24*unit)<1
  assert geometry['quoteTop']>=geometry['copyTop']-1
  assert geometry['sourceBottom']<=geometry['copyBottom']+1,geometry
 assert errors==[],errors
 print('PASS: 8 persisted languages; truthful feedback; privacy; fixed-size text limits for paste, Unicode, IME, source and 320–430px layouts.')
 b.close()
