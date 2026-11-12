/* Existing interactions, shared across both Toledo units; spatial evolution v3. */
(()=>{'use strict';document.documentElement.classList.add('js');document.body.classList.add('js');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.choice').forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduce.matches)return;const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;card.style.transform=`rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-5px) scale(1.008)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
const menuButton=document.querySelector('.menu-button'),drawer=document.querySelector('.side-drawer'),drawerClose=document.querySelector('.drawer-close'),backdrop=document.querySelector('.drawer-backdrop');
function toggleDrawer(open){if(!drawer)return;const isOpen=typeof open==='boolean'?open:!drawer.classList.contains('open');drawer.classList.toggle('open',isOpen);if(backdrop)backdrop.classList.toggle('active',isOpen);if(menuButton){menuButton.classList.toggle('is-active',isOpen);menuButton.setAttribute('aria-expanded',String(isOpen));}document.body.style.overflow=isOpen?'hidden':'';}
if(menuButton)menuButton.addEventListener('click',()=>toggleDrawer());
if(drawerClose)drawerClose.addEventListener('click',()=>toggleDrawer(false));
if(backdrop)backdrop.addEventListener('click',()=>toggleDrawer(false));
if(drawer){drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleDrawer(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open')){toggleDrawer(false);menuButton?.focus();}});}
if('scrollRestoration' in history){history.scrollRestoration='manual';}
const header=document.querySelector('.site-header');
if(header){const onScroll=()=>{header.classList.toggle('is-scrolled',window.scrollY>80)};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('DOMContentLoaded',onScroll);onScroll();}
document.querySelectorAll('a[href="#inicio"]').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});});
const heroCopy=document.querySelector('.hero-copy');
if(heroCopy&&'IntersectionObserver' in window){const heroObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){heroCopy.classList.add('is-inview');heroObs.unobserve(heroCopy);}})},{threshold:0.15});heroObs.observe(heroCopy);}else if(heroCopy){heroCopy.classList.add('is-inview');}
const video=document.querySelector('#hero-video'),videoButton=document.querySelector('.video-control');
if(video){if(videoButton){let manualPause=false;videoButton.addEventListener('click',async()=>{if(video.paused){manualPause=false;try{await video.play()}catch{videoButton.textContent='Reproduzir vídeo'}}else{manualPause=true;video.pause()}});video.addEventListener('play',()=>videoButton.textContent='Pausar vídeo');video.addEventListener('pause',()=>videoButton.textContent='Reproduzir vídeo');}if('IntersectionObserver'in window)new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)video.pause();else if(!reduce.matches)video.play().catch(()=>{})}),{threshold:.15}).observe(video);reduce.addEventListener('change',e=>{if(e.matches)video.pause()})}
// ==========================================================================
// Deck 3D de Transformações Antes & Depois (Scroll-Driven Pinning)
// ==========================================================================
function initWorksCarousel(section) {
  if (!section) return;
  const carousel = section.querySelector('.works-carousel');
  if (!carousel) return;
  const items = [...carousel.querySelectorAll('.works-item')];
  const count = items.length;
  if (!count) return;

  const status = carousel.querySelector('.works-status');
  const names = items.map(it => it.dataset.service || it.querySelector('h3').textContent.trim());

  // Ativa a animação do título ao entrar no campo de visão
  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => section.classList.add('is-inview'),
      onEnterBack: () => section.classList.add('is-inview')
    });
  } else {
    section.classList.add('is-inview');
  }

  const mod = (n, m) => ((n % m) + m) % m;
  const state = { phase: 0 };
  let busy = false;
  let active = 0;

  // Estado das fotos de cada card
  const cardStates = items.map(item => {
    const beforeLayer = item.querySelector('.photo-before');
    const afterLayer = item.querySelector('.photo-after');
    const btn = item.querySelector('.works-toggle-btn');
    const pillBefore = btn ? btn.querySelector('.pill-before') : null;
    const pillAfter = btn ? btn.querySelector('.pill-after') : null;

    if (window.gsap) {
      gsap.set(beforeLayer, { z: 12, x: 0, y: 0, rotation: 0, scale: 1, filter: 'brightness(1)' });
      gsap.set(afterLayer, { z: -12, x: 8, y: -6, rotation: 2.5, scale: 0.96, filter: 'brightness(0.72)' });
    }

    return {
      item,
      before: beforeLayer,
      after: afterLayer,
      btn,
      pillBefore,
      pillAfter,
      isAfter: false,
      animating: false
    };
  });

  // Função cinematográfica de troca de fotos (Antes <-> Depois)
  function togglePhoto(index, forceState, duration = 0.62) {
    const cs = cardStates[index];
    if (!cs || cs.animating) return;

    const toAfter = (typeof forceState === 'boolean') ? forceState : !cs.isAfter;
    if (toAfter === cs.isAfter) return;

    cs.animating = true;
    cs.isAfter = toAfter;

    if (cs.pillBefore && cs.pillAfter) {
      cs.pillBefore.classList.toggle('is-active', !toAfter);
      cs.pillAfter.classList.toggle('is-active', toAfter);
    }

    if (!window.gsap || reduce.matches) {
      if (toAfter) {
        cs.before.style.zIndex = '1';
        cs.after.style.zIndex = '12';
        cs.before.style.filter = 'brightness(0.72)';
        cs.after.style.filter = 'brightness(1)';
      } else {
        cs.before.style.zIndex = '12';
        cs.after.style.zIndex = '1';
        cs.before.style.filter = 'brightness(1)';
        cs.after.style.filter = 'brightness(0.72)';
      }
      cs.animating = false;
      return;
    }

    if (toAfter) {
      // ANTES vai para trás, DEPOIS vem para a frente
      const tl = gsap.timeline({
        onComplete: () => { cs.animating = false; }
      });

      tl.to(cs.before, {
        y: -24,
        x: -72,
        rotation: -7,
        scale: 1.02,
        duration: duration * 0.42,
        ease: 'power2.out'
      })
      .set(cs.before, { z: -12 })
      .to(cs.before, {
        y: -6,
        x: -8,
        rotation: -2.5,
        scale: 0.96,
        filter: 'brightness(0.72)',
        duration: duration * 0.58,
        ease: 'power2.inOut'
      }, '-=0.04');

      tl.set(cs.after, { z: 12 }, '<')
      .to(cs.after, {
        y: 0,
        x: 0,
        rotation: 0,
        scale: 1,
        filter: 'brightness(1)',
        duration: duration * 0.75,
        ease: 'power2.out'
      }, '<');

    } else {
      // DEPOIS vai para trás, ANTES volta para a frente
      const tl = gsap.timeline({
        onComplete: () => { cs.animating = false; }
      });

      tl.to(cs.after, {
        y: -24,
        x: 72,
        rotation: 7,
        scale: 1.02,
        duration: duration * 0.42,
        ease: 'power2.out'
      })
      .set(cs.after, { z: -12 })
      .to(cs.after, {
        y: -6,
        x: 8,
        rotation: 2.5,
        scale: 0.96,
        filter: 'brightness(0.72)',
        duration: duration * 0.58,
        ease: 'power2.inOut'
      }, '-=0.04');

      tl.set(cs.before, { z: 12 }, '<')
      .to(cs.before, {
        y: 0,
        x: 0,
        rotation: 0,
        scale: 1,
        filter: 'brightness(1)',
        duration: duration * 0.75,
        ease: 'power2.out'
      }, '<');
    }
  }

  // Renderização 3D Reto & Flutuante do Carrossel
  function render() {
    if (!window.gsap) return;
    const width = carousel.offsetWidth || window.innerWidth;
    const desktop = width >= 1050;
    const tablet = width >= 640;
    const step = desktop ? Math.min(420, width * 0.34) : tablet ? 330 : Math.min(290, width * 0.82);

    items.forEach((item, i) => {
      const d = mod(i - state.phase + count / 2, count) - count / 2;
      const absD = Math.abs(d);

      const x = d * step;
      const z = -absD * 50;
      const scale = Math.max(0.78, 1 - Math.min(absD * 0.08, 0.22));
      const opacity = Math.max(0, Math.min(1, 1 - (absD - 0.72) * 1.25));
      const isCur = absD < 0.38;

      gsap.set(item, {
        x: x,
        y: 0,
        z: z,
        rotationY: 0,
        scale: scale,
        opacity: opacity,
        zIndex: Math.round(150 - absD * 20),
        visibility: opacity < 0.01 ? 'hidden' : 'visible'
      });

      item.classList.toggle('is-current', isCur);
      item.setAttribute('aria-hidden', String(!isCur));
    });
  }

  function announce() {
    active = mod(Math.round(state.phase), count);
    if (status) {
      status.textContent = `${names[active]} · ${active + 1} de ${count}`;
    }
  }

  function navigate(direction) {
    if (busy) return;
    busy = true;

    if (!window.gsap || reduce.matches) {
      state.phase = mod(state.phase + direction, count);
      render();
      announce();
      busy = false;
      return;
    }

    gsap.to(state, {
      phase: state.phase + direction,
      duration: 0.65,
      ease: 'power2.inOut',
      onUpdate: render,
      onComplete: () => {
        state.phase = mod(state.phase, count);
        render();
        announce();
        busy = false;
      }
    });
  }

  // Eventos de clique nas fotos e cards
  items.forEach((item, i) => {
    const btn = item.querySelector('.works-toggle-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePhoto(i);
      });
    }

    item.addEventListener('click', () => {
      const d = mod(i - state.phase + count / 2, count) - count / 2;
      if (Math.abs(d) < 0.38) {
        togglePhoto(i);
      } else {
        navigate(Math.sign(d));
      }
    });
  });

  // Botões de navegação
  const prevBtn = carousel.querySelector('[data-works-prev]');
  const nextBtn = carousel.querySelector('[data-works-next]');
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

  // Teclado
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      navigate(e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  // Touch & Swipe
  let down = null;
  const viewport = carousel.querySelector('.works-viewport');
  if (viewport) {
    viewport.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY, id: e.pointerId };
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointerup', (e) => {
      if (!down || e.pointerId !== down.id) return;
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      down = null;
      try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
      if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
        navigate(dx < 0 ? 1 : -1);
      }
    });

    viewport.addEventListener('pointercancel', (e) => {
      down = null;
      try { viewport.releasePointerCapture(e.pointerId); } catch (_) {}
    });
  }

  // Inicialização 3D e Resize
  if (window.gsap) {
    gsap.set(items, { xPercent: -50, yPercent: -50, transformPerspective: 1600 });
  }
  render();
  announce();

  window.addEventListener('resize', render);

  // ScrollTrigger para revelação no Visagismo ao rolar a página:
  // Começa com o Antes. Ao rolar suavemente na seção, revela o Depois!
  const pinnedStage = section.querySelector('.works-pinned-stage');
  if (window.gsap && window.ScrollTrigger && pinnedStage && !reduce.matches) {
    const isMobile = window.innerWidth <= 760;
    const pinDist = isMobile ? 380 : 420;

    let hasScrolledAfter = false;

    ScrollTrigger.create({
      trigger: section,
      pin: pinnedStage,
      start: 'top top',
      end: () => `+=${pinDist}`,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (Math.round(state.phase) === 0) {
          if (p >= 0.40 && !hasScrolledAfter) {
            hasScrolledAfter = true;
            togglePhoto(0, true, 0.55);
          } else if (p < 0.25 && hasScrolledAfter) {
            hasScrolledAfter = false;
            togglePhoto(0, false, 0.55);
          }
        }
      }
    });
  }
}

