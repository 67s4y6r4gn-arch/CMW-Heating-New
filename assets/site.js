/* mobile menu */
function toggleMenu(){document.querySelector('.header').classList.toggle('open');}

/* hero slider */
(function(){
  const slides=document.querySelectorAll('.hero .slide');
  const dots=document.querySelectorAll('.dots button');
  if(!slides.length) return;
  let i=0;
  function go(n){
    slides[i].classList.remove('active');dots[i]&&dots[i].classList.remove('active');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('active');dots[i]&&dots[i].classList.add('active');
  }
  dots.forEach((d,n)=>d.addEventListener('click',()=>go(n)));
  setInterval(()=>go(i+1),6000);
})();

/* count-up stats */
(function(){
  const nums=document.querySelectorAll('[data-count]');
  if(!nums.length) return;
  const run=el=>{
    const target=+el.dataset.count, dur=1600, t0=performance.now();
    const step=t=>{const p=Math.min((t-t0)/dur,1);
      el.textContent=Math.floor(p*target).toLocaleString()+(el.dataset.suffix||'');
      if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  };
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){run(e.target);io.unobserve(e.target);}});},{threshold:.4});
  nums.forEach(n=>io.observe(n));
})();

/* simple contact form guard (static demo) */
function fakeSubmit(e){e.preventDefault();
  const m=document.getElementById('form-msg');
  if(m){m.style.display='block';e.target.reset();}
  return false;}

/* ============================================================
   Load prices & reviews from data/cmw-content.xlsx (SheetJS).
   The customer edits the Excel file; the site renders it.
   If the file can't be loaded (e.g. opened locally, not hosted)
   the default HTML content already in the page is kept.
   ============================================================ */
function _col(row,name){
  const k=Object.keys(row).find(k=>k.trim().toLowerCase().startsWith(name));
  return k!=null?String(row[k]).trim():'';
}
function _esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function renderPrices(rows){
  rows=rows.filter(r=>_col(r,'plan'));
  if(!rows.length)return;
  document.getElementById('price-grid').innerHTML=rows.map(r=>{
    const pop=_col(r,'popular').toLowerCase().startsWith('y');
    const feats=_col(r,'features').split(';').map(f=>f.trim()).filter(Boolean).map(f=>'<li>'+_esc(f)+'</li>').join('');
    const btn=_col(r,'button')||'Get a Quote';
    const note=_col(r,'note');
    let price=_col(r,'price');
    const bare=price.replace(/[,\s£]/g,'');
    if(/^\d+(\.\d+)?$/.test(bare)) price='£'+Number(bare).toLocaleString('en-GB');
    return '<div class="price'+(pop?' pop':'')+'">'+
      '<h3>'+_esc(_col(r,'plan'))+'</h3>'+
      '<div class="amt"><small>from </small>'+_esc(price)+(note && note.toLowerCase()!=='from'?'<small> '+_esc(note)+'</small>':'')+'</div>'+
      '<p style="color:var(--muted)">'+_esc(_col(r,'description'))+'</p>'+
      '<ul>'+feats+'</ul>'+
      '<a class="btn'+(pop?'':' blue')+'" href="contact-us.html">'+_esc(btn)+'</a>'+
    '</div>';
  }).join('');
}
function renderReviews(rows){
  rows=rows.filter(r=>_col(r,'quote'));
  if(!rows.length)return;
  document.getElementById('reviews-grid').innerHTML=rows.map(r=>{
    let n=parseInt(_col(r,'stars'),10); if(!(n>=1&&n<=5))n=5;
    const name=_col(r,'name'),av=name?name[0].toUpperCase():'★';
    return '<div class="quote">'+
      '<div class="stars">'+'★'.repeat(n)+'</div>'+
      '<p>'+_esc(_col(r,'quote'))+'</p>'+
      '<div class="who"><div class="av">'+_esc(av)+'</div><div><b>'+_esc(name)+'</b><small>'+_esc(_col(r,'source'))+'</small></div></div>'+
    '</div>';
  }).join('');
}
function _renderFrom(wb){
  if(document.getElementById('price-grid')&&wb.Sheets['Prices'])
    renderPrices(XLSX.utils.sheet_to_json(wb.Sheets['Prices'],{defval:''}));
  if(document.getElementById('reviews-grid')&&wb.Sheets['Reviews'])
    renderReviews(XLSX.utils.sheet_to_json(wb.Sheets['Reviews'],{defval:''}));
}
function _localPreviewPicker(){
  const anchor=document.getElementById('price-grid')||document.getElementById('reviews-grid');
  if(!anchor)return;
  const bar=document.createElement('div');
  bar.style.cssText='max-width:var(--wrap);margin:0 auto 26px;padding:14px 18px;border:1px dashed var(--orange);'+
    'border-radius:8px;background:#fff7f0;color:var(--navy);font-size:.92rem;display:flex;flex-wrap:wrap;gap:10px;align-items:center';
  bar.innerHTML='<strong>Local preview.</strong> You opened this page directly, so pick your '+
    '<code>cmw-content.xlsx</code> to preview your changes: <span class="pv-msg" style="color:var(--orange);font-weight:600"></span>';
  const inp=document.createElement('input');inp.type='file';inp.accept='.xlsx';
  inp.onchange=function(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=function(){try{_renderFrom(XLSX.read(new Uint8Array(r.result),{type:'array'}));
      bar.querySelector('.pv-msg').textContent='✓ Updated below.';}catch(err){bar.querySelector('.pv-msg').textContent='Could not read that file.';}};
    r.readAsArrayBuffer(f);};
  bar.insertBefore(inp,bar.querySelector('.pv-msg'));
  anchor.parentNode.insertBefore(bar,anchor);
}
(async function loadContent(){
  if(typeof XLSX==='undefined')return;
  if(!document.getElementById('price-grid')&&!document.getElementById('reviews-grid'))return;
  if(location.protocol==='file:'){_localPreviewPicker();return;}
  try{
    const res=await fetch('data/cmw-content.xlsx?t='+Date.now(),{cache:'no-store'});
    if(!res.ok)return;
    _renderFrom(XLSX.read(await res.arrayBuffer(),{type:'array'}));
  }catch(e){/* keep default in-page content */}
})();
