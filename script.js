const products = [
  {id:1,name:"Blind Date with a Book",category:"The reader favorite",description:"A wrapped-up story chosen to surprise you. Genre clues included.",price:7.00,emoji:"📚",tag:"Mystery date"},
  {id:2,name:"Blind Date with a Craft",category:"A creative little escape",description:"A small hands-on surprise for a cozy night in or a crafty date.",price:6.00,emoji:"🎨",tag:"Make something"},
  {id:3,name:"A Book of Your Own",category:"Individual books",description:"A handpicked individual read for your next quiet evening or reading-list adventure.",price:8.00,emoji:"📖",tag:"Just one more chapter"},
  {id:4,name:"Reader's Mystery Bundle",category:"A thoughtful surprise",description:"A bookish bundle with room for a surprise read, a tiny treasure, and a little magic.",price:12.00,emoji:"🎁",tag:"Bundle"}
];
let cart = [];
const productGrid = document.getElementById("productGrid");
const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
function renderProducts(){
  productGrid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-art"><span class="product-tag">${p.tag}</span><span class="emoji" aria-hidden="true">${p.emoji}</span></div>
      <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">Add to bag +</button></div>
      </div>
    </article>`).join("");
}
function addToCart(id){const product=products.find(p=>p.id===id);const line=cart.find(x=>x.id===id);if(line)line.qty++;else cart.push({...product,qty:1});renderCart();document.getElementById("cartCount").textContent=cart.reduce((s,p)=>s+p.qty,0);}
function renderCart(){
  const items=document.getElementById("cartItems");
  items.innerHTML=cart.length?cart.map(p=>`<div class="cart-line"><div><strong>${p.name}</strong><small>Qty: ${p.qty} · ${money(p.price)} each</small><button data-remove="${p.id}">Remove one</button></div><strong>${money(p.price*p.qty)}</strong></div>`).join(""):'<p class="small-note">Your bag is waiting for a little adventure.</p>';
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,p)=>s+p.price*p.qty,0));
}
productGrid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(!b)return;const line=cart.find(p=>p.id===Number(b.dataset.remove));if(line.qty>1)line.qty--;else cart=cart.filter(p=>p.id!==line.id);renderCart();document.getElementById("cartCount").textContent=cart.reduce((s,p)=>s+p.qty,0);});
const backdrop=document.getElementById("cartBackdrop");
document.getElementById("openCart").addEventListener("click",()=>{backdrop.hidden=false;});
document.getElementById("closeCart").addEventListener("click",()=>{backdrop.hidden=true;});
backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.hidden=true;});
document.getElementById("orderButton").addEventListener("click",()=>{
  const message=document.getElementById("orderMessage");
  if(!cart.length){message.textContent="Add something to your bag first!";return;}
  message.textContent="Your bag works! Before launch, we’ll connect this button to your business email or a free order form. No payment has been taken.";
});
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("mainNav");const open=nav.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("mainNav").classList.remove("open");document.getElementById("menuToggle").setAttribute("aria-expanded","false");}));

const steps=[...document.querySelectorAll(".quiz-step")];let step=0;
const next=document.getElementById("quizNext"),back=document.getElementById("quizBack"),result=document.getElementById("quizResult");
function updateQuiz(){steps.forEach((s,i)=>s.classList.toggle("active",i===step));document.getElementById("quizStepLabel").textContent=`QUESTION ${step+1} OF ${steps.length}`;document.getElementById("progressBar").style.width=`${((step+1)/steps.length)*100}%`;back.disabled=step===0;next.textContent=step===steps.length-1?"Find my match ✦":"Next question →";}
back.addEventListener("click",()=>{if(step>0){step--;result.hidden=true;updateQuiz();}});
next.addEventListener("click",()=>{
  const active=steps[step];if(!active.querySelector('input:checked')){active.querySelector("input").focus();active.querySelector("legend").insertAdjacentText("beforeend"," — choose one to continue.");return;}
  if(step<steps.length-1){step++;updateQuiz();return;}
  const genre=document.querySelector('input[name="genre"]:checked').value;
  const mood=document.querySelector('input[name="mood"]:checked').value;
  const spice=document.querySelector('input[name="spice"]:checked').value;
  const recs={
    romance:["Your soft-hearted story date","Look for romance, second chances, and characters who make your heart do a little flip."],
    mystery:["Your secret-filled story date","Look for hidden histories, suspicious clues, and stories that keep you guessing."],
    fantasy:["Your other-worldly story date","Look for immersive settings, magic, strange creatures, and a little wonder."],
    literary:["Your thoughtful story date","Look for character-driven fiction, complicated families, and stories that linger."]
  };
  const moodNote={cozy:"Cozy and comforting",dark:"Dark and twisty",emotional:"Emotionally layered",adventurous:"Fast-paced and adventurous"}[mood];
  const spiceNote={sweet:"Sweet / closed-door",some:"Some heat is okay",any:"No spice preference"}[spice];
  result.innerHTML=`<h3>${recs[genre][0]} ✦</h3><p>${recs[genre][1]}</p><p><strong>Your vibe:</strong> ${moodNote} · <strong>Romance preference:</strong> ${spiceNote}</p><p>When the real inventory is added, this quiz can match you to specific books and their content notes.</p><button type="button" class="button button-primary" id="quizRestart">Try another vibe</button>`;
  result.hidden=false;next.hidden=true;back.hidden=true;
  document.getElementById("quizRestart").addEventListener("click",()=>{document.getElementById("bookQuiz").reset();step=0;result.hidden=true;next.hidden=false;back.hidden=false;updateQuiz();});
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterMessage").textContent="Thanks! This demo isn’t collecting email addresses yet—we’ll connect a free signup tool before launch.";});
renderProducts();renderCart();updateQuiz();
