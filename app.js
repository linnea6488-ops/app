'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const key = 'motivation.design.v3';
  const defaults = {quote:'Let the quiet\nbring you back to yourself.',source:'AI original',align:'center',background:0};
  let design = {...defaults}, favorites = [], category = 'Recommended', expanded = false, returnFocus, timer, saveTimer;
  const editor = $('#editor'), sheet = $('#sheet');
  const backgrounds = $$('.image-option img').map(img => img.getAttribute('src'));
  function valid(d) { return d && typeof d.quote === 'string' && typeof d.source === 'string' && ['left','center','right'].includes(d.align) && Number.isInteger(d.background) && d.background >= 0 && d.background < backgrounds.length; }
  function storageError(message) { $('#storage-error').hidden = false; $('#storage-error').textContent = message; }
  try {
    const raw = localStorage.getItem(key);
    if (raw) { const saved = JSON.parse(raw); if (!valid(saved.design) || !Array.isArray(saved.favorites) || !saved.favorites.every(valid)) throw Error('Invalid saved data'); design = saved.design; favorites = saved.favorites; }
  } catch { storageError('Your saved design couldn’t be restored on this device.'); }
  const signature = d => JSON.stringify([d.quote,d.source,d.align,d.background]);
  function persist() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(key, JSON.stringify({design,favorites})); $('#storage-error').hidden = true; return true; }
    catch { storageError('Your changes couldn’t be saved on this device.'); return false; }
  }
  function toast(message) { clearTimeout(timer); $('#toast').textContent = message; $('#toast').classList.add('visible'); timer = setTimeout(() => $('#toast').classList.remove('visible'),3000); }
  function render() {
    $$('.wallpaper-image').forEach(img => { if (img.getAttribute('src') !== backgrounds[design.background]) img.src = backgrounds[design.background]; });
    $$('.quote').forEach(el => el.textContent = design.quote);
    $$('.source').forEach(el => el.textContent = design.source);
    $$('.wallpaper-copy').forEach(el => el.style.textAlign = design.align);
    $('#entry-image').src = backgrounds[design.background];
    const isFavorite = favorites.some(d => signature(d) === signature(design));
    $('#favorite').setAttribute('aria-pressed', String(isFavorite));
    $('#favorite').setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
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
  function setExpanded(value) { expanded=value; sheet.style.height=''; sheet.classList.toggle('expanded',value); $('#handle').setAttribute('aria-expanded',String(value)); $('#handle').setAttribute('aria-label',value ? 'Collapse editor' : 'Expand editor'); }
  function close() { if (editor.hidden) return; editor.hidden=true; document.body.classList.remove('editing'); $('#home').inert=false; $('.header').inert=false; document.body.style.overflow=''; persist(); returnFocus?.focus(); }
  $$('[data-open]').forEach(el => el.addEventListener('click',() => { returnFocus=el; syncFields(); changeTab(el.dataset.open); setExpanded(false); editor.hidden=false; document.body.classList.add('editing'); $('#home').inert=true; $('.header').inert=true; document.body.style.overflow='hidden'; $('#tab-'+el.dataset.open).focus(); }));
  $('#brand').addEventListener('click',() => window.scrollTo({top:0,behavior:'smooth'}));
  $('#preview-close').addEventListener('click',close);
  $('#menu').addEventListener('click',() => toast('Menu pages haven’t been added yet.'));
  $('#save').addEventListener('click',() => toast('Saving images isn’t enabled in this demo yet.'));
  $('#share').addEventListener('click',() => toast('System sharing isn’t enabled in this demo yet.'));
  $('#favorite').addEventListener('click',() => {
    const previous=favorites.slice(); const index=favorites.findIndex(d => signature(d) === signature(design));
    if (index < 0) favorites.push({...design}); else favorites.splice(index,1);
    if (!persist()) { favorites=previous; toast('Your favorite couldn’t be saved on this device.'); }
    else toast(index < 0 ? 'Added to favorites' : 'Removed from favorites');
    render();
  });
  $$('[data-background]').forEach(el => el.addEventListener('click',() => { design.background=+el.dataset.background; render(); persist(); }));
  $$('[data-align]').forEach(el => el.addEventListener('click',() => { design.align=el.dataset.align; render(); persist(); }));
  [['quote','quote-input'],['source','source-input']].forEach(([property,id]) => $('#'+id).addEventListener('input',event => { design[property]=event.target.value; render(); clearTimeout(saveTimer); saveTimer=setTimeout(persist,200); }));
  $$('[data-tab]').forEach(el => el.addEventListener('click',() => changeTab(el.dataset.tab)));
  $('.tabs').addEventListener('keydown',event => {
    const tabs=$$('[data-tab]'); let index=tabs.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); index=event.key==='Home' ? 0 : event.key==='End' ? 2 : (index+(event.key==='ArrowRight' ? 1 : 2))%3; changeTab(tabs[index].dataset.tab,true);
  });
  // Original AI-written demo content, not quotations attributed to real people.
  const ideas=[
  {
    "quote": "Let the quiet\nbring you back to yourself.",
    "source": "AI original",
    "category": "Philosophy"
  },
  {
    "quote": "Not every question\nneeds an answer tonight.",
    "source": "AI original",
    "category": "Philosophy"
  },
  {
    "quote": "Some things become clear\nonly when we stop chasing them.",
    "source": "AI original",
    "category": "Philosophy"
  },
  {
    "quote": "A small beginning\nis still a beginning.",
    "source": "AI original",
    "category": "Motivation"
  },
  {
    "quote": "You can move forward\nwithout having the whole map.",
    "source": "AI original",
    "category": "Motivation"
  },
  {
    "quote": "Take the next kind step.\nThen take another.",
    "source": "AI original",
    "category": "Motivation"
  },
  {
    "quote": "Love can be quiet\nand still fill a room.",
    "source": "AI original",
    "category": "Love"
  },
  {
    "quote": "May we make room\nfor each other to become.",
    "source": "AI original",
    "category": "Love"
  },
  {
    "quote": "Some hearts feel like\na light left on.",
    "source": "AI original",
    "category": "Love"
  },
  {
    "quote": "Home is made\nin the ways we care.",
    "source": "AI original",
    "category": "Family"
  },
  {
    "quote": "The ordinary days\nare part of what we keep.",
    "source": "AI original",
    "category": "Family"
  },
  {
    "quote": "May there always be\na place for you at the table.",
    "source": "AI original",
    "category": "Family"
  }
];
  function renderIdeas() {
    $('#ideas-grid').replaceChildren();
    const filtered=ideas.filter(idea => category==='Recommended' || idea.category===category);
    $('#ideas-empty').hidden=filtered.length>0;
    filtered.forEach(idea => {
      const button=document.createElement('button'); button.type='button'; button.className='idea'; button.dataset.quote=idea.quote; button.dataset.source=idea.source;
      const text=document.createElement('span'); text.textContent=idea.quote;
      const source=document.createElement('span'); source.className='idea-source'; source.textContent=idea.source;
      button.append(text,source); button.addEventListener('click',() => { design.quote=idea.quote; design.source=idea.source; syncFields(); render(); persist(); });
      $('#ideas-grid').append(button);
    });
    $$('[data-category]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.category===category))); render();
  }
  $$('[data-category]').forEach(el => el.addEventListener('click',() => { category=el.dataset.category; renderIdeas(); }));
  let drag=null, suppressClick=false;
  $('#handle').addEventListener('click',() => { if (suppressClick) { suppressClick=false; return; } setExpanded(!expanded); });
  $('#handle').addEventListener('pointerdown',event => { if (event.button!==0) return; suppressClick=false; drag={y:event.clientY,height:sheet.getBoundingClientRect().height,expanded}; event.currentTarget.setPointerCapture(event.pointerId); });
  $('#handle').addEventListener('pointermove',event => {
    if (!drag) return; const dy=event.clientY-drag.y;
    if (Math.abs(dy)>8) { suppressClick=true; sheet.classList.add('dragging'); const max=editor.clientHeight-parseFloat(getComputedStyle($('.app')).paddingTop)-20; sheet.style.height=Math.max(120,Math.min(max,drag.height-dy))+'px'; }
  });
  $('#handle').addEventListener('pointerup',event => {
    if (!drag) return; const dy=event.clientY-drag.y, wasExpanded=drag.expanded; drag=null; sheet.classList.remove('dragging');
    if (!suppressClick) return;
    if (dy>70 && !wasExpanded) close();
    setExpanded(dy < -50 ? true : dy>50 ? false : wasExpanded);
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
  document.addEventListener('focusin',event => { if (event.target.matches('textarea')) setTimeout(() => event.target.scrollIntoView({block:'nearest'}),100); });
  window.addEventListener('pagehide',persist);
  syncFields(); renderIdeas(); render();
})();
