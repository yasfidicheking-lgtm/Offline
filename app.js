import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* config */
const firebaseConfig = {
apiKey:"PUT",
authDomain:"PUT",
databaseURL:"PUT",
projectId:"PUT",
storageBucket:"PUT",
messagingSenderId:"PUT",
appId:"PUT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* بيانات */
let username="";
let type="";
let chattingWith="";

/* اختيار الحساب */
window.chooseType=function(t){
type=t;
username=prompt("دخل اسمك");
document.getElementById("loginBox").style.display="none";
loadWorkers();
}

/* الحرفيين */
function loadWorkers(){
const workers=[
{name:"محمد",job:"بلومبي",price:100},
{name:"سعيد",job:"نجار",price:150},
{name:"يوسف",job:"بناي",price:200}
];

const container=document.getElementById("cards");
container.innerHTML="";

workers.forEach(w=>{
const div=document.createElement("div");
div.className="card";
div.dataset.job=w.job;

div.innerHTML=`
<h3>${w.name}</h3>
<p>${w.job}</p>
<span>${w.price} درهم</span><br>
<button onclick="openChat('${w.name}')">مراسلة</button>
`;

container.appendChild(div);
});
}

/* فلترة */
window.filterCards=function(){
let value=document.getElementById("search").value.toLowerCase();
document.querySelectorAll(".card").forEach(card=>{
card.style.display=
card.dataset.job.toLowerCase().includes(value)
?"block":"none";
});
}

/* فتح شات */
window.openChat=function(name){
chattingWith=name;
document.getElementById("chatName").innerText=name;
document.getElementById("chatBox").classList.remove("hidden");
}

/* غلق */
window.closeChat=function(){
document.getElementById("chatBox").classList.add("hidden");
}

/* ارسال */
window.sendMsg=function(){
let input=document.getElementById("msg");
if(input.value==="") return;

push(ref(db,"messages"),{
from:username,
to:chattingWith,
text:input.value
});

input.value="";
}

/* استقبال */
onChildAdded(ref(db,"messages"),snap=>{
let m=snap.val();

if(
(m.from===username && m.to===chattingWith)||
(m.to===username && m.from===chattingWith)
){
let div=document.createElement("div");
div.className="msg";
div.innerText=m.from+": "+m.text;
document.getElementById("messages").appendChild(div);
}
});
