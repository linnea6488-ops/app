'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const translations = window.MotivationI18n;
  let language = 'en';
  try { const saved = localStorage.getItem('motivation.language'); if (translations.codes.includes(saved)) language = saved; } catch {}
  function t(message) { const index = translations.codes.indexOf(language) - 1; return index < 0 ? message : translations.messages[message]?.[index] || message; }
  const staticTexts = [], staticAttributes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, base = node.textContent.trim();
    if (base && !node.parentElement.closest('script,style,svg,.wallpaper,.brand') && translations.messages[base]) staticTexts.push({node, base});
  }
  $$('[aria-label],[placeholder]').forEach(node => ['aria-label','placeholder'].forEach(attribute => { if (node.hasAttribute(attribute)) staticAttributes.push({node,attribute,base:node.getAttribute(attribute)}); }));
  function translateUI() {
    document.documentElement.lang = language;
    staticTexts.forEach(({node,base}) => node.textContent = t(base));
    staticAttributes.forEach(({node,attribute,base}) => node.setAttribute(attribute,t(base)));
    $('#current-language').textContent = translations.names[translations.codes.indexOf(language)];
    $$('[data-language]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.language === language)));
    localizeCurrentIdea(); syncFields(); renderIdeas(); normalizeDesign(); persist(); renderRoute(false); setExpanded(expanded);
  }
  const key = 'motivation.design.v3';
  const defaults = {quote:'Let the quiet bring you back to yourself.',source:'',align:'center',background:0};
  let previousDesign = null, lastHome = null;
  let design = {...defaults}, favorites = [], category = 'Recommended', expanded = false, returnFocus, timer, saveTimer;
  const editor = $('#editor'), sheet = $('#sheet');
  const backgrounds = $$('.image-option img').map(img => img.getAttribute('src'));
  function valid(d) { return d && typeof d.quote === 'string' && typeof d.source === 'string' && ['left','center','right'].includes(d.align) && Number.isInteger(d.background) && d.background >= 0 && d.background < backgrounds.length; }
  function storageError(message) { $('#storage-error').hidden = false; $('#storage-error').textContent = t(message); }
  try {
    const raw = localStorage.getItem(key);
    if (raw) { const saved = JSON.parse(raw); if (!valid(saved.design) || !Array.isArray(saved.favorites) || !saved.favorites.every(valid)) throw Error('Invalid saved data'); previousDesign = saved.design; favorites = saved.favorites;
      if (saved.lastHome && typeof saved.lastHome.quote === 'string' && Number.isInteger(saved.lastHome.background)) lastHome = saved.lastHome; }
  } catch { storageError('Your saved design couldn’t be restored on this device.'); }
  const signature = d => JSON.stringify([d.quote,d.source,d.align,d.background]);
  function persist() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(key, JSON.stringify({design,favorites,lastHome})); $('#storage-error').hidden = true; return true; }
    catch { storageError('Your changes couldn’t be saved on this device.'); return false; }
  }
  let lastToast = '';
  function toast(message, kind = 'info') {
    const text = t(message), state = kind + ':' + text;
    if (lastToast === state && $('#toast').classList.contains('visible')) return;
    clearTimeout(timer); lastToast = state;
    $('#toast-message').textContent = text;
    $('#toast-icon').src = $('#toast-icon').dataset[kind === 'success' ? 'success' : 'info'];
    $('#toast').dataset.kind = kind;
    $('#toast').classList.add('visible');
    timer = setTimeout(() => $('#toast').classList.remove('visible'), 3000);
  }
  function showTextLimit() {
    $('#text-limit').hidden = false;
    toast('Text limit reached. Remove some text to continue.');
  }
  function paint(wallpaper, value) {
    const image = wallpaper.querySelector('.wallpaper-image');
    if (image.getAttribute('src') !== backgrounds[value.background]) image.src = backgrounds[value.background];
    wallpaper.querySelector('.quote').textContent = value.quote;
    wallpaper.querySelector('.source').textContent = value.source;
    wallpaper.querySelector('.wallpaper-copy').style.textAlign = value.align;
  }
  function render() {
    $$('#home .wallpaper, #preview-close .wallpaper').forEach(el => paint(el, design));
    $('#entry-image').src = backgrounds[design.background];
    $('#favorites-count').textContent = favorites.length;
    const isFavorite = favorites.some(d => signature(d) === signature(design));
    $('#favorite').setAttribute('aria-pressed', String(isFavorite));
    $('#favorite').setAttribute('aria-label', t(isFavorite ? 'Remove from favorites' : 'Add to favorites'));
    $$('[data-background]').forEach(el => el.setAttribute('aria-pressed',String(+el.dataset.background === design.background)));
    $$('[data-align]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.align === design.align)));
    $$('.idea').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.quote === design.quote && el.dataset.source === design.source)));
  }
  function syncFields() { $('#quote-input').value = design.quote; $('#source-input').value = design.source; }
  function changeTab(tab, focus = false) {
    $$('[data-tab]').forEach(el => { const active = el.dataset.tab === tab; el.setAttribute('aria-selected',String(active)); el.tabIndex = active ? 0 : -1; $('#panel-'+el.dataset.tab).hidden = !active; });
    $('#sheet-content').scrollTop = 0;
    if (focus) $('#tab-'+tab).focus();
  }
  function setExpanded(value) { expanded=value; sheet.style.height=''; sheet.classList.toggle('expanded',value); $('#handle').setAttribute('aria-expanded',String(value)); $('#handle').setAttribute('aria-label',t(value ? 'Close editor and return home' : 'Expand editor')); }
  let motionId = 0, motionClone = null, activeAnimations = [];
  function clearMotion() {
    motionId++;
    activeAnimations.forEach(animation => animation.cancel()); activeAnimations=[];
    motionClone?.remove(); motionClone=null;
    $('#preview-close .wallpaper').style.visibility='';
    editor.classList.remove('is-transitioning');
  }
  function transitionEditor(opening, done) {
    clearMotion();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !sheet.animate) { done(); return; }
    const id=motionId;
    const home=$('#home .wallpaper'), mini=$('#preview-close .wallpaper');
    const full=home.getBoundingClientRect(), small=mini.getBoundingClientRect();
    if (!full.width || !small.width) { done(); return; }
    const clone=home.cloneNode(true); clone.classList.add('transition-wallpaper'); clone.setAttribute('aria-hidden','true'); clone.inert=true;
    Object.assign(clone.style,{left:full.left+'px',top:full.top+'px',width:full.width+'px',height:full.height+'px'});
    editor.append(clone); motionClone=clone; mini.style.visibility='hidden'; editor.classList.add('is-transitioning');
    const miniature='translate('+(small.left-full.left)+'px,'+(small.top-full.top)+'px) scale('+(small.width/full.width)+')';
    const options={duration:360,easing:'cubic-bezier(0.22,1,0.36,1)',fill:'both'};
    activeAnimations=[
      clone.animate([{transform:opening?'none':miniature},{transform:opening?miniature:'none'}],options),
      sheet.animate([{transform:opening?'translateY(100%)':'translateY(0)'},{transform:opening?'translateY(0)':'translateY(100%)'}],options)
    ];
    Promise.all(activeAnimations.map(animation => animation.finished.catch(()=>{}))).then(() => {
      if (motionId!==id) return;
      clearMotion(); done();
    });
  }
  function close(animate = true) {
    if (editor.hidden) return;
    if (editor.contains(document.activeElement)) document.activeElement.blur();
    const finish=() => { editor.hidden=true; document.body.classList.remove('editing'); $('#home').inert=false; $('.header').inert=false; document.body.style.overflow=''; persist(); returnFocus?.focus(); };
    if (animate === false) { clearMotion(); finish(); } else transitionEditor(false,finish);
  }
  $$('[data-open]').forEach(el => el.addEventListener('click',() => {
    returnFocus=el; syncFields(); changeTab(el.dataset.open); setExpanded(false); editor.hidden=false;
    document.body.classList.add('editing'); $('#home').inert=true; $('.header').inert=true; document.body.style.overflow='hidden';
    // Keep initial focus on the neutral dialog during the user gesture, not on a tab.
    // Intentional keyboard arrow navigation can still focus the tabs afterwards.
    editor.tabIndex=-1; editor.focus({preventScroll:true});
    transitionEditor(true,() => {});
  }));
  $('#brand').addEventListener('click',() => window.scrollTo({top:0,behavior:'smooth'}));
  $('#preview-close').addEventListener('click',close);
  $('#menu').addEventListener('click',() => navigate('settings'));
  $('#save').addEventListener('click',() => toast('Saving images isn’t enabled in this demo yet.'));
  $('#share').addEventListener('click',() => toast('System sharing isn’t enabled in this demo yet.'));
  $('#favorite').addEventListener('click',() => {
    const previous=favorites.slice(); const index=favorites.findIndex(d => signature(d) === signature(design));
    if (index < 0) favorites.push({...design}); else favorites.splice(index,1);
    if (!persist()) { favorites=previous; toast('Your favorite couldn’t be saved on this device.'); }
    else toast(index < 0 ? 'Added to favorites' : 'Removed from favorites','success');
    render();
  });
  $$('[data-background]').forEach(el => el.addEventListener('click',() => { design.background=+el.dataset.background; render(); persist(); }));
  $$('[data-align]').forEach(el => el.addEventListener('click',() => { design.align=el.dataset.align; render(); persist(); }));
  // Measure at the original 342px reference width: layout scales with container width.
  const measure = $('#home .wallpaper').cloneNode(true);
  measure.classList.add('fit-measure'); measure.setAttribute('aria-hidden','true'); measure.inert = true;
  measure.querySelector('img').remove(); document.body.append(measure);
  function fits(value) {
    measure.querySelector('.quote').textContent = value.quote;
    measure.querySelector('.source').textContent = value.source;
    const copy = measure.querySelector('.wallpaper-copy');
    const children = [...copy.children].filter(el => getComputedStyle(el).display !== 'none');
    const height = children.reduce((sum,el) => { const style = getComputedStyle(el); return sum + el.getBoundingClientRect().height + parseFloat(style.marginTop) + parseFloat(style.marginBottom); },0);
    return height <= copy.clientHeight - 1;
  }
  function characters(value) {
    return typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(value)].map(part => part.segment) : Array.from(value);
  }
  function fittingInsertion(property, candidate) {
    const oldChars=characters(design[property]), newChars=characters(candidate);
    let left=0,right=0;
    while(left<oldChars.length && left<newChars.length && oldChars[left]===newChars[left]) left++;
    while(right<oldChars.length-left && right<newChars.length-left && oldChars[oldChars.length-1-right]===newChars[newChars.length-1-right]) right++;
    const previous=design[property], prefix=newChars.slice(0,left).join(''), suffix=right ? newChars.slice(-right).join('') : '';
    const added=newChars.slice(left,right ? -right : undefined);
    let low = 0, high = added.length;
    while (low < high) {
      const middle = Math.ceil((low+high)/2);
      if (fits({...design,[property]:prefix+added.slice(0,middle).join('')+suffix})) low=middle; else high=middle-1;
    }
    const accepted = prefix+added.slice(0,low).join('')+suffix;
    return fits({...design,[property]:accepted}) ? accepted : previous;
  }
  function commitInput(property,field) {
    const candidate = field.value, accepted = fits({...design,[property]:candidate}) ? candidate : fittingInsertion(property,candidate);
    $('#text-limit').hidden = accepted === candidate;
    if (accepted !== candidate) showTextLimit();
    if (accepted !== candidate) { const cursor = field.selectionStart; field.value = accepted; field.setSelectionRange(Math.min(cursor,accepted.length),Math.min(cursor,accepted.length)); }
    if (accepted !== design[property]) {
      if (property==='quote') delete design.ideaId;
      if (property==='source') design.sourceIsBuiltIn=false;
    }
    design[property]=accepted; render(); clearTimeout(saveTimer); saveTimer=setTimeout(persist,200);
  }
  [['quote','quote-input'],['source','source-input']].forEach(([property,id]) => {
    const field = $('#'+id);
    field.addEventListener('beforeinput',event => {
      if (event.isComposing || !event.inputType.startsWith('insert') || event.data === null) return;
      const candidate = field.value.slice(0,field.selectionStart)+event.data+field.value.slice(field.selectionEnd);
      if (!fits({...design,[property]:candidate})) {
        event.preventDefault(); field.value=fittingInsertion(property,candidate); commitInput(property,field); showTextLimit();
      }
    });
    field.addEventListener('input',event => { if (!event.isComposing) commitInput(property,field); });
    field.addEventListener('compositionend',() => commitInput(property,field));
  });
  function normalizeDesign() {
    let changed = false;
    if (!fits({...design,quote:''})) {
      const chars=characters(design.source); let low=0,high=chars.length;
      while(low<high) { const mid=Math.ceil((low+high)/2); if(fits({...design,quote:'',source:chars.slice(0,mid).join('')})) low=mid; else high=mid-1; }
      design.source=chars.slice(0,low).join(''); changed=true;
    }
    if (!fits(design)) {
      const chars=characters(design.quote); let low=0,high=chars.length;
      while(low<high) { const mid=Math.ceil((low+high)/2); if(fits({...design,quote:chars.slice(0,mid).join('')})) low=mid; else high=mid-1; }
      design.quote=chars.slice(0,low).join(''); changed=true;
    }
    if (changed) { syncFields(); render(); persist(); toast('Text limit reached. Remove some text to continue.'); }
  }
  document.fonts.ready.then(normalizeDesign);

  $$('[data-tab]').forEach(el => el.addEventListener('click',() => changeTab(el.dataset.tab)));
  $('.tabs').addEventListener('keydown',event => {
    const tabs=$$('[data-tab]'); let index=tabs.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); index=event.key==='Home' ? 0 : event.key==='End' ? 2 : (index+(event.key==='ArrowRight' ? 1 : 2))%3; changeTab(tabs[index].dataset.tab,true);
  });
  // Original AI-written demo content, not quotations attributed to real people.
  const ideas=[
  {
    "quote": "Let the quiet bring you back to yourself.",
    "source": "AI original",
    "category": "Philosophy",
    "id": "idea-0"
  },
  {
    "quote": "Not every question needs an answer tonight.",
    "source": "AI original",
    "category": "Philosophy",
    "id": "idea-1"
  },
  {
    "quote": "Some things become clear only when we stop chasing them.",
    "source": "AI original",
    "category": "Philosophy",
    "id": "idea-2"
  },
  {
    "quote": "A small beginning is still a beginning.",
    "source": "AI original",
    "category": "Motivation",
    "id": "idea-3"
  },
  {
    "quote": "You can move forward without having the whole map.",
    "source": "AI original",
    "category": "Motivation",
    "id": "idea-4"
  },
  {
    "quote": "Take the next kind step. Then take another.",
    "source": "AI original",
    "category": "Motivation",
    "id": "idea-5"
  },
  {
    "quote": "Love can be quiet and still fill a room.",
    "source": "AI original",
    "category": "Love",
    "id": "idea-6"
  },
  {
    "quote": "May we make room for each other to become.",
    "source": "AI original",
    "category": "Love",
    "id": "idea-7"
  },
  {
    "quote": "Some hearts feel like a light left on.",
    "source": "AI original",
    "category": "Love",
    "id": "idea-8"
  },
  {
    "quote": "Home is made in the ways we care.",
    "source": "AI original",
    "category": "Family",
    "id": "idea-9"
  },
  {
    "quote": "The ordinary days are part of what we keep.",
    "source": "AI original",
    "category": "Family",
    "id": "idea-10"
  },
  {
    "quote": "May there always be a place for you at the table.",
    "source": "AI original",
    "category": "Family",
    "id": "idea-11"
  }
];
  function localizedIdea(idea) { return {...idea,quote:t(idea.quote),source:t(idea.source)}; }
  function localizeCurrentIdea() {
    const idea=ideas.find(item => item.id===design.ideaId);
    if (!idea) return;
    const translated=localizedIdea(idea);
    design.quote=translated.quote;
    if (design.sourceIsBuiltIn) design.source=translated.source;
  }
  function freshDesign(previous = previousDesign) {
    const quoteChoices = ideas.filter(idea => idea.id !== previous?.ideaId && idea.id !== lastHome?.ideaId && localizedIdea(idea).quote !== previous?.quote && localizedIdea(idea).quote !== lastHome?.quote);
    const imageChoices = backgrounds.map((_,index) => index).filter(index => index !== previous?.background && index !== lastHome?.background);
    const quotes = quoteChoices.length ? quoteChoices : ideas;
    const images = imageChoices.length ? imageChoices : backgrounds.map((_,index) => index);
    const idea = localizedIdea(quotes[Math.floor(Math.random() * quotes.length)]);
    const background = images[Math.floor(Math.random() * images.length)];
    design = {...defaults, quote:idea.quote, source:'', ideaId:idea.id, sourceIsBuiltIn:false, background};
    lastHome = {quote:idea.quote, ideaId:idea.id, background};
    category = 'Recommended';
  }
  function renderIdeas() {
    $('#ideas-grid').replaceChildren();
    const filtered=ideas.filter(idea => category==='Recommended' || idea.category===category);
    $('#ideas-empty').hidden=filtered.length>0;
    const columns=[document.createElement('div'),document.createElement('div')];
    columns.forEach(el => {el.className='idea-column';$('#ideas-grid').append(el);});
    filtered.forEach((base,index) => {
      const idea=localizedIdea(base);
      const button=document.createElement('button'); button.type='button'; button.className='idea'; button.dataset.quote=idea.quote; button.dataset.source=''; button.dataset.ideaId=idea.id;
      const text=document.createElement('span'); text.textContent=idea.quote;
      const source=document.createElement('span'); source.className='idea-source'; source.textContent=idea.source;
      button.append(text,source); button.addEventListener('click',() => { design.quote=idea.quote; design.source=''; design.ideaId=idea.id; design.sourceIsBuiltIn=false; syncFields(); render(); persist(); });
      columns[index%2].append(button);
    });
    $$('[data-category]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.category===category))); render();
  }
  $$('[data-category]').forEach(el => el.addEventListener('click',() => { category=el.dataset.category; renderIdeas(); }));
  function navigate(page = '') {
    window.history.pushState(null, '', page ? '#' + page : window.location.pathname + window.location.search);
    renderRoute();
  }
  function renderFavorites() {
    const grid = $('#favorites-grid');
    grid.replaceChildren();
    $('#favorites-empty').hidden = favorites.length > 0;
    favorites.forEach((saved, index) => {
      const item = document.createElement('div'); item.className = 'favorite-item';
      const restore = document.createElement('button'); restore.type = 'button'; restore.className = 'favorite-restore';
      restore.setAttribute('aria-label', t('Use wallpaper') + ': ' + saved.quote);
      const wallpaper = $('#home .wallpaper').cloneNode(true);
      paint(wallpaper, saved); restore.append(wallpaper);
      restore.addEventListener('click', () => { design = {...saved}; normalizeDesign(); syncFields(); render(); persist(); navigate(); });
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'favorite-remove'; remove.textContent = t('Remove');
      remove.setAttribute('aria-label', t('Remove wallpaper') + ': ' + saved.quote);
      remove.addEventListener('click', () => {
        const previous = favorites.slice(); favorites.splice(index, 1);
        if (!persist()) { favorites = previous; toast('Your favorite couldn’t be removed on this device.'); return; }
        render(); renderFavorites(); toast('Removed from favorites','success');
        (grid.querySelector('.favorite-remove') || $('#detail-title')).focus();
      });
      item.append(restore, remove); grid.append(item);
    });
  }
  function renderRoute(focus = true) {
    const page = window.location.hash.slice(1);
    const detail = ['favorites', 'language', 'feedback', 'privacy'].includes(page);
    const settings = page === 'settings';
    $('#home').hidden = settings || detail;
    $('.header').hidden = settings || detail;
    $('#settings').hidden = !settings;
    $('#settings-detail').hidden = !detail;
    $$('.detail-panel').forEach(el => { el.hidden = el.id !== 'detail-' + page; });
    if (detail) {
      const titles = {favorites:'Favorites', language:'Language', feedback:'Feedback', privacy:'Privacy Policy'};
      $('#detail-title').textContent = t(titles[page]);
      if (page === 'favorites') renderFavorites();
    }
    const heading = detail ? $('#detail-title') : settings ? $('#settings-title') : $('#brand');
    heading.tabIndex = -1;
    if (focus) { window.scrollTo(0, 0); heading.focus({preventScroll:true}); }
  }
  $$('[data-settings]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.settings)));
  $('#settings-back').addEventListener('click', () => navigate());
  $('#detail-back').addEventListener('click', () => navigate('settings'));
  $('#favorites-home').addEventListener('click', () => navigate());
  translations.codes.forEach((code,index) => {
    const button=document.createElement('button'); button.type='button'; button.className='settings-row'; button.dataset.language=code;
    if(code==='en') button.id='english-language';
    const label=document.createElement('span'); label.textContent=translations.names[index]; label.lang=code;
    const check=document.createElement('span'); check.className='language-check'; check.setAttribute('aria-hidden','true'); check.textContent='✓';
    button.append(label,check); button.addEventListener('click',() => {
      language=code; translateUI();
      try { localStorage.setItem('motivation.language',code); toast('Language updated','success'); }
      catch { toast('Your language preference couldn’t be saved on this device.'); }
      button.focus();
    }); $('#language-options').append(button);
  });
  $('#copy-feedback').addEventListener('click', async () => {
    const field = $('#feedback-input'), status = $('#feedback-status');
    if (!field.value.trim()) { status.textContent = t('Please enter your feedback first.'); field.focus(); return; }
    try {
      if (!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(field.value);
      status.textContent = t('Feedback copied. It has not been sent.');
      toast('Feedback copied. It has not been sent.','success');
    } catch { field.focus(); field.select(); status.textContent = t('Copy isn’t available here. Select and copy your message manually.'); }
  });
  window.addEventListener('hashchange', () => renderRoute());
  window.addEventListener('popstate', () => renderRoute());
  let drag=null, suppressClick=false;
  $('#handle').addEventListener('click',() => { if (suppressClick) { suppressClick=false; return; } if (expanded) close(); else setExpanded(true); });
  $('#handle').addEventListener('pointerdown',event => { if (event.button!==0) return; suppressClick=false; drag={y:event.clientY,height:sheet.getBoundingClientRect().height,expanded}; event.currentTarget.setPointerCapture(event.pointerId); });
  $('#handle').addEventListener('pointermove',event => {
    if (!drag) return; const dy=event.clientY-drag.y;
    if (Math.abs(dy)>8) { suppressClick=true; sheet.classList.add('dragging'); const max=editor.clientHeight-parseFloat(getComputedStyle($('.app')).paddingTop)-20; sheet.style.height=Math.max(120,Math.min(max,drag.height-dy))+'px'; }
  });
  $('#handle').addEventListener('pointerup',event => {
    if (!drag) return; const dy=event.clientY-drag.y, wasExpanded=drag.expanded; drag=null; sheet.classList.remove('dragging');
    if (!suppressClick) return;
    if (dy > (wasExpanded ? 50 : 70)) { close(); return; }
    setExpanded(dy < -50 ? true : wasExpanded);
  });
  $('#handle').addEventListener('pointercancel',() => { drag=null; suppressClick=false; sheet.classList.remove('dragging'); setExpanded(expanded); });
  document.addEventListener('keydown',event => {
    if (editor.hidden) return;
    if (event.key==='Escape') { event.preventDefault(); close(); }
    if (event.key==='Tab') {
      const items=[...editor.querySelectorAll('button,textarea,[tabindex="0"]')].filter(el => !el.disabled && el.tabIndex>=0 && el.getClientRects().length);
      const first=items[0], last=items.at(-1);
      if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
    }
  });
  function viewport() { if (window.visualViewport) { editor.style.setProperty('--editor-height',window.visualViewport.height+'px'); editor.style.top=window.visualViewport.offsetTop+'px'; } }
  window.visualViewport?.addEventListener('resize',viewport); window.visualViewport?.addEventListener('scroll',viewport); viewport();
  document.addEventListener('focusin',event => {
    if (event.target.matches('#quote-input,#source-input') && !editor.hidden) setExpanded(true);
    if (event.target.matches('textarea')) setTimeout(() => {
      if (document.activeElement===event.target) event.target.scrollIntoView({block:'nearest'});
    },100);
  });
  let needsFreshHome = false;
  function resumeHome() {
    if (!needsFreshHome || document.visibilityState === 'hidden') return;
    needsFreshHome = false;
    const previous = {...design};
    close(false);
    freshDesign(previous); syncFields(); renderIdeas(); render(); persist();
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    renderRoute(false);
    $('#text-limit').hidden = true;
    clearTimeout(timer); $('#toast').classList.remove('visible');
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { persist(); needsFreshHome = true; }
    else resumeHome();
  });
  window.addEventListener('pagehide', () => { persist(); needsFreshHome = true; });
  window.addEventListener('pageshow', event => { if (event.persisted) resumeHome(); });
  freshDesign(); persist();
  syncFields(); renderIdeas(); render(); renderRoute(false); translateUI();
})();
