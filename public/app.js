const W=1080, H=1350;
const NAVY="#13304e", GOLD="#c8a55a", WHITE="#ffffff";

const state = {
  photos:new Array(10).fill(null),
  logo:null,
  t1a:"", t1b:"",
  mids:new Array(8).fill("Mobiliado e decorado"),
  cT1:"", cT2:"", cSub:"", cF:["","","",""], cPrice:""
};

/* ---------- helpers ---------- */
function rr(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function cover(ctx,img,x,y,w,h){
  if(!img){ ctx.fillStyle="#cfd6dc"; ctx.fillRect(x,y,w,h);
    ctx.fillStyle="#8a99a6"; ctx.font="bold 40px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("Foto",x+w/2,y+h/2); return; }
  const ir=img.width/img.height, tr=w/h; let sw,sh,sx,sy;
  if(ir>tr){ sh=img.height; sw=sh*tr; sx=(img.width-sw)/2; sy=0; }
  else{ sw=img.width; sh=sw/tr; sx=0; sy=(img.height-sh)/2; }
  ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}
function spaced(ctx,txt,x,y,ls){
  const old=ctx.textAlign; ctx.textAlign="left";
  let cx=x;
  for(const ch of txt){ ctx.fillText(ch,cx,y); cx+=ctx.measureText(ch).width+ls; }
  ctx.textAlign=old;
  return cx-ls-x;
}
function spacedWidth(ctx,txt,ls){ let w=0; for(const ch of txt) w+=ctx.measureText(ch).width+ls; return w-ls; }

/* ---------- Imperium shield emblem (fallback vetorial) ---------- */
function emblem(ctx,cx,cy,h,color){
  const capTop=cy-h/2, capH=h*0.30;
  const shieldTop=capTop+capH+h*0.03, shieldBot=cy+h/2;
  const sw=h*0.50;
  ctx.fillStyle=color; ctx.strokeStyle=color;
  const barH=capH*0.26, gap=capH*0.11;
  const widths=[sw*1.34, sw*1.14, sw*0.98];
  let yy=capTop;
  for(let i=0;i<3;i++){ const bw=widths[i]; ctx.fillRect(cx-bw/2, yy, bw, barH); yy+=barH+gap; }
  const lw=Math.max(2.5,h*0.05); ctx.lineWidth=lw; ctx.lineJoin="round";
  const sx=cx-sw/2, ex=cx+sw/2, r=sw*0.18, midY=shieldBot-sw*0.62;
  ctx.beginPath();
  ctx.moveTo(sx, shieldTop+r);
  ctx.arcTo(sx,shieldTop,sx+r,shieldTop,r);
  ctx.lineTo(ex-r,shieldTop);
  ctx.arcTo(ex,shieldTop,ex,shieldTop+r,r);
  ctx.lineTo(ex, midY);
  ctx.lineTo(cx, shieldBot);
  ctx.lineTo(sx, midY);
  ctx.closePath(); ctx.stroke();
  ctx.fillStyle=color; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.font=`700 ${Math.round(h*0.36)}px Georgia,'Times New Roman',serif`;
  ctx.fillText("I", cx, (shieldTop+midY)/2 + h*0.015);
}

/* ---------- logo lockup (topo direito). Usa o logo.png recortado. ---------- */
function logoBox(ctx,x,y,w,h){
  if(state.logo){
    const img=state.logo, ir=img.width/img.height; let dw=w,dh=w/ir;
    if(dh>h){ dh=h; dw=h*ir; }
    ctx.drawImage(img, x+w-dw, y+(h-dh)/2, dw, dh);
    return;
  }
  // fallback vetorial (caso o logo.png não carregue)
  ctx.fillStyle=NAVY; rr(ctx,x,y,w,h,14); ctx.fill();
  ctx.lineWidth=2.5; ctx.strokeStyle=GOLD; rr(ctx,x+4,y+4,w-8,h-8,10); ctx.stroke();
  emblem(ctx,x+h*0.58,y+h/2,h*0.70,GOLD);
  const tx=x+h*0.98;
  ctx.textBaseline="alphabetic"; ctx.fillStyle=WHITE;
  ctx.font=`600 ${Math.round(h*0.30)}px Georgia,'Times New Roman',serif`;
  spaced(ctx,"IMPERIUM",tx,y+h*0.52,1.5);
  ctx.fillStyle=GOLD;
  ctx.font=`500 ${Math.round(h*0.135)}px Georgia,'Times New Roman',serif`;
  spaced(ctx,"IMÓVEIS",tx,y+h*0.74,7);
}

/* emblema só-marca (canto inferior das faixas). Se houver logo.png, recorta o
   emblema dele; senão desenha o vetorial. */
function markOnly(ctx,cx,cy,h,color){
  if(state.emblemImg){
    const img=state.emblemImg, ir=img.width/img.height, dh=h, dw=dh*ir;
    ctx.drawImage(img, cx-dw/2, cy-dh/2, dw, dh);
    return;
  }
  emblem(ctx,cx,cy,h,color);
}

/* ---------- faixa (pennant navy + banner dourado) ---------- */
function banner(ctx,lines){
  const by=1188, bh=104, bx=132, bw=700, r=22;
  const py=by+6, ph=bh-12, px=44, pw=118, tip=40;
  ctx.fillStyle=NAVY;
  ctx.beginPath();
  ctx.moveTo(px+8,py); ctx.lineTo(px+pw,py); ctx.lineTo(px+pw+tip,py+ph/2);
  ctx.lineTo(px+pw,py+ph); ctx.lineTo(px+8,py+ph);
  ctx.arcTo(px,py+ph,px,py,8); ctx.arcTo(px,py,px+8,py,8);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle=GOLD; rr(ctx,bx,by,bw,bh,r); ctx.fill();
  markOnly(ctx, 940, by+bh/2+6, 150, GOLD);
  ctx.fillStyle=NAVY; ctx.textAlign="left"; ctx.textBaseline="middle";
  const tx=bx+92;
  if(lines.length===1){
    ctx.font="800 46px Arial";
    ctx.fillText(lines[0], tx, by+bh/2+2);
  }else{
    ctx.font="800 40px Arial";
    ctx.fillText(lines[0], tx, by+bh/2-19);
    ctx.fillText(lines[1], tx, by+bh/2+23);
  }
}

/* ---------- ícones do card ---------- */
function icoBase(ctx){ ctx.strokeStyle=WHITE; ctx.fillStyle=WHITE; ctx.lineWidth=4;
  ctx.lineJoin="round"; ctx.lineCap="round"; ctx.textAlign="center"; }
function icoSofa(ctx,cx,cy){ icoBase(ctx);
  rr(ctx,cx-30,cy-2,60,22,7); ctx.stroke();
  rr(ctx,cx-24,cy-20,48,16,6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-30,cy+4); ctx.lineTo(cx-30,cy-8);
  ctx.moveTo(cx+30,cy+4); ctx.lineTo(cx+30,cy-8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-24,cy+20); ctx.lineTo(cx-24,cy+26);
  ctx.moveTo(cx+24,cy+20); ctx.lineTo(cx+24,cy+26); ctx.stroke();
}
function icoRuler(ctx,cx,cy){ icoBase(ctx);
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(-Math.PI/9);
  rr(ctx,-34,-13,68,26,4); ctx.stroke();
  for(let i=-22;i<=22;i+=11){ ctx.beginPath(); ctx.moveTo(i,-13); ctx.lineTo(i,-3); ctx.stroke(); }
  ctx.restore();
}
function icoBed(ctx,cx,cy){ icoBase(ctx);
  ctx.beginPath(); ctx.moveTo(cx-32,cy-16); ctx.lineTo(cx-32,cy+18); ctx.stroke();
  rr(ctx,cx-32,cy-2,64,18,5); ctx.stroke();
  rr(ctx,cx-26,cy-12,20,12,4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-32,cy+16); ctx.lineTo(cx-32,cy+24);
  ctx.moveTo(cx+32,cy+16); ctx.lineTo(cx+32,cy+24); ctx.stroke();
}
function icoCar(ctx,cx,cy){ icoBase(ctx);
  ctx.beginPath();
  ctx.moveTo(cx-34,cy+6); ctx.lineTo(cx-28,cy-6); ctx.lineTo(cx-14,cy-6);
  ctx.lineTo(cx-8,cy-16); ctx.lineTo(cx+14,cy-16); ctx.lineTo(cx+22,cy-6);
  ctx.lineTo(cx+30,cy-4); ctx.lineTo(cx+34,cy+2); ctx.lineTo(cx+34,cy+8);
  ctx.lineTo(cx-34,cy+8); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx-18,cy+10,7,0,7); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+18,cy+10,7,0,7); ctx.stroke();
}

