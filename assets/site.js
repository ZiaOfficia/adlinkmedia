(function(){
  var d=document;

  /* Image fallbacks: any missing image shows a styled panel instead of a broken icon */
  function markMissing(img){
    var box=img.closest('.media,.logo,.f-logo,.logo-tile');
    if(box) box.classList.add('missing');
  }
  d.querySelectorAll('img').forEach(function(img){
    if(img.complete && img.naturalWidth===0) markMissing(img);
    img.addEventListener('error',function(){markMissing(img)});
  });

  /* Mobile menu */
  var btn=d.getElementById('menuBtn'),nav=d.getElementById('mainNav');
  if(btn&&nav){
    var mq=window.matchMedia('(max-width:1080px)');
    var setOpen=function(o){btn.setAttribute('aria-expanded',String(o));nav.hidden=!o;btn.textContent=o?'Close':'Menu'};
    var sync=function(){ if(mq.matches) setOpen(false); else nav.hidden=false; };
    sync();
    if(mq.addEventListener) mq.addEventListener('change',sync); else mq.addListener(sync);
    btn.addEventListener('click',function(){setOpen(nav.hidden)});
  }

  /* Header shadow on scroll */
  var top=d.querySelector('.top');
  if(top){window.addEventListener('scroll',function(){top.classList.toggle('scrolled',window.scrollY>10)},{passive:true})}

  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Billboard creatives */
  var faces=d.querySelectorAll('.board-face');
  if(faces.length>1 && !still){
    var fi=0;setInterval(function(){faces[fi].classList.remove('on');fi=(fi+1)%faces.length;faces[fi].classList.add('on')},3200);
  }

  /* Hero photo slider */
  var slides=d.querySelectorAll('.hero-bg img'),dots=d.querySelectorAll('.hero-dots button'),si=0,timer;
  function show(n){
    if(!slides.length) return;
    slides[si].classList.remove('on'); if(dots[si]) dots[si].classList.remove('on');
    si=(n+slides.length)%slides.length;
    slides[si].classList.add('on'); if(dots[si]) dots[si].classList.add('on');
  }
  dots.forEach(function(b,i){b.addEventListener('click',function(){show(i);clearInterval(timer)})});
  if(slides.length>1 && !still){timer=setInterval(function(){show(si+1)},5500)}

  /* Count-up stats (numbers are already in the HTML; this only animates them) */
  if(!still && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return; io.unobserve(e.target);
        var el=e.target,end=parseInt(el.getAttribute('data-count'),10),t0=null;
        if(isNaN(end)||end>1900) return;
        function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/1200,1); el.firstChild.nodeValue=Math.round(end*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    },{threshold:.6});
    d.querySelectorAll('[data-count]').forEach(function(el){io.observe(el)});
  }

  /* Gallery lightbox */
  var items=[].slice.call(d.querySelectorAll('.gallery button'));
  if(items.length){
    var lb=d.createElement('div');lb.className='lightbox';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image viewer');
    lb.innerHTML='<img alt=""><button class="lb-btn lb-close" aria-label="Close">✕</button><button class="lb-btn lb-prev" aria-label="Previous">‹</button><button class="lb-btn lb-next" aria-label="Next">›</button>';
    d.body.appendChild(lb);
    var big=lb.querySelector('img'),cur=0;
    var open=function(i){
      var ok=items.filter(function(b){return !b.querySelector('.missing')});
      if(!ok.length) return;
      cur=(i+items.length)%items.length;
      var im=items[cur].querySelector('img'); big.src=im.src; big.alt=im.alt; lb.hidden=false; lb.querySelector('.lb-close').focus();
    };
    items.forEach(function(b,i){b.addEventListener('click',function(){ if(!b.querySelector('.missing')) open(i)})});
    lb.querySelector('.lb-close').onclick=function(){lb.hidden=true;items[cur].focus()};
    lb.querySelector('.lb-prev').onclick=function(){open(cur-1)};
    lb.querySelector('.lb-next').onclick=function(){open(cur+1)};
    lb.addEventListener('click',function(e){if(e.target===lb){lb.hidden=true}});
    d.addEventListener('keydown',function(e){ if(lb.hidden) return;
      if(e.key==='Escape'){lb.hidden=true;items[cur].focus()} if(e.key==='ArrowLeft') open(cur-1); if(e.key==='ArrowRight') open(cur+1); });
  }

  /* Copy buttons */
  d.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var txt=b.getAttribute('data-copy'),done=function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o},1500)};
      try{navigator.clipboard.writeText(txt).then(done,function(){})}catch(err){}
    });
  });

  /* Enquiry form (connect to email/CRM on the live server) */
  var form=d.querySelector('form.enquiry');
  if(form){
    var note=form.querySelector('.form-note');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=form.elements.name.value.trim(),phone=form.elements.phone.value.replace(/\D/g,'');
      note.className='form-note';
      if(!name){note.textContent='Add your name so we know who to call.';form.elements.name.focus();return}
      if(phone.length<10){note.textContent='Enter a 10-digit mobile number so we can call you back.';form.elements.phone.focus();return}
      note.className='form-note ok';
      note.textContent='Thank you, '+name+'. Our team will call you within one working day.';
      form.reset();
    });
  }
})();