document.querySelectorAll('#trabalhos').forEach(initWorksCarousel);

function initPortraits(region){
 const stage=region.querySelector('.portrait-stage'),cards=[...stage.querySelectorAll('.team-card')],status=region.querySelector('.portrait-status');const count=cards.length;
 if(!count)return;if(!window.gsap){region.querySelector('.portrait-controls').hidden=true;region.querySelector('.portrait-help').textContent='Deslize para conhecer a equipe.';return;}
 const names=cards.map(c=>c.querySelector('h3').textContent.trim());stage.setAttribute('tabindex','-1');cards.forEach(c=>{c.querySelector('img').draggable=false});
 const state={phase:0},mod=(n,m)=>((n%m)+m)%m;let busy=false,queued=0,active=0,width=0,cardWidth=360;
 const set=cards.map(card=>({x:gsap.quickSetter(card,'x','px'),z:gsap.quickSetter(card,'z','px'),rotation:gsap.quickSetter(card,'rotationY','deg'),scale:gsap.quickSetter(card,'scale'),opacity:gsap.quickSetter(card,'opacity')}));
 gsap.set(cards,{xPercent:-50,transformPerspective:1500});
 function render(){const duo=count===2,desktop=width>=1050,tablet=width>=620;const step=desktop?255:tablet?225:cardWidth*.86;const radius=desktop?2.65:tablet?1.7:1.4;
  cards.forEach((card,i)=>{let x,z,rotation,scale,opacity,d;
   if(duo){const a=(i-state.phase)*Math.PI;const pair=width>=700;const angle=pair?a+Math.PI/2:a;
    x=Math.sin(angle)*(pair?195:cardWidth*.88);z=pair?Math.sin(a)*170+Math.cos(a)*55-55:(Math.cos(a)-1)*150;
    rotation=-x/(pair?195:cardWidth*.88)*14;scale=1;
    opacity=pair?1:Math.max(.12,Math.min(1,(Math.cos(a)+1)*.5));d=mod(i-Math.round(state.phase),count);
   }else{d=mod(i-state.phase+count/2,count)-count/2;x=d*step;z=-Math.min(d*d*94,1400);rotation=-Math.max(-2.8,Math.min(2.8,d))*18;scale=1-Math.min(Math.abs(d)*.025,.1);opacity=Math.max(0,Math.min(1,(radius-Math.abs(d))/.7));}
   set[i].x(x);set[i].z(z);set[i].rotation(rotation);set[i].scale(scale);set[i].opacity(opacity);
   card.style.zIndex=String(Math.round(200+z));card.style.visibility=opacity<.005?'hidden':'visible';
  });
 }
 function announce(){active=mod(Math.round(state.phase),count);cards.forEach((card,i)=>{const current=i===active;card.classList.toggle('is-current',current);card.setAttribute('aria-hidden',String(!current));card.setAttribute('aria-label',`${names[i]}, ${i+1} de ${count}`)});status.textContent=`${names[active]} · ${active+1} de ${count}`;region.dataset.active=String(active)}
 function navigate(direction){if(count<2)return;if(busy){queued=Math.max(-2,Math.min(2,queued+direction));return}busy=true;region.setAttribute('aria-busy','true');
  gsap.to(state,{phase:state.phase+direction,duration:reduce.matches?0:.68,ease:'power2.inOut',onUpdate:render,onComplete:()=>{state.phase=mod(state.phase,count);render();announce();busy=false;region.setAttribute('aria-busy','false');if(queued){const next=Math.sign(queued);queued-=next;navigate(next)}}});
 }
 const previous=region.querySelector('[data-portrait-prev]'),next=region.querySelector('[data-portrait-next]');previous.addEventListener('click',()=>navigate(-1));next.addEventListener('click',()=>navigate(1));
 region.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();navigate(e.key==='ArrowRight'?1:-1)}});
 let down=null;const viewport=region.querySelector('.portrait-viewport');viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;down={x:e.clientX,y:e.clientY,id:e.pointerId};viewport.setPointerCapture(e.pointerId)});
 viewport.addEventListener('pointerup',e=>{if(!down||e.pointerId!==down.id)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)navigate(dx<0?1:-1)});viewport.addEventListener('pointercancel',()=>down=null);
 function resize(){width=region.getBoundingClientRect().width;cardWidth=width>=1050?360:width>=620?320:Math.max(220,Math.min(320,width*.76));region.style.setProperty('--portrait-width',`${cardWidth}px`);render()}
 region.classList.add('is-ready');resize();announce();if('ResizeObserver'in window)new ResizeObserver(resize).observe(region);else window.addEventListener('resize',resize);
 reduce.addEventListener('change',()=>{gsap.killTweensOf(state);state.phase=Math.round(state.phase);busy=false;queued=0;region.setAttribute('aria-busy','false');render();announce()});
 region.dataset.ready='true';
}
document.querySelectorAll('.portrait-carousel').forEach(initPortraits);

// Vertical movement belongs to outer wrappers; portrait rotation stays independent.
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
 const targets=document.querySelectorAll('.spatial-item');targets.forEach((el,i)=>{const range=el.matches('.hero-film')?20:el.matches('.map-panel,.contact-unit')?14:22;const tl=gsap.timeline({scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.35,invalidateOnRefresh:true}});tl.fromTo(el,{y:range,scale:.982},{y:0,scale:1,ease:'none',duration:.5}).to(el,{y:-range,scale:.99,ease:'none',duration:.5})});
 document.querySelectorAll('.spatial-reading').forEach(el=>gsap.fromTo(el,{y:12},{y:-12,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.35,invalidateOnRefresh:true}}));
 document.querySelectorAll('.portrait-scroll-layer').forEach(el=>gsap.fromTo(el,{y:18,scale:.985},{y:-18,scale:1,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.35,invalidateOnRefresh:true}}));
 return()=>{};
 });window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
 document.fonts?.ready.then(()=>ScrollTrigger.refresh());
}
})();