/* ---------- card final ---------- */
function cardSlide(ctx){
  cover(ctx,state.photos[9],0,0,W,H);
  ctx.fillStyle="rgba(8,20,34,.12)"; ctx.fillRect(0,0,W,H);
  const cx=W/2, x=96, y=372, w=888, h=560, r=40;
  ctx.fillStyle="rgba(19,48,78,.97)"; rr(ctx,x,y,w,h,r); ctx.fill();

  ctx.textAlign="center"; ctx.textBaseline="alphabetic";
  ctx.fillStyle=WHITE; ctx.font="800 62px Arial";
  ctx.fillText(state.cT1||"", cx, y+92);
  ctx.fillText(state.cT2||"", cx, y+158);
  ctx.font="500 30px Arial"; ctx.fillStyle="#e9eef3";
  wrapCenter(ctx, state.cSub||"", cx, y+206, 720, 38);
  ctx.strokeStyle=GOLD; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(x+70,y+298); ctx.lineTo(x+w-140,y+298); ctx.stroke();
  ctx.fillStyle=GOLD; ctx.beginPath(); ctx.arc(x+w-78,y+298,30,0,7); ctx.fill();
  ctx.strokeStyle=NAVY; ctx.lineWidth=4; ctx.lineCap="round";
  ctx.beginPath(); ctx.moveTo(x+w-92,y+298); ctx.lineTo(x+w-66,y+298);
  ctx.moveTo(x+w-76,y+288); ctx.lineTo(x+w-64,y+298); ctx.lineTo(x+w-76,y+308); ctx.stroke();
  const icons=[icoSofa,icoRuler,icoBed,icoCar];
  const fy=y+380;
  for(let i=0;i<4;i++){
    const fx = x + w*(i+0.5)/4;
    icons[i](ctx,fx,fy);
    ctx.fillStyle=WHITE; ctx.font="600 25px Arial"; ctx.textAlign="center";
    wrapCenter(ctx, state.cF[i]||"", fx, fy+56, w/4-16, 30);
  }
  const pw=440, ph=84, pxx=cx-pw/2, pyy=y+h-28;
  ctx.fillStyle=GOLD; rr(ctx,pxx,pyy,pw,ph,14); ctx.fill();
  ctx.fillStyle=NAVY; ctx.font="800 52px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText(state.cPrice||"", cx, pyy+ph/2+2);
  ctx.textBaseline="alphabetic";
  if(state.logo){
    const img=state.logo, ir=img.width/img.height; let dw=380, dh=dw/ir;
    if(dh>150){ dh=150; dw=dh*ir; }
    ctx.drawImage(img, cx-dw/2, 1300-dh, dw, dh);
  }else{
    emblem(ctx, cx, 1210, 104, GOLD);
    ctx.fillStyle=WHITE; ctx.font="600 40px Georgia,'Times New Roman',serif"; ctx.textAlign="center";
    spacedCenter(ctx,"IMPERIUM",cx,1302,2);
    ctx.fillStyle=GOLD; ctx.font="500 17px Georgia,'Times New Roman',serif";
    spacedCenter(ctx,"IMÓVEIS",cx,1326,8);
  }
}
function spacedCenter(ctx,txt,cx,y,ls){ const wpx=spacedWidth(ctx,txt,ls); spaced(ctx,txt,cx-wpx/2,y,ls); }
function wrapCenter(ctx,txt,cx,y,maxw,lh){
  const words=(txt||"").split(" "); let line="", yy=y;
  for(const wd of words){
    const test=line?line+" "+wd:wd;
    if(ctx.measureText(test).width>maxw && line){ ctx.fillText(line,cx,yy); line=wd; yy+=lh; }
    else line=test;
  }
  if(line) ctx.fillText(line,cx,yy);
}

