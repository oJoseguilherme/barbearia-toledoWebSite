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
function initWorksShowcase(section) {
  if (!section) return;
  const menu = section.querySelector('.showcase-menu');
  const frame = section.querySelector('#showcase-frame');
  const img = section.querySelector('#showcase-img');
  const badge = section.querySelector('#showcase-badge');
  const badgeText = section.querySelector('#badge-text');
  const toggleBtn = section.querySelector('#showcase-toggle');
  const toggleLabel = section.querySelector('#toggle-label');
  if (!menu || !frame || !img) return;

  const items = [...menu.querySelectorAll('.showcase-item')];

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

  const procedures = [
    { name: 'Visagismo Masculino', after: 'imagens/VisagismoDepois.png', before: 'imagens/VisagismoAntes.png' },
    { name: 'Alisamento Capilar', after: 'imagens/AlisamentoCapilarDepois.png', before: 'imagens/AlisamentoCapilarAntes.png' },
    { name: 'Barboterapia', after: 'imagens/BarbaDepois.png', before: 'imagens/BarbaAntes.png' },
    { name: 'Corte na Tesoura', after: 'imagens/corteTesouraDepois.png', before: 'imagens/corteTesouraAntes.png' },
    { name: 'Corte Clássico', after: 'imagens/CorteClassicoDepois.png', before: 'imagens/CorteClassicoAntes.png' }
  ];

  let currentIndex = 0;
  let isShowingBefore = false;

  function updateDisplay(animate = true) {
    const proc = procedures[currentIndex];
    const src = isShowingBefore ? proc.before : proc.after;

    if (badge && badgeText) {
      badgeText.textContent = isShowingBefore ? 'Antes' : 'Depois';
      badge.classList.toggle('is-after', !isShowingBefore);
      badge.classList.toggle('is-before', isShowingBefore);
    }

    if (toggleLabel) {
      toggleLabel.textContent = isShowingBefore ? 'Ver Depois' : 'Ver Antes';
    }

    if (animate && window.gsap) {
      gsap.to(img, {
        opacity: 0.35,
        scale: 0.98,
        duration: 0.15,
        ease: 'power1.out',
        onComplete: () => {
          img.src = src;
          img.alt = `${proc.name}: ${isShowingBefore ? 'Antes' : 'Depois'}`;

          // Calibrações específicas de enquadramento
          if (currentIndex === 2 && isShowingBefore) {
            img.style.objectPosition = 'center 8%';
          } else if (currentIndex === 2 && !isShowingBefore) {
            img.style.objectPosition = 'center 16%';
          } else if (currentIndex === 4) {
            img.style.objectPosition = 'center 10%';
          } else {
            img.style.objectPosition = 'center 20%';
          }

          gsap.to(img, {
            opacity: 1,
            scale: 1,
            duration: 0.28,
            ease: 'power2.out'
          });
        }
      });
    } else {
      img.src = src;
    }
  }

  // Clique nos itens do menu
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (currentIndex === index) return;
      currentIndex = index;
      isShowingBefore = false; // Ao trocar de serviço, sempre começa no DEPOIS

      items.forEach((it, i) => {
        const active = i === currentIndex;
        it.classList.toggle('is-active', active);
        it.setAttribute('aria-selected', String(active));
      });

      updateDisplay(true);
    });
  });

  // Alternar Antes/Depois ao clicar no botão ou na própria foto
  function toggleBeforeAfter(e) {
    if (e) e.stopPropagation();
    isShowingBefore = !isShowingBefore;
    updateDisplay(true);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleBeforeAfter);
  frame.addEventListener('click', (e) => {
    if (e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
      toggleBeforeAfter(e);
    }
  });

  // Teclado no quadro da foto
  frame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBeforeAfter();
    }
  });
}

document.querySelectorAll('#trabalhos').forEach(initWorksShowcase);

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

