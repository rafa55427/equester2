const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const btnE = document.getElementById('btn-equester');
const btnD = document.getElementById('btn-desqueter');
let mode='equester';

btnE.onclick=()=>switchMode('equester');
btnD.onclick=()=>switchMode('desqueter');

function switchMode(m){
  mode=m;
  btnE.classList.toggle('active',mode==='equester');
  btnD.classList.toggle('active',mode==='desqueter');
  append('⚡ Modo '+mode.toUpperCase()+' ativado','ai');
}

function append(txt,s){
  const d=document.createElement('div');
  d.className=`message ${s}`;
  d.textContent=txt;
  chatContainer.appendChild(d);
  chatContainer.scrollTop=chatContainer.scrollHeight;
}

document.getElementById('send-btn').onclick=send;
userInput.addEventListener('keydown',e=>e.key==='Enter'&&send());

function send(){
  const t=userInput.value.trim();
  if(!t)return;
  append(t,'user');
  userInput.value='';
  append('⌛ Processando...','ai');
  fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,mode})})
    .then(r=>r.json()).then(data=>{
      const ais=document.querySelectorAll('.message.ai');
      ais[ais.length-1].textContent=data.reply;
    }).catch(()=>{
      const ais=document.querySelectorAll('.message.ai');
      ais[ais.length-1].textContent='Erro ao conectar com a IA.';
    });
}

document.getElementById('save-btn').onclick=()=>{
  localStorage.setItem('chat',chatContainer.innerHTML);
  alert('Conversa salva!');
};

document.getElementById('clear-btn').onclick=()=>{
  if(confirm('Limpar chat?')){
    chatContainer.innerHTML=''; localStorage.removeItem('chat');
  }
};

document.getElementById('export-btn').onclick=()=>{
  const text=[...chatContainer.children].map(el=>el.textContent).join('\n\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));
  a.download='conversa_equester.txt';
  a.click();
};

window.onload=()=>{
  const saved=localStorage.getItem('chat');
  if(saved)chatContainer.innerHTML=saved;
  switchMode('equester');
};