/* ---------- render ---------- */
function renderSlide(i){
  const cv=document.getElementById("cv"+i); if(!cv) return;
  const ctx=cv.getContext("2d");
  ctx.clearRect(0,0,W,H);
  if(i===9){ cardSlide(ctx); }
  else{
    cover(ctx,state.photos[i],0,0,W,H);
    logoBox(ctx, W-30-364, 30, 364, 162);
    if(i===0) banner(ctx,[state.t1a,state.t1b].filter(Boolean));
    else banner(ctx,[state.mids[i-1]||""]);
  }
}
function renderAll(){ for(let i=0;i<10;i++) renderSlide(i); }

/* ---------- download ---------- */
function fileName(i){ return `imperium-slide-${String(i+1).padStart(2,"0")}.png`; }
function toBlob(cv){ return new Promise(res=>cv.toBlob(res,"image/png")); }
async function download(i){
  const cv=document.getElementById("cv"+i);
  try{
    const blob=await toBlob(cv);
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=fileName(i);
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);
  }catch(e){ openLightbox(i); }
}
document.getElementById("dlAll").onclick=async()=>{
  for(let i=0;i<10;i++){ await download(i); await new Promise(r=>setTimeout(r,400)); }
};

async function dlCanvasEl(cv,name){
  try{
    const blob=await toBlob(cv);
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);
  }catch(e){ openLightboxCanvas(cv,name,name); }
}
async function openLightboxCanvas(cv,cap,name){
  const blob=await toBlob(cv); const url=URL.createObjectURL(blob);
  lbImg.src=url; lbLink.href=url; lbLink.download=name||"imperium.png";
  lbCap.textContent=cap; lb.style.display="flex";
}

