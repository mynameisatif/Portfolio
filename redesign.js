(()=>{
const d=document,root=d.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
root.classList.add('js');
const themeToggle=d.getElementById('themeToggle');
function setTheme(theme,persist){
root.dataset.theme=theme;
if(themeToggle)themeToggle.setAttribute('aria-pressed',String(theme==='light'));
if(persist){
try{localStorage.setItem('portfolio-theme',theme)}
catch(error){console.warn('Could not save the theme preference.',error)}
}}
let savedTheme;
try{savedTheme=localStorage.getItem('portfolio-theme')}
catch(error){console.warn('Could not read the saved theme preference.',error)}
setTheme(savedTheme==='light'?'light':'dark',false);
if(themeToggle)themeToggle.addEventListener('click',()=>setTheme(root.dataset.theme==='light'?'dark':'light',true));
const projectItems=[...d.querySelectorAll('#projects .project, #projects .case-panel')],projectsToggle=d.getElementById('projectsToggle');
if(projectsToggle&&projectItems.length>3){
const hiddenProjects=projectItems.slice(3);
hiddenProjects.forEach(project=>project.hidden=true);
projectsToggle.hidden=false;
projectsToggle.addEventListener('click',()=>{
const expanded=projectsToggle.getAttribute('aria-expanded')==='true';
hiddenProjects.forEach(project=>project.hidden=expanded);
projectsToggle.setAttribute('aria-expanded',String(!expanded));
projectsToggle.textContent=expanded?'View more projects':'Show fewer projects';
});
}
const navToggle=d.getElementById('navToggle'),siteNav=d.getElementById('siteNav');
function setMenu(open){
if(!navToggle||!siteNav)return;
navToggle.classList.toggle('open',open);
navToggle.setAttribute('aria-expanded',String(open));
navToggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
siteNav.classList.toggle('open',open);
siteNav.setAttribute('aria-hidden',String(!open));
siteNav.inert=!open;
}
if(navToggle&&siteNav){
navToggle.addEventListener('click',()=>setMenu(navToggle.getAttribute('aria-expanded')!=='true'));
siteNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
d.addEventListener('pointerdown',event=>{if(!siteNav.contains(event.target)&&!navToggle.contains(event.target))setMenu(false)});
d.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});
}
const ready=()=>d.body.classList.add('ready'),ws=d.getElementById('welcome-screen');
if(ws){
let welcomeSeen=false;
try{welcomeSeen=sessionStorage.getItem('portfolio-welcome-seen')==='true'}
catch(error){console.warn('Could not read the welcome-screen state.',error)}
if(welcomeSeen){ws.classList.add('hidden');ready()}
else{
try{sessionStorage.setItem('portfolio-welcome-seen','true')}
catch(error){console.warn('Could not save the welcome-screen state.',error)}
const word=d.getElementById('welcomeWord');
const greetings=[
['Welcome','en'],['स्वागत है','hi'],['સ્વાગત છે','gu'],['স্বাগতম','bn'],
['ସ୍ୱାଗତ','or'],['ಸ್ವಾಗತ','kn'],['സ്വാഗതം','ml'],['ಸ್ವಾಗತ','kn'],
['స్వాగతం','te'],['স্বাগতম','bn'],['ସ୍ୱାଗତ','or'],['ಸ್ವಾಗತ','kn'],
['സ്വാഗതം','ml'],['स्वागतम्','sa'],['Welcome','en']
];
let greetingIndex=0;
const greetingTimer=setInterval(()=>{
greetingIndex=(greetingIndex+1)%greetings.length;
if(word){word.textContent=greetings[greetingIndex][0];word.lang=greetings[greetingIndex][1]}
},200);
setTimeout(()=>{clearInterval(greetingTimer);ws.classList.add('hidden');ready()},3000);
}
}else ready();
/* floating 3D elements */
const floats=[];
const mk=(host,kind,s,pos,depth)=>{const w=d.createElement('div');w.className='float';Object.assign(w.style,pos);w.style.setProperty('--s',s+'px');w.dataset.depth=depth;
w.innerHTML=kind==='cube'?'<div class="cube">'+'<i></i>'.repeat(6)+'</div>':'<div class="'+kind+'"></div>';host.appendChild(w);floats.push(w)};
const hl=d.querySelector('.hero2 .float-layer'),about=d.getElementById('about');
if(hl){mk(hl,'cube',90,{left:'6%',top:'38%'},1.2);mk(hl,'ring',130,{right:'7%',top:'34%'},-1);mk(hl,'orb',46,{right:'22%',bottom:'30%'},.8);mk(hl,'orb',26,{left:'20%',bottom:'24%'},-1.4)}
if(about){const l=d.createElement('div');l.className='float-layer';l.setAttribute('aria-hidden','true');about.prepend(l);mk(l,'cube',70,{right:'6%',top:'10%'},1);mk(l,'ring',100,{left:'4%',bottom:'12%'},-1)}
/* char-by-char scroll reveal */
const reveals=[...d.querySelectorAll('.about-text p')].map(p=>{const t=p.textContent;p.setAttribute('aria-label',t);p.textContent='';const cs=[];
t.split(' ').forEach((w,wi,arr)=>{const ws=d.createElement('span');ws.className='w';ws.setAttribute('aria-hidden','true');[...w].forEach(ch=>{const c=d.createElement('span');c.className='c';c.textContent=ch;ws.appendChild(c);cs.push(c)});p.appendChild(ws);if(wi<arr.length-1)p.appendChild(d.createTextNode(' '))});return{p,cs}});
const h1=d.querySelector('.hero2 h1');
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
let tick=false;
function update(){tick=false;const y=scrollY,vh=innerHeight;
if(!rm){reveals.forEach(({p,cs})=>{const r=p.getBoundingClientRect(),pr=cl((vh*.8-r.top)/(vh*.6+r.height)),n=cs.length;cs.forEach((c,i)=>{c.style.opacity=(.2+.8*cl((pr-i/n)*n)).toFixed(2)})});
if(h1&&y<vh)h1.style.transform=`translateY(${y*.15}px)`;
floats.forEach(f=>{if(f.closest('.hero2'))f.style.setProperty('--sy',y*f.dataset.depth*.06+'px')})}}
const req=()=>{if(!tick){tick=true;requestAnimationFrame(update)}};
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);update();
/* pointer: portrait tilt + light, floating parallax */
const card=d.querySelector('.portrait-card');
if(fine&&!rm){let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;
if(card){const r=card.getBoundingClientRect();card.style.transform=`rotateY(${mx*10}deg) rotateX(${-my*7}deg)`;card.style.setProperty('--mx',cl((e.clientX-r.left)/r.width)*100+'%');card.style.setProperty('--my',cl((e.clientY-r.top)/r.height)*100+'%')}
floats.forEach(f=>{f.style.translate=`${mx*f.dataset.depth*40}px ${my*f.dataset.depth*40+(parseFloat(f.style.getPropertyValue('--sy'))||0)}px`})},{passive:true})}
})();
