// A short cinematic intro that never holds the page hostage.
(() => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const percent = document.getElementById('loader-percent');
  const progress = document.getElementById('loader-progress');
  const status = document.getElementById('loader-status-text');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const messages = [[0,'INITIALIZING EXPERIENCE'],[28,'ASSEMBLING INTERFACE'],[58,'LOADING PROJECTS'],[82,'POLISHING DETAILS'],[100,'READY TO EXPLORE']];
  const start = performance.now();
  const minimumDuration = reducedMotion ? 250 : 1450;
  const maxWait = 4500;
  let pageReady = document.readyState === 'complete';
  window.addEventListener('load', () => { pageReady = true; }, { once:true });
  function finish(){loader.classList.add('is-done');window.setTimeout(()=>loader.remove(),1100);}
  function tick(now){
    const elapsed=now-start;
    const timeProgress=Math.min(elapsed/minimumDuration,1);
    let value=Math.floor(100*(1-Math.pow(1-timeProgress,2.2)));
    if(!pageReady && elapsed<maxWait) value=Math.min(value,94);
    if(percent) percent.textContent=String(value).padStart(2,'0');
    if(progress) progress.style.width=value+'%';
    const message=[...messages].reverse().find(([threshold])=>value>=threshold);
    if(status && message) status.textContent=message[1];
    if((pageReady || elapsed>=maxWait) && elapsed>=minimumDuration){
      if(percent) percent.textContent='100';
      if(progress) progress.style.width='100%';
      if(status) status.textContent='READY TO EXPLORE';
      window.setTimeout(finish,reducedMotion?0:220);
    }else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.topbar nav');
toggle.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('.stack-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.stack-tabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter=btn.dataset.filter;
  document.querySelectorAll('.stack-item').forEach(item=>item.classList.toggle('hide',filter!=='all'&&item.dataset.category!==filter));
}));
const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.content-section,.project-card,.featured-project').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition='opacity .7s ease, transform .7s ease';reveal.observe(el)});
const style=document.createElement('style');style.textContent='.visible{opacity:1!important;transform:translateY(0)!important}';document.head.appendChild(style);