/* ---------- lightbox ---------- */
const lb=document.getElementById("lb"), lbImg=document.getElementById("lbImg"),
      lbLink=document.getElementById("lbLink"), lbCap=document.getElementById("lbCap");
async function openLightbox(i){
  const cv=document.getElementById("cv"+i);
  const blob=await toBlob(cv); const url=URL.createObjectURL(blob);
  lbImg.src=url; lbLink.href=url; lbLink.download=fileName(i);
  lbCap.textContent=(i===9?"Slide 10 · Card":"Slide "+(i+1));
  lb.style.display="flex";
}
document.getElementById("lbClose").onclick=()=>{ lb.style.display="none"; lbImg.src=""; };
lb.onclick=e=>{ if(e.target===lb){ lb.style.display="none"; lbImg.src=""; } };

/* ---------- UI ---------- */
const grid=document.getElementById("grid");
for(let i=0;i<10;i++){
  const d=document.createElement("div"); d.className="slide";
  d.innerHTML=`<canvas id="cv${i}" width="${W}" height="${H}"></canvas>
    <div class="bar"><span>${i===9?"Slide 10 · Card":"Slide "+(i+1)}</span>
    <div class="grp2"><button data-open="${i}">Abrir</button>
    <button data-dl="${i}">Baixar</button></div></div>`;
  grid.appendChild(d);
}
grid.querySelectorAll("button[data-dl]").forEach(b=>b.onclick=()=>download(+b.dataset.dl));
grid.querySelectorAll("button[data-open]").forEach(b=>b.onclick=()=>openLightbox(+b.dataset.open));

const midWrap=document.getElementById("midInputs");
for(let i=0;i<8;i++){
  const l=document.createElement("label"); l.textContent="Slide "+(i+2);
  const inp=document.createElement("input"); inp.type="text"; inp.value=state.mids[i];
  inp.oninput=()=>{ state.mids[i]=inp.value; renderSlide(i+1); };
  midWrap.appendChild(l); midWrap.appendChild(inp);
}

function bind(id,key,slides){
  const el=document.getElementById(id);
  state[key]=el.value;
  el.oninput=()=>{ state[key]=el.value; slides.forEach(renderSlide); };
}
bind("t1a","t1a",[0]); bind("t1b","t1b",[0]);
bind("cT1","cT1",[9]); bind("cT2","cT2",[9]); bind("cSub","cSub",[9]); bind("cPrice","cPrice",[9]);
["cF1","cF2","cF3","cF4"].forEach((id,idx)=>{
  const el=document.getElementById(id); state.cF[idx]=el.value;
  el.oninput=()=>{ state.cF[idx]=el.value; renderSlide(9); };
});