// ==========================================
// 3D Curved Lens Carousel (WebGL) - Equipe Toledo
// ==========================================
function initCurvedLensCarousel(root) {
  if (!root) return;
  
  const dataScript = root.querySelector('script[type="application/json"]');
  let slides = [];
  if (dataScript) {
    try {
      slides = JSON.parse(dataScript.textContent);
    } catch (e) {
      console.error("Falha ao ler dados dos slides da equipe:", e);
    }
  }
  if (!slides || !slides.length) return;
  
  const n = slides.length;
  const canvas = root.querySelector('.clc-canvas');
  if (!canvas) return;

  const bend = parseFloat(root.dataset.bend || '0.55');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const copyEl = root.querySelector('.clc-copy');
  const kickerEl = root.querySelector('.clc-kicker');
  const titleLineEl = root.querySelector('.clc-title .clc-line');
  const capEl = root.querySelector('.clc-cap');
  const countCurrentEl = root.querySelector('.clc-count-current');
  const countTotalEl = root.querySelector('.clc-count-total');
  const barFillEl = root.querySelector('.clc-bar-fill');
  const prevBtn = root.querySelector('.clc-btn-prev');
  const nextBtn = root.querySelector('.clc-btn-next');
  const fallbackImg = root.querySelector('.clc-fallback');

  function pad2(num) {
    return num < 10 ? '0' + num : String(num);
  }

  if (countTotalEl) countTotalEl.textContent = pad2(n);

  let current = 0;
  let shown = false;

  function wrap(i, total) {
    return total > 0 ? ((i % total) + total) % total : 0;
  }

  function offsetOf(i, pos, total) {
    if (total <= 0) return 0;
    return wrap(i - pos + total / 2, total) - total / 2;
  }

  function restFor(pos, velocity, max = 3) {
    const throwTo = pos + Math.max(-max, Math.min(max, velocity * 0.18));
    return Math.round(throwTo);
  }

  function springStep(pos, vel, target, dt, omega = 11) {
    const a = (target - pos) * omega * omega - vel * 2 * omega;
    const v = vel + a * dt;
    return [pos + v * dt, v];
  }

  function cardSize(w, h) {
    const cw = Math.min(w < 640 ? w * 0.56 : w * 0.22, h * 0.34);
    return [Math.round(cw), Math.round(cw * 1.25)];
  }

  function updateCopy(idx) {
    const slide = slides[idx] || slides[0];
    if (!slide) return;
    
    if (countCurrentEl) countCurrentEl.textContent = pad2(idx + 1);
    if (barFillEl) barFillEl.style.transform = 'scaleX(' + ((idx + 1) / n) + ')';

    if (copyEl) {
      copyEl.classList.remove('clc-in');
      void copyEl.offsetWidth; // reflow

      if (kickerEl) kickerEl.textContent = slide.kicker || 'Especialista Toledo';
      if (capEl) capEl.textContent = slide.caption || 'Consulte horários para agendamento';
      
      if (titleLineEl) {
        titleLineEl.innerHTML = '';
        const words = (slide.title || '').split(' ');
        let charCount = 0;
        words.forEach((word, wIdx) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          
          word.split('').forEach((ch) => {
            const chSpan = document.createElement('span');
            chSpan.className = 'clc-ch';
            chSpan.textContent = ch;
            chSpan.style.transitionDelay = (60 + charCount * 24) + 'ms';
            wordSpan.appendChild(chSpan);
            charCount++;
          });
          titleLineEl.appendChild(wordSpan);
          if (wIdx < words.length - 1) {
            titleLineEl.appendChild(document.createTextNode(' '));
            charCount++;
          }
        });
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          copyEl.classList.add('clc-in');
        });
      });
    }

    if (fallbackImg) {
      fallbackImg.src = slide.image;
      fallbackImg.alt = slide.alt || slide.title;
    }
  }

  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true });
  if (!gl) {
    root.classList.add('clc-no-gl');
    updateCopy(0);
    return;
  }

  const VERT =
    "attribute vec2 aPos;" +
    "uniform vec2 uRes;uniform vec2 uSize;uniform float uX;uniform float uBend;uniform float uVel;uniform float uIntro;uniform float uLift;" +
    "varying vec2 vUv;varying float vX;" +
    "void main(){" +
    "vec2 p=vec2(uX+(aPos.x-.5)*uSize.x,(aPos.y-.5)*uSize.y);" +
    "p.y-=(1.-uIntro)*uSize.y*.9;" +
    "vec2 n=p/(uRes*.5);" +
    "float x=clamp(n.x,-1.4,1.4);" +
    "n.y*=1.+uBend*x*x;" +
    "n.y+=uVel*.05*sin(aPos.x*3.14159)*(aPos.y-.5);" +
    "n.x*=1.-.06*uBend*x*x;n.y+=uLift;" +
    "vUv=aPos;vX=x;" +
    "gl_Position=vec4(n,0.,1.);}";

  const FRAG =
    "precision highp float;" +
    "uniform sampler2D uTex;uniform vec2 uSize;uniform float uAspect;uniform float uVel;uniform float uIntro;uniform float uShift;uniform float uReady;" +
    "varying vec2 vUv;varying float vX;" +
    "float box(vec2 q,vec2 b,float r){vec2 d=abs(q)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}" +
    "void main(){" +
    "float a=uSize.x/uSize.y;vec2 uv=vUv-.5;" +
    "if(uAspect>a)uv.x*=a/uAspect;else uv.y*=uAspect/a;" +
    "uv=uv/1.12+.5;uv.x+=uShift;" +
    "float ca=(.0012+.0045*vX*vX)*(1.+abs(uVel)*1.2);" +
    "vec3 c=vec3(texture2D(uTex,uv+vec2(ca,0.)).r,texture2D(uTex,uv).g,texture2D(uTex,uv-vec2(ca,0.)).b);" +
    "c=mix(vec3(.11,.11,.12),c,uReady);" +
    "c*=1.-.42*min(1.,vX*vX);" +
    "float d=box((vUv-.5)*uSize,uSize*.5,14.);" +
    "float rim=smoothstep(-5.,0.,d);" +
    "c+=rim*.10;" +
    "c+=.07*smoothstep(.55,1.,vUv.y)*(1.-abs(vX));" +
    "float al=smoothstep(.75,-.75,d)*uIntro;" +
    "gl_FragColor=vec4(c*al,al);}";

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function grid(segX, segY) {
    const out = [];
    for (let y = 0; y < segY; y++) {
      for (let x = 0; x < segX; x++) {
        const x0 = x / segX, x1 = (x + 1) / segX, y0 = y / segY, y1 = (y + 1) / segY;
        out.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1);
      }
    }
    return new Float32Array(out);
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("3d-curved-carousel GL error: " + gl.getProgramInfoLog(prog));
    root.classList.add('clc-no-gl');
    updateCopy(0);
    return;
  }
  gl.useProgram(prog);

  const mesh = grid(36, 12);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  ["uRes", "uSize", "uX", "uBend", "uVel", "uIntro", "uTex", "uAspect", "uShift", "uReady", "uLift"].forEach(k => {
    u[k] = gl.getUniformLocation(prog, k);
  });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let disposed = false;
  const tex = slides.map(s => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([28, 28, 30, 255]));
    [
      [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
      [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]
    ].forEach(([p, v]) => gl.texParameteri(gl.TEXTURE_2D, p, v));

    const entry = { t, aspect: 0.8, ready: false };
    const img = new Image();
    if (!s.image.startsWith("data:")) img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      entry.aspect = img.naturalWidth / img.naturalHeight;
      entry.ready = true;
      kick();
    };
    img.src = s.image;
    return entry;
  });

  let W = 1, H = 1, dpr = 1, cw = 1, ch = 1, gap = 1;
  let pos = 0, vel = 0, target = 0;
  let intro = reduced.matches ? 1 : 0;
  let introStart = -1;
  let dragging = false, dragX = 0, dragPos = 0, lastX = 0, lastT = 0, flick = 0;
  let raf = 0, last = 0, visible = true;

  const resize = (w, h) => {
    W = Math.max(1, w);
    H = Math.max(1, h);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    [cw, ch] = cardSize(W, H);
    gap = cw * 0.14;
    gl.viewport(0, 0, canvas.width, canvas.height);
    kick();
  };

  const draw = () => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uRes, W, H);
    gl.uniform2f(u.uSize, cw, ch);
    gl.uniform1f(u.uBend, bend);
    gl.uniform1f(u.uVel, reduced.matches ? 0 : Math.max(-1, Math.min(1, vel * 0.12)));
    gl.uniform1f(u.uLift, W < 640 ? 0.3 : 0.15);
    const step = cw + gap;
    for (let i = 0; i < n; i++) {
      const d = offsetOf(i, pos, n);
      const x = d * step;
      if (Math.abs(x) > W * 0.5 + step * 1.5) continue;
      const order = Math.abs(d);
      const t = Math.max(0, Math.min(1, (intro - order * 0.12) / 0.6));
      const e = 1 - Math.pow(1 - t, 3);
      gl.bindTexture(gl.TEXTURE_2D, tex[i].t);
      gl.uniform1f(u.uX, x);
      gl.uniform1f(u.uIntro, e);
      gl.uniform1f(u.uAspect, tex[i].aspect);
      gl.uniform1f(u.uReady, tex[i].ready ? 1 : 0);
      gl.uniform1f(u.uShift, Math.max(-0.05, Math.min(0.05, -d * 0.035)));
      gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 2);
    }
  };

  const frame = (now) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (intro < 1) {
      if (introStart < 0) introStart = now;
      intro = Math.min(1.5, (now - introStart) / 1100);
      if (intro >= 1.5) intro = 1;
    }
    if (!dragging) {
      if (reduced.matches) {
        pos = target;
        vel = 0;
      } else {
        [pos, vel] = springStep(pos, vel, target, dt);
      }
    }
    const idx = wrap(Math.round(pos), n);
    if (idx !== current) {
      current = idx;
      updateCopy(idx);
    }
    draw();
    const settled = !dragging && Math.abs(target - pos) < 0.0005 && Math.abs(vel) < 0.001 && (intro >= 1 || reduced.matches);
    if (settled) {
      pos = target;
      draw();
      last = 0;
    } else if (visible) {
      raf = requestAnimationFrame(frame);
    }
  };

  function kick() {
    if (!raf && visible && !disposed) raf = requestAnimationFrame(frame);
  }

  function go(dir) {
    target = Math.round(target) + dir;
    kick();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(1));

  const onDown = (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragX = lastX = e.clientX;
    lastT = e.timeStamp;
    dragPos = pos;
    flick = 0;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    kick();
  };

  const onMove = (e) => {
    if (!dragging) return;
    const step = cw + gap;
    const p = dragPos - (e.clientX - dragX) / step;
    const dts = Math.max(1, e.timeStamp - lastT) / 1000;
    flick = flick * 0.6 + (-(e.clientX - lastX) / step / dts) * 0.4;
    vel = flick;
    lastX = e.clientX;
    lastT = e.timeStamp;
    pos = p;
    kick();
  };

  const onUp = (e) => {
    if (!dragging) return;
    dragging = false;
    target = restFor(pos, flick);
    vel = flick;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    kick();
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
  });

  const ro = new ResizeObserver((entries) => {
    const r = entries[0].contentRect;
    resize(r.width, r.height);
  });
  ro.observe(root);

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) {
      if (!shown) {
        shown = true;
        updateCopy(0);
      }
      kick();
    }
  });
  io.observe(root);

  updateCopy(0);
}


document.querySelectorAll('.clc-root').forEach(initCurvedLensCarousel);
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
