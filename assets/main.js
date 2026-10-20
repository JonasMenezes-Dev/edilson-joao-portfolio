(function(){
var N="5511915136969",M={
geral:"Olá, Edilson! Encontrei seu site e gostaria de solicitar um orçamento para um serviço de gesso, drywall ou acabamento. Vou enviar fotos e informações do projeto.",
especial:"Olá, Edilson! Gostaria de conversar sobre um projeto personalizado de gesso ou drywall. Tenho algumas referências e gostaria de enviar para avaliação.",
empresa:"Olá, Edilson! Represento uma empresa e gostaria de conversar sobre a execução de serviços de gesso, drywall ou estruturas metálicas em um projeto."};
function wa(t){return"https://wa.me/"+N+"?text="+encodeURIComponent(t)}
document.querySelectorAll("a.wa").forEach(function(a){a.href=wa(M[a.dataset.msg]||M.geral);a.target="_blank";a.rel="noopener"});
document.getElementById("y").textContent=new Date().getFullYear();
var rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
/* cabeçalho e menu */
var h=document.querySelector("header"),b=document.querySelector(".burger"),u=document.getElementById("menu");
function sc(){h.classList.toggle("sc",scrollY>8)}addEventListener("scroll",sc,{passive:true});sc();
function setMenu(open){u.classList.toggle("open",open);b.setAttribute("aria-expanded",String(open));b.setAttribute("aria-label",open?"Fechar menu":"Abrir menu")}
b.addEventListener("click",function(){setMenu(!u.classList.contains("open"))});
u.addEventListener("click",function(e){if(e.target.closest("a"))setMenu(false)});
document.addEventListener("click",function(e){if(!h.contains(e.target))setMenu(false)});
matchMedia("(min-width:981px)").addEventListener("change",function(e){if(e.matches)setMenu(false)});
/* Permite fechar o menu móvel pelo teclado. */
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&u.classList.contains("open")){setMenu(false);b.focus()}});
/* entrada ao rolar */
var rv=document.querySelectorAll(".rv");
if("IntersectionObserver" in window&&!rm){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});rv.forEach(function(e){io.observe(e)})}
/* contagem dos 25 anos */
var c=document.getElementById("cnt");
if(!rm){var t0=null;c.textContent="0";setTimeout(function(){requestAnimationFrame(function s(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1);c.textContent=Math.round(25*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})},500)}
/* Portfólio: fotografias reais e categorias existentes. */
var cats=["Sancas e forros","Drywall e estruturas"];
/* "src" é o nome base do arquivo em assets/ (sem sufixo de tamanho). */
var items=[
{cats:[cats[0]],title:"Sanca redonda com forro modular",src:"sanca-redonda-forro-placas",max:800,alt:"Sanca redonda em gesso com forro modular iluminado"},
{cats:[cats[1]],title:"Instalação de placa de drywall",src:"instalacao-drywall-estrutura-metalica",max:1600,alt:"Edilson João instalando placa de gesso acartonado em parede com estrutura metálica e lã mineral"},
{cats:[cats[0]],title:"Sanca curva com iluminação",src:"sanca-curva-ponto-luz",max:800,alt:"Sanca curva em gesso com ponto de luz no forro"},
{cats:[cats[0]],title:"Sanca curva e forro rebaixado",src:"forro-sanca-curva-rebaixado",max:800,alt:"Forro de gesso com sanca curva, forro rebaixado e iluminação embutida"},
{cats:[cats[0]],title:"Sanca fechada no corredor",src:"forro-sanca-fechada-corredor",max:800,alt:"Forro de gesso com sanca fechada e ponto de luz no corredor"},
{cats:[cats[1]],title:"Divisória de drywall com aberturas",src:"divisoria-drywall-aberturas",max:800,alt:"Divisória de drywall com vãos de passagem e porta, forro de gesso ao fundo"},
{cats:[cats[1]],title:"Parede de drywall com estrutura metálica",src:"estrutura-metalica-drywall-osb",max:800,alt:"Estrutura metálica de parede de drywall com reforços em OSB"},
{cats:[cats[0]],title:"Forro de gesso e pilar revestido",src:"forro-pilar-trilho-luz",max:800,alt:"Forro de gesso com trilho de iluminação e pilar revestido com porta de madeira"},
{cats:[cats[1]],title:"Massa e tratamento de juntas",src:"massa-juntas-cantos",max:800,alt:"Parede de gesso com juntas e cantos tratados com massa"},
{cats:[cats[0]],title:"Sanca aberta com forro iluminado",src:"sanca-aberta-forro-iluminado",max:800,alt:"Sanca aberta em gesso com forro central iluminado sobre a área de convivência"}];
/* Monta o <picture> com os tamanhos que existem para aquela foto. */
function img(it,carregamento){var s="";
if(it.max>=800)s+='<source media="(max-width:640px)" srcset="assets/'+it.src+'-480.webp">';
if(it.max>=1600)s+='<source media="(max-width:1100px)" srcset="assets/'+it.src+'-800.webp">';
return '<picture>'+s+'<img src="assets/'+it.src+'-'+it.max+'.webp" alt="'+it.alt+'" width="'+it.max+'" height="'+Math.round(it.max*4/3)+'" loading="'+carregamento+'" decoding="async"></picture>'}
var F=document.querySelector(".filters"),G=document.querySelector(".gallery"),cur="Todos",vis=[],pos=0;
function draw(){G.innerHTML="";G.classList.toggle("filtered",cur!=="Todos");vis=[];items.forEach(function(it){if(cur!=="Todos"&&it.cats.indexOf(cur)<0)return;
var k=vis.push(it)-1,e=document.createElement("button");e.type="button";e.className="pf";e.setAttribute("aria-label","Ampliar: "+it.alt);
e.innerHTML=img(it,"lazy")+'<span class="pf-tag">'+it.title+'</span><span class="pf-zoom" aria-hidden="true">⤢</span>';
e.onclick=function(){openLb(k)};G.appendChild(e)});document.getElementById("gallery-count").textContent=vis.length+" trabalhos · "+cur}
["Todos"].concat(cats).forEach(function(n){var k=document.createElement("button");k.type="button";k.textContent=n;k.setAttribute("aria-pressed",n==="Todos");k.onclick=function(){cur=n;F.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===k)});draw()};F.appendChild(k)});
/* lightbox: legenda, anterior/próxima, setas do teclado e deslize no celular */
var L=document.getElementById("lb"),LI=L.querySelector("img"),LT=document.getElementById("lb-t"),LN=document.getElementById("lb-n");
function showLb(i){pos=(i+vis.length)%vis.length;var it=vis[pos];LI.src="assets/"+it.src+"-"+it.max+".webp";LI.alt=it.alt;LT.textContent=it.title;LN.textContent=(pos+1)+" de "+vis.length;L.classList.toggle("one",vis.length<2)}
function openLb(i){showLb(i);L.showModal()}
L.querySelector(".lb-x").onclick=function(){L.close()};
L.querySelector(".lb-prev").onclick=function(){showLb(pos-1)};
L.querySelector(".lb-next").onclick=function(){showLb(pos+1)};
L.addEventListener("click",function(e){if(e.target===L||e.target.tagName==="FIGURE")L.close()});
L.addEventListener("keydown",function(e){
if(e.key==="ArrowLeft"){e.preventDefault();showLb(pos-1)}
if(e.key==="ArrowRight"){e.preventDefault();showLb(pos+1)}
if(e.key==="Tab"){
var controls=Array.from(L.querySelectorAll("button")).filter(function(button){return button.getClientRects().length>0}),first=controls[0],last=controls[controls.length-1];
if(e.shiftKey&&(document.activeElement===first||document.activeElement===L)){e.preventDefault();last.focus()}
else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}
});
var sx=null;L.addEventListener("touchstart",function(e){sx=e.touches[0].clientX},{passive:true});
L.addEventListener("touchend",function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)showLb(pos+(dx<0?1:-1))});
draw();
/* esconde o botão flutuante quando o contato já está na tela */
var fab=document.querySelector(".fab"),ct=document.getElementById("contato");
if("IntersectionObserver" in window&&fab&&ct){new IntersectionObserver(function(es){fab.classList.toggle("off",es[0].isIntersecting)},{threshold:.2}).observe(ct)}
/* formulário */
var f=document.getElementById("orc"),er=document.getElementById("err");
f.addEventListener("submit",function(e){e.preventDefault();
f.querySelectorAll("[aria-invalid]").forEach(function(x){x.removeAttribute("aria-invalid")});
var d=new FormData(f),n=d.get("nome").trim(),tel=d.get("tel").trim(),t=tel.replace(/\D/g,""),l=d.get("local").trim(),s=d.get("servico"),x=d.get("desc").trim(),bad=[];
if(!n)bad.push("nome");if(t.length<10)bad.push("tel");if(!l)bad.push("local");if(!s)bad.push("servico");if(!x)bad.push("desc");
if(bad.length){bad.forEach(function(k){f.elements[k].setAttribute("aria-invalid","true")});f.elements[bad[0]].focus();
er.textContent=bad.indexOf("tel")>-1&&bad.length===1?"Informe um telefone com DDD, por exemplo 11 91234-5678.":"Preencha os campos destacados: nome, telefone com DDD, cidade e bairro, tipo de serviço e descrição.";return}
er.textContent="";var med=d.get("med").trim();
var m="Olá, Edilson! Meu nome é "+n+". Gostaria de um orçamento.\nServiço: "+s+"\nLocal da obra: "+l+"\nDescrição: "+x+(med?"\nMedidas: "+med:"")+"\nMeu contato: "+tel+"\nVou enviar as fotos do local nesta conversa.";
window.open(wa(m),"_blank","noopener")});
})();