/* ---------- fotos ---------- */
const thumbs=document.getElementById("thumbs");
const slotInput=document.getElementById("slotInput");
let slotTarget=-1;
function loadToSlot(file,idx){
  const img=new Image();
  img.onload=()=>{ state.photos[idx]=img; drawThumbs(); renderSlide(idx); };
  img.onerror=()=>{ alert("Não foi possível carregar uma das imagens."); };
  img.src=URL.createObjectURL(file);
}
function move(i,dir){
  const j=i+dir; if(j<0||j>9) return;
  [state.photos[i],state.photos[j]]=[state.photos[j],state.photos[i]];
  drawThumbs(); renderSlide(i); renderSlide(j);
}
function removeSlot(i){ state.photos[i]=null; drawThumbs(); renderSlide(i); }
function drawThumbs(){
  thumbs.innerHTML="";
  for(let i=0;i<10;i++){
    const has=!!state.photos[i];
    const t=document.createElement("div");
    t.className="t"+(i===9?" card":"")+(has?"":" empty");
    if(has) t.style.backgroundImage=`url(${state.photos[i].src})`;
    t.innerHTML=`<span class="idx">${i===9?"10·CARD":i+1}</span>`;
    if(has){
      const ctl=document.createElement("div"); ctl.className="ctl";
      ctl.innerHTML=`<button title="Mover para trás">◀</button>
        <button class="rm" title="Remover">✕</button>
        <button title="Mover para frente">▶</button>`;
      const [b1,brm,b2]=ctl.querySelectorAll("button");
      b1.onclick=ev=>{ev.stopPropagation();move(i,-1);};
      b2.onclick=ev=>{ev.stopPropagation();move(i,1);};
      brm.onclick=ev=>{ev.stopPropagation();removeSlot(i);};
      t.appendChild(ctl);
    }
    t.onclick=()=>{ slotTarget=i; slotInput.value=""; slotInput.click(); };
    thumbs.appendChild(t);
  }
}
slotInput.onchange=e=>{ const f=e.target.files[0]; if(f&&slotTarget>=0) loadToSlot(f,slotTarget); };
document.getElementById("photos").onchange=e=>{
  for(const f of [...e.target.files]){
    const idx=state.photos.indexOf(null);
    if(idx<0){ alert("Os 10 slots já estão preenchidos. Remova uma foto para adicionar outra."); break; }
    loadToSlot(f,idx);
  }
  e.target.value="";
};

/* ========================================================================
   POST ÚNICO (aba informativa)
   ======================================================================== */
const sState={ tag:"Capão da Canoa",
  head:"Praça Flávio Boianovski passará por revitalização de R$750.000,00 em Capão da Canoa",
  btn:"Leia a legenda", photo:null };

function wrapLines(ctx,txt,maxw){
  const words=(txt||"").split(/\s+/).filter(Boolean); let line="", out=[];
  for(const w of words){ const t=line?line+" "+w:w;
    if(ctx.measureText(t).width>maxw && line){ out.push(line); line=w; } else line=t; }
  if(line) out.push(line); return out;
}

function avgColor(img){
  try{
    const c=document.createElement("canvas"); c.width=24; c.height=24;
    const g=c.getContext("2d"); g.drawImage(img,0,0,24,24);
    const d=g.getImageData(0,0,24,24).data;
    let r=0,gg=0,b=0,n=0;
    for(let i=0;i<d.length;i+=4){ r+=d[i]; gg+=d[i+1]; b+=d[i+2]; n++; }
    return [r/n, gg/n, b/n];
  }catch(e){ return [26,28,34]; }
}

