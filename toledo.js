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
function initWorksDeck(section) {
  if (!section) return;
  const stack = section.querySelector('.works-deck-stack');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('.works-card')];
  const count = cards.length;
  if (!count) return;

  // Ativa a animação do título EXCLUSIVAMENTE quando a seção entrar no campo de visão
  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => section.classList.add('is-inview'),
      onEnterBack: () => section.classList.add('is-inview')
    });
  } else if ('IntersectionObserver' in window) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.classList.add('is-inview');
        }
      });
    }, { threshold: 0.2 });
    secObs.observe(section);
  } else {
    section.classList.add('is-inview');
  }

  // Inclinações fixas orgânicas da pilha de cartas
  const tilts = [0, 3.2, -3.8, 2.6, -3.0];

  const cardData = cards.map((card, i) => {
    const afterLayer = card.querySelector('.works-layer.works-after');
    const wipeBar = card.querySelector('.works-wipe-bar');
    return {
      el: card,
      after: afterLayer,
      wipe: wipeBar,
      tilt: tilts[i % tilts.length]
    };
  });

  function setCardPose(c, depth, extraX = 0, extraY = 0, extraRot = 0, extraScale = 1, extraOpacity = 1) {
    const d = Math.max(0, depth);
    const cappedD = Math.min(d, 3.5);
    const baseY = -cappedD * 18;
    const baseScale = 1 - cappedD * 0.055;
    const baseRot = (depth === 0) ? 0 : c.tilt;
    const baseOpacity = depth > 3.5 ? 0 : Math.max(0, 1 - (depth - 2.5) * 1);
    const brightness = Math.max(0.68, 1 - cappedD * 0.08);

    const x = extraX;
    const y = baseY + extraY;
    const rot = baseRot + extraRot;
    const scale = baseScale * extraScale;
    const opacity = baseOpacity * extraOpacity;

    c.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    c.el.style.opacity = opacity.toFixed(3);
    c.el.style.filter = `brightness(${brightness.toFixed(2)})`;
    c.el.style.pointerEvents = depth < 0.5 ? 'auto' : 'none';
    c.el.style.zIndex = String(Math.round(100 - depth * 10));
  }

  function setWipe(c, pct) {
    const p = Math.max(0, Math.min(100, pct));
    if (c.after) {
      c.after.style.clipPath = `inset(0 calc(100% - ${p.toFixed(1)}%) 0 0)`;
    }
  }

  // Inicializa poses padrão
  cards.forEach((_, i) => {
    setCardPose(cardData[i], i);
    setWipe(cardData[i], 0);
  });

  let worksST = null;
  const pinnedStage = section.querySelector('.works-pinned-stage');

  if (window.gsap && window.ScrollTrigger && pinnedStage) {
    const isMobile = window.innerWidth <= 600;
    const scrollPerCard = isMobile ? 540 : 800;
    const totalScroll = count * scrollPerCard;

    worksST = ScrollTrigger.create({
      trigger: section,
      pin: pinnedStage,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      scrub: isMobile ? 0.28 : 0.45,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 a 1.0
        const virtualIndex = p * count;
        const currentCardIdx = Math.min(count - 1, Math.floor(virtualIndex));
        const localProgress = virtualIndex - currentCardIdx; // 0.0 a 1.0

        cards.forEach((_, i) => {
          const c = cardData[i];

          if (i < currentCardIdx) {
            // Card já passou e foi para o fundo
            setCardPose(c, 4, 0, 0, 0, 0.78, 0);
            setWipe(c, 100);
          } else if (i === currentCardIdx) {
            // Card em foco atual
            if (currentCardIdx === count - 1) {
              // Último card: onda suave e contemplação final
              let wipePct = 0;
              if (localProgress < 0.08) {
                wipePct = 0;
              } else if (localProgress <= 0.62) {
                const t = (localProgress - 0.08) / 0.54;
                const wave = 0.5 - 0.5 * Math.cos(Math.PI * t);
                wipePct = wave * 100;
              } else {
                wipePct = 100;
              }
              setWipe(c, wipePct);
              setCardPose(c, 0, 0, 0, 0, 1, 1);
            } else {
              // Cadência de onda: Início (Antes) -> Onda suave -> Pausa (Depois) -> Throw
              if (localProgress < 0.08) {
                // Momento inicial contemplando o Antes
                setWipe(c, 0);
                setCardPose(c, 0, 0, 0, 0, 1, 1);
              } else if (localProgress <= 0.58) {
                // A onda passa suavemente (rápido, devagar, curva de onda orgânica)
                const t = (localProgress - 0.08) / 0.50;
                const wave = 0.5 - 0.5 * Math.cos(Math.PI * t);
                setWipe(c, wave * 100);
                setCardPose(c, 0, 0, 0, 0, 1, 1);
              } else if (localProgress <= 0.76) {
                // "Pausou, pausou, pausou, passou a onda e acalmou":
                // O Depois fica 100% visível, nítido e estático para contemplação com calma
                setWipe(c, 100);
                setCardPose(c, 0, 0, 0, 0, 1, 1);
              } else {
                // Throw tridimensional para trás após a pausa contemplativa
                setWipe(c, 100);
                const throwProg = (localProgress - 0.76) / 0.24; // 0.0 a 1.0
                const stackWidth = stack.offsetWidth || 480;

                let throwX, throwY, throwRot, throwScale, throwOpacity, targetZ;
                if (throwProg < 0.55) {
                  const subP = throwProg / 0.55;
                  throwX = subP * (stackWidth * 1.15);
                  throwY = -Math.sin(subP * Math.PI) * 38;
                  throwRot = subP * 14;
                  throwScale = 1 + subP * 0.035;
                  throwOpacity = 1;
                  targetZ = 120;
                } else {
                  const subP = (throwProg - 0.55) / 0.45;
                  throwX = (1 - subP) * (stackWidth * 1.15);
                  throwY = -38 * (1 - subP) - subP * (3.5 * 18);
                  throwRot = 14 * (1 - subP) + subP * c.tilt;
                  throwScale = (1.035 * (1 - subP)) + subP * (1 - 3.5 * 0.055);
                  throwOpacity = Math.max(0, 1 - subP * 1.25);
                  targetZ = Math.round(100 - subP * 90);
                }

                c.el.style.transform = `translate3d(${throwX.toFixed(1)}px, ${throwY.toFixed(1)}px, 0) rotate(${throwRot.toFixed(1)}deg) scale(${throwScale.toFixed(3)})`;
                c.el.style.opacity = throwOpacity.toFixed(3);
                c.el.style.filter = `brightness(${(1 - throwProg * 0.32).toFixed(2)})`;
                c.el.style.zIndex = String(targetZ);
              }
            }
          } else {
            // Cards posteriores na pilha: avançam durante a fase do throw
            let relativeDepth = i - currentCardIdx;
            if (localProgress > 0.76 && currentCardIdx < count - 1) {
              const advanceProg = (localProgress - 0.76) / 0.24;
              relativeDepth -= advanceProg;
            }
            setWipe(c, 0);
            setCardPose(c, relativeDepth);
          }
        });
      }
    });
  } else {
    // Fallback sem ScrollTrigger
    let currentIdx = 0;
    function renderFallback() {
      cards.forEach((_, i) => {
        const c = cardData[i];
        const depth = (i - currentIdx + count) % count;
        setCardPose(c, depth);
        setWipe(c, depth === 0 ? 50 : 0);
      });
    }
    renderFallback();
    stack.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % count;
      renderFallback();
    });
  }

  // Interação por toque no mobile (avanço por swipe)
  let touchStartX = 0;
  let touchStartY = 0;
  stack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  stack.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (worksST) {
        const p = worksST.progress;
        const currentCard = Math.floor(p * count);
        const dir = dx < 0 ? 1 : -1;
        const target = Math.max(0, Math.min(count - 1, currentCard + dir));
        const targetP = (target + 0.05) / count;
        window.scrollTo({ top: worksST.start + targetP * (count * 750), behavior: 'smooth' });
      }
    }
  }, { passive: true });
}

document.querySelectorAll('#trabalhos').forEach(initWorksDeck);

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
