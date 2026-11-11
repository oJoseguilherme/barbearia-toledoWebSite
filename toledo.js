/* Existing interactions, shared across both Toledo units; spatial evolution v3. */
(()=>{'use strict';document.documentElement.classList.add('js');document.body.classList.add('js');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.choice').forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduce.matches)return;const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;card.style.transform=`rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-5px) scale(1.008)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
const menuButton=document.querySelector('.menu-button'),menu=document.querySelector('#menu');
if(menuButton&&menu){const close=()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Menu'};menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'Fechar':'Menu'});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){close();menuButton.focus()}})}
const video=document.querySelector('#hero-video'),videoButton=document.querySelector('.video-control');
if(video&&videoButton){let manualPause=false;videoButton.addEventListener('click',async()=>{if(video.paused){manualPause=false;try{await video.play()}catch{videoButton.textContent='Reproduzir vídeo'}}else{manualPause=true;video.pause()}});video.addEventListener('play',()=>videoButton.textContent='Pausar vídeo');video.addEventListener('pause',()=>videoButton.textContent='Reproduzir vídeo');if('IntersectionObserver'in window)new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)video.pause();else if(!reduce.matches&&!manualPause)video.play().catch(()=>{})}),{threshold:.15}).observe(video);reduce.addEventListener('change',e=>{if(e.matches)video.pause()})}
// The work gallery retains its native horizontal scrolling and finite controls.
document.querySelectorAll('.rail').forEach(rail=>{const buttons=[...document.querySelectorAll(`[data-rail="${rail.id}"]`)];const sync=()=>buttons.forEach(b=>{b.disabled=Number(b.dataset.dir)<0?rail.scrollLeft<=2:rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2;b.style.opacity=b.disabled?'.4':'1';b.style.cursor=b.disabled?'default':'pointer'});buttons.forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:Number(b.dataset.dir)*rail.clientWidth*.8,behavior:reduce.matches?'instant':'smooth'})));rail.addEventListener('scroll',sync,{passive:true});if('ResizeObserver'in window)new ResizeObserver(sync).observe(rail);sync()});

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