function drawSingle(){
  const cv=document.getElementById("cvS"); if(!cv) return;
  const ctx=cv.getContext("2d");
  ctx.clearRect(0,0,W,H);

  // ---- FUNDO: a própria foto em cover, borrada e escurecida (preenche tudo) ----
  if(sState.photo){
    ctx.save();
    ctx.fillStyle="#0a0c0e"; ctx.fillRect(0,0,W,H);
    ctx.filter="blur(36px)";
    cover(ctx, sState.photo, -60, -60, W+120, H+120);
    ctx.filter="none";
    ctx.restore();
    ctx.fillStyle="rgba(6,8,10,0.50)"; ctx.fillRect(0,0,W,H);
  } else {
    cover(ctx, null, 0,0,W,H);
  }

  // ---- FOTO NÍTIDA em largura cheia, abaixo do cabeçalho ----
  const bandTop=176, bandMaxBot=912;
  let photoBottom=bandMaxBot;
  if(sState.photo){
    const img=sState.photo, natH=W*img.height/img.width;
    if(natH <= bandMaxBot-bandTop){ ctx.drawImage(img,0,bandTop,W,natH); photoBottom=bandTop+natH; }
    else { cover(ctx,img,0,bandTop,W,bandMaxBot-bandTop); photoBottom=bandMaxBot; }
  }

  // etiqueta (pill dourada, canto superior esquerdo)
  ctx.textBaseline="middle"; ctx.textAlign="left";
  ctx.font="800 34px Arial";
  const tag=sState.tag||""; const tpad=28, tph=64, ttop=40;
  const tw=ctx.measureText(tag).width;
  ctx.fillStyle=GOLD; rr(ctx,40,ttop,tw+tpad*2,tph,tph/2); ctx.fill();
  ctx.fillStyle=NAVY; ctx.fillText(tag,40+tpad,ttop+tph/2+2);

  // logo padrão, canto superior direito
  logoBox(ctx, W-40-300, 30, 300, 132);

  // ---- manchete: calcula tamanho/linhas; começa sempre ABAIXO da foto ----
  const hx=44, hMaxW=W-88, btop=1256, hFloor=btop-34, hCeil=photoBottom+26;
  let size=92, lines=[];
  for(; size>=30; size-=2){
    ctx.font=`900 ${size}px Arial`;
    lines=wrapLines(ctx, sState.head, hMaxW);
    if(lines.length*(size*1.05) <= (hFloor-hCeil)) break;
  }
  const lh=size*1.05, totalH=lines.length*lh, startY=hFloor-totalH;

  // ---- reforço escuro atrás do texto (o fundo já é a foto borrada) ----
  const base = sState.photo ? avgColor(sState.photo) : [24,26,32];
  const r=Math.round(base[0]*0.14), g=Math.round(base[1]*0.14), b=Math.round(base[2]*0.14);
  const scrimTop=Math.max(photoBottom-6, startY-70);
  const grad=ctx.createLinearGradient(0, scrimTop, 0, H);
  grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
  grad.addColorStop(0.4, `rgba(${r},${g},${b},0.80)`);
  grad.addColorStop(1,   `rgba(${r},${g},${b},0.96)`);
  ctx.fillStyle=grad; ctx.fillRect(0, scrimTop, W, H-scrimTop);

  // ---- manchete branca por cima do degradê ----
  ctx.font=`900 ${size}px Arial`; ctx.textAlign="left"; ctx.textBaseline="top";
  ctx.shadowColor="rgba(0,0,0,0.5)"; ctx.shadowBlur=8; ctx.shadowOffsetY=2;
  ctx.fillStyle="#ffffff";
  lines.forEach((ln,i)=>ctx.fillText(ln, hx, startY+i*lh));
  ctx.shadowColor="transparent"; ctx.shadowBlur=0; ctx.shadowOffsetY=0;

  // ---- botão inferior (pill dourada) + mãozinha, texto branco ----
  ctx.font="800 32px Arial"; ctx.textBaseline="middle"; ctx.textAlign="left";
  const bt=sState.btn||""; const bpad=26, bph=60;
  const btw=ctx.measureText(bt).width;
  ctx.fillStyle=GOLD; rr(ctx,40,btop,btw+bpad*2,bph,bph/2); ctx.fill();
  ctx.fillStyle="#ffffff";
  ctx.fillText(bt,40+bpad,btop+bph/2+2);
  ctx.font="46px Arial";
  ctx.fillText("👇", 40+btw+bpad*2+16, btop+bph/2+2);
}

