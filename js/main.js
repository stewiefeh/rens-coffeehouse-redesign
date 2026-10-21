document.documentElement.classList.add('js');
(function(){
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* active nav link */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function(a){
    var target = a.getAttribute('href');
    if(target === here){ a.classList.add('active'); }
  });

  /* mobile nav */
  var mb = document.getElementById('menu-btn');
  var mn = document.getElementById('mobile-nav');
  if(mb && mn){
    mb.addEventListener('click', function(){ mn.classList.toggle('open');mb.setAttribute('aria-expanded',mn.classList.contains('open')); });
  }

  /* open / closed chip */
  var hours={0:["9:00","15:00"],1:["7:00","16:00"],2:["7:00","16:00"],3:null,4:["7:00","16:00"],5:["7:00","16:00"],6:["9:00","15:00"]};
  var names=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function fmt(m){var h=Math.floor(m/60),mm=m%60,ap=h>=12?"pm":"am",h12=h%12;if(h12===0)h12=12;return h12+":"+(mm<10?"0":"")+mm+" "+ap;}
  var now=new Date(),d=now.getDay(),mins=now.getHours()*60+now.getMinutes(),t=hours[d];
  var chipText=document.getElementById('open-text');
  if(chipText){
    var text,open;
    if(t&&mins>=60*+t[0].split(":")[0]&&mins<60*+t[1].split(":")[0]){open=true;text="Open now, closes "+fmt(60*+t[1].split(":")[0]);}
    else{open=false;var k=d;for(var i=1;i<=7;i++){k=(d+i)%7;if(hours[k]){var oh=hours[k][0].split(":");text="Closed, opens "+names[k]+" at "+fmt(60*+oh[0]);break;}}}
    chipText.textContent=text;
    var dotEl=document.getElementById('open-dot');
    if(dotEl){dotEl.className=open?"dot":"dot closed";}
  }
  var tr=document.querySelector('#hours-table tr[data-day="'+d+'"]');
  if(tr){tr.classList.add('today');}

  /* reveal on scroll */
  var rev=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduced){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    rev.forEach(function(el){io.observe(el);});
  }else{
    rev.forEach(function(el){el.classList.add('revealed');});
  }

  /* page transitions */
  document.addEventListener('click', function(ev){
    if(reduced) return;
    var a = ev.target.closest('a');
    if(!a) return;
    if(a.target==='_blank'||a.hasAttribute('download')) return;
    var href=a.getAttribute('href')||'';
    if(!href||href.charAt(0)==='#'||/^(mailto|tel|https?):/i.test(href)) return;
    if(a.host && a.host!==location.host) return;
    ev.preventDefault();
    document.body.classList.add('page-leave');
    setTimeout(function(){ location.href=href; }, 260);
  });
})();
/* more dropdown */
(function(){
  var more = document.querySelector('.nav-more');
  if(!more) return;
  var btn = more.querySelector('.nav-more-btn');
  var page = location.pathname.split('/').pop() || 'index.html';
  if(more.querySelector('.nav-drop a[href="' + page + '"]')) more.classList.add('active');
  function close(){ more.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var open = more.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function(e){ if(more.classList.contains('open') && !more.contains(e.target)) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ close(); btn.blur(); } });
})();