/* abas */
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  const v=t.dataset.tab;
  document.getElementById("viewCarousel").style.display = v==="carousel"?"":"none";
  document.getElementById("viewSingle").style.display   = v==="single"?"":"none";
  if(v==="single") drawSingle();
});

/* controles do post único */
function bindS(id,key){ const el=document.getElementById(id); sState[key]=el.value;
  el.oninput=()=>{ sState[key]=el.value; drawSingle(); }; }
bindS("sTag","tag"); bindS("sHead","head"); bindS("sBtn","btn");
document.getElementById("sPhoto").onchange=e=>{
  const f=e.target.files[0]; if(!f) return;
  const img=new Image(); img.onload=()=>{ sState.photo=img; drawSingle(); };
  img.onerror=()=>alert("Não foi possível carregar a foto.");
  img.src=URL.createObjectURL(f);
};
document.getElementById("sDl").onclick=()=>dlCanvasEl(document.getElementById("cvS"),"imperium-post.png");
document.getElementById("sOpen").onclick=()=>openLightboxCanvas(document.getElementById("cvS"),"Post único","imperium-post.png");

/* ---------- logo: recorte inteligente (transparência OU fundo sólido) ---------- */
function trimLogo(img){
  const c=document.createElement("canvas"); c.width=img.width; c.height=img.height;
  const g=c.getContext("2d"); g.drawImage(img,0,0);
  const Wc=c.width, Hc=c.height;
  let d; try{ d=g.getImageData(0,0,Wc,Hc).data; }catch(e){ return img; }
  const at=(x,y)=>{ const i=(y*Wc+x)*4; return [d[i],d[i+1],d[i+2],d[i+3]]; };
  // cor de fundo estimada pelos 4 cantos
  const corners=[at(1,1),at(Wc-2,1),at(1,Hc-2),at(Wc-2,Hc-2)];
  const bg=corners[0];
  const bgOpaque=corners.every(c=>c[3]>200);
  const isBg=(x,y)=>{ const [r,gg,b,a]=at(x,y);
    if(a<16) return true;
    if(bgOpaque){ return Math.abs(r-bg[0])<16 && Math.abs(gg-bg[1])<16 && Math.abs(b-bg[2])<16; }
    return false;
  };
  let minX=Wc,minY=Hc,maxX=0,maxY=0,found=false;
  for(let y=0;y<Hc;y++) for(let x=0;x<Wc;x++){
    if(!isBg(x,y)){ found=true;
      if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
  }
  if(!found) return img;
  const w=maxX-minX+1, h=maxY-minY+1;
  const out=document.createElement("canvas"); out.width=w; out.height=h;
  out.getContext("2d").drawImage(c,minX,minY,w,h,0,0,w,h);
  return out;
}
function setLogo(img){
  state.logo=trimLogo(img);
  renderAll();
  drawSingle();
}
document.getElementById("logo").onchange=e=>{
  const f=e.target.files[0]; if(!f) return;
  const img=new Image();
  img.onload=()=>setLogo(img);
  img.onerror=()=>alert("Não foi possível carregar o logo.");
  img.src=URL.createObjectURL(f);
};

/* logo padrão: usa a versão embutida (data URL, não contamina o canvas e
   funciona mesmo abrindo o arquivo direto). Cai para logo.png / vetorial. */
(function(){
  const img=new Image();
  img.onload=()=>setLogo(img);
  img.onerror=()=>{
    const f=new Image();
    f.onload=()=>setLogo(f);
    f.onerror=()=>renderAll();
    f.src="logo.png";
  };
  img.src = window.LOGO_DATA_URL || "logo.png";
})();

/* emblema do topo da barra lateral */
(function(){ const c=document.getElementById("brandEm"); emblem(c.getContext("2d"),34,44,80,GOLD); })();

drawThumbs(); renderAll(); drawSingle();

/* abrir direto numa aba via ?tab=single */
if(new URLSearchParams(location.search).get("tab")==="single"){
  const t=document.querySelector('.tab[data-tab="single"]'); if(t) t.click();
}
