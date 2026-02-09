// web/static/app.js - VERSÃO COMPLETA E CORRIGIDA
// ===== ELEMENTOS DO DOM =====
const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const list = document.getElementById("guess-list");
const attemptsSpan = document.getElementById("attempts");
const hintsSpan = document.getElementById("hints");
const feedback = document.getElementById("feedback");

const gameArea = document.querySelector(".game-container");
const resultArea = document.getElementById("result-area");

const finalWord = document.getElementById("final-word");
const finalAttempts = document.getElementById("final-attempts");

const sumWin = document.getElementById("sum-win");
const sumNear = document.getElementById("sum-near");
const sumMid = document.getElementById("sum-mid");
const sumFar = document.getElementById("sum-far");

const newGameBtn = document.getElementById("newGameBtn");
const showAuditBtn = document.getElementById("show-audit");
const hintBtn = document.getElementById("hint-btn");
const giveUpBtn = document.getElementById("give-up-btn");

const modal = document.getElementById("connections-modal");
const modalList = document.getElementById("connections-list");
const closeModal = document.getElementById("close-modal");

const giveUpModal = document.getElementById("give-up-modal");
const closeGiveUpModal = document.getElementById("close-give-up-modal");
const confirmGiveUpBtn = document.getElementById("confirm-give-up");
const cancelGiveUpBtn = document.getElementById("cancel-give-up");

const highlight = document.getElementById("last-guess-highlight");
const resultTitle = document.getElementById("result-title");
const hintCount = document.getElementById("hint-count");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const themeToggle = document.getElementById("themeToggle");

const privacyLink = document.getElementById("privacyLink");
const donationLink = document.getElementById("donationLink");
const feedbackLink = document.getElementById("feedbackLink");
const privacyModal = document.getElementById("privacy-modal");
const donationModal = document.getElementById("donation-modal");
const feedbackModal = document.getElementById("feedback-modal");
const closeDonationBtn = document.getElementById("close-donation");
const closePrivacyModal = document.getElementById("close-privacy-modal");
const closeFeedbackModal = document.getElementById("close-feedback-modal");
const closeFeedbackBtn = document.getElementById("close-feedback-btn");
const acceptPrivacyBtn = document.getElementById("accept-privacy-btn");
const closeDonationModal = document.getElementById("close-donation-modal");

// Elementos do feedback
const emojiOptions = document.querySelectorAll(".emoji-option");
const ratingLabel = document.getElementById("rating-label");
const feedbackText = document.getElementById("feedback-text");
const openGoogleForm = document.getElementById("open-google-form");

// Elementos de doação
const donationImage = document.querySelector('.donation-image');

// ===== ESTADO DO JOGO (CARREGADO DO LOCALSTORAGE) =====
let attempts = parseInt(localStorage.getItem('nexo_attempts')) || 0;
let hints = parseInt(localStorage.getItem('nexo_hints')) || 0;
let guesses = JSON.parse(localStorage.getItem('nexo_guesses')) || [];
let currentProgress = parseFloat(localStorage.getItem('nexo_progress')) || 0;
let gameFinished = localStorage.getItem('nexo_finished') === 'true' || false;

// ===== FUNÇÕES DE ESTADO =====
function saveGameState() {
    localStorage.setItem('nexo_attempts', attempts.toString());
    localStorage.setItem('nexo_hints', hints.toString());
    localStorage.setItem('nexo_guesses', JSON.stringify(guesses));
    localStorage.setItem('nexo_progress', currentProgress.toString());
    localStorage.setItem('nexo_finished', gameFinished.toString());
}

function clearGameState() {
    localStorage.removeItem('nexo_attempts');
    localStorage.removeItem('nexo_hints');
    localStorage.removeItem('nexo_guesses');
    localStorage.removeItem('nexo_progress');
    localStorage.removeItem('nexo_finished');
}

// ===== FUNÇÕES AUXILIARES =====
function normalize(word) {
    return word.toLowerCase().trim();
}

function showFeedback(msg, persistent = false) {
    feedback.textContent = msg;
    feedback.classList.add("visible", "error");

    if (!persistent) {
        setTimeout(() => {
            feedback.textContent = "";
            feedback.classList.remove("visible", "error");
        }, 2000);
    }
}

function getClass(rank) {
    if (rank === 1) return "correct";
    if (rank <= 200) return "near";
    if (rank <= 1000) return "medium";
    return "far";
}

function updateProgress(rank) {
    let percentage;
    if (rank === 1) percentage = 100;
    else if (rank <= 200) percentage = 80 - ((rank - 2) / 198) * 40;
    else if (rank <= 1000) percentage = 40 - ((rank - 201) / 799) * 30;
    else percentage = 10 - Math.min(9, (rank - 1001) / 1000);

    percentage = Math.max(1, Math.min(100, percentage));
    currentProgress = Math.max(currentProgress, percentage);

    progressFill.style.width = `${currentProgress}%`;

    if (rank === 1) progressText.textContent = "ACERTOU! 🎉";
    else if (rank <= 10) progressText.textContent = "EXTREMAMENTE PRÓXIMO!";
    else if (rank <= 100) progressText.textContent = "MUITO PRÓXIMO!";
    else progressText.textContent = `${Math.round(percentage)}% mais próximo`;
}

function renderList() {
    list.innerHTML = "";
    guesses.sort((a,b)=>a.rank-b.rank).forEach(g=>{
        const li=document.createElement("li");
        li.className=getClass(g.rank);
        li.innerHTML=`<span class="word-text">${g.word.toUpperCase()}</span><span class="rank-number">${g.rank}</span>`;
        list.appendChild(li);
    });
}

function renderHighlight(guess) {
    highlight.innerHTML = "";
    if (!guess || guess.rank <= 2) return;

    const li=document.createElement("li");
    li.className=getClass(guess.rank);
    li.innerHTML=`<span class="word-text">${guess.word.toUpperCase()}</span><span class="rank-number">${guess.rank}</span>`;
    highlight.appendChild(li);
}

function renderSummary() {
    let win=0, near=0, mid=0, far=0;
    guesses.forEach(g=>{
        if(g.rank===1) win++;
        else if(g.rank<=200) near++;
        else if(g.rank<=1000) mid++;
        else far++;
    });
    sumWin.textContent=win;
    sumNear.textContent=near;
    sumMid.textContent=mid;
    sumFar.textContent=far;
}

function showWinScreen() {
    if(guesses.length===0) return;
    const lastGuess=guesses[guesses.length-1];
    if(lastGuess.rank===1){
        renderSummary();
        finalWord.textContent=lastGuess.word;
        finalAttempts.textContent=attempts;
        resultTitle.textContent="🎉 Você acertou!";
        gameArea.classList.add("hidden");
        resultArea.classList.remove("hidden");
        input.disabled=true;
        gameFinished=true;
        saveGameState();
    }
}

function showGiveUpScreen(secretWord) {
    renderSummary();
    finalWord.textContent=secretWord;
    finalAttempts.textContent=attempts;
    resultTitle.textContent="😢 Você desistiu da partida";
    gameArea.classList.add("hidden");
    resultArea.classList.remove("hidden");
    input.disabled=true;
    gameFinished=true;
    saveGameState();
}

function updateUI() {
    attemptsSpan.textContent=attempts;
    hintsSpan.textContent=hints;
    hintCount.textContent=hints;

    if(guesses.length>0){
        renderList();
        const lastGuess=guesses[guesses.length-1];
        if(lastGuess){
            renderHighlight(lastGuess);
            updateProgress(lastGuess.rank);
        }
    } else {
        list.innerHTML="";
        highlight.innerHTML="";
        progressFill.style.width="0%";
        progressText.textContent="0% mais próximo";
    }

    if(gameFinished){
        const lastGuess=guesses[guesses.length-1];
        if(lastGuess && lastGuess.rank===1) showWinScreen();
        input.disabled=true;
    } else input.disabled=false;

    saveGameState();
}

// ===== TEMA CLARO/ESCURO =====
function initTheme(){
    const savedTheme=localStorage.getItem('theme')||'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}
function toggleTheme(){
    const current=document.documentElement.getAttribute('data-theme');
    const newTheme=current==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}
function updateThemeButton(theme){
    themeToggle.innerHTML=theme==='dark'?'<i class="fas fa-sun"></i><span>Modo Claro</span>':'<i class="fas fa-moon"></i><span>Modo Escuro</span>';
}

// ===== CORREÇÃO DA IMAGEM DE DOAÇÃO =====
function fixDonationImage(){
    if(donationImage){
        donationImage.style.maxWidth='250px';
        donationImage.style.maxHeight='250px';
        donationImage.style.width='auto';
        donationImage.style.height='auto';
        donationImage.style.objectFit='contain';
        donationImage.style.display='block';
        donationImage.style.margin='0 auto';
    }
    const container=document.querySelector('.donation-image-container');
    if(container){
        container.style.display='flex';
        container.style.alignItems='center';
        container.style.justifyContent='center';
        container.style.textAlign='center';
    }
}

// ===== MODAL DE FEEDBACK =====
function initFeedbackModal(){
    if(feedbackLink && feedbackModal){
        feedbackLink.addEventListener("click",(e)=>{
            e.preventDefault();
            feedbackModal.style.display="flex";
        });
    }
    if(closeFeedbackModal) closeFeedbackModal.addEventListener("click",()=>{feedbackModal.style.display="none";});
    if(closeFeedbackBtn) closeFeedbackBtn.addEventListener("click",()=>{feedbackModal.style.display="none";});

    if(emojiOptions.length>0){
        emojiOptions.forEach(option=>{
            option.addEventListener("click",function(){
                emojiOptions.forEach(opt=>opt.classList.remove("selected"));
                this.classList.add("selected");
                const ratings={"1":"Pode melhorar muito","2":"Mais ou menos","3":"Bom","4":"Muito bom","5":"Excelente!"};
                const rating=this.getAttribute("data-rating");
                if(ratingLabel) ratingLabel.textContent=ratings[rating]||"Obrigado!";
                localStorage.setItem('game_rating', rating);
            });
        });
    }

    if(feedbackText){
        const savedRating=localStorage.getItem('game_rating');
        if(savedRating){
            const ratingEmoji={"1":"😞","2":"😐","3":"🙂","4":"😊","5":"🤩"}[savedRating];
            if(ratingEmoji) feedbackText.value=`Minha avaliação: ${ratingEmoji}\n`;
        }
    }
}

// ===== EVENT LISTENERS =====
themeToggle.addEventListener("click", toggleTheme);

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const word=normalize(input.value);
    if(!word) return;
    if(guesses.some(g=>g.word===word)){showFeedback("Palavra já usada");input.value="";return;}
    try{
        const res=await fetch("/guess",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({word})});
        const data=await res.json();
        if(data.error){showFeedback(data.error);return;}
        attempts++;
        guesses.push(data);
        updateUI();
        input.value="";
        input.focus();
    }catch(error){showFeedback("Erro de conexão");}
});

hintBtn.addEventListener("click",async ()=>{
    try{
        const res=await fetch("/hint");
        const data=await res.json();
        if(data.error){showFeedback(data.error);return;}
        attempts++;
        hints++;
        guesses.push(data);
        updateUI();
        renderHighlight(data);
    }catch(error){showFeedback("Erro ao obter dica");}
});

newGameBtn.addEventListener("click",async ()=>{
    try{
        const res=await fetch("/new-game",{method:"POST"});
        if(res.ok){
            attempts=0; hints=0; guesses=[]; currentProgress=0; gameFinished=false;
            clearGameState();
            gameArea.classList.remove("hidden");
            resultArea.classList.add("hidden");
            input.disabled=false;
            input.focus();
            updateUI();
            showFeedback("Novo jogo iniciado!");
        }
    }catch(error){showFeedback("Erro ao iniciar novo jogo");}
});

showAuditBtn.addEventListener("click",async ()=>{
    try{
        const res=await fetch("/audit");
        const data=await res.json();
        modalList.innerHTML="";
        data.forEach(item=>{
            const li=document.createElement("li");
            li.className=getClass(item.rank);
            li.innerHTML=`<span>${item.word}</span><span>${item.rank}</span>`;
            modalList.appendChild(li);
        });
        modal.style.display="flex";
    }catch(error){showFeedback("Erro ao carregar auditoria");}
});

closeModal.addEventListener("click",()=>{modal.style.display="none";});
giveUpBtn.addEventListener("click",()=>{giveUpModal.style.display="flex";});
closeGiveUpModal.addEventListener("click",()=>{giveUpModal.style.display="none";});
cancelGiveUpBtn.addEventListener("click",()=>{giveUpModal.style.display="none";});
confirmGiveUpBtn.addEventListener("click",async ()=>{
    try{
        const res=await fetch("/give-up",{method:"POST"});
        const data=await res.json();
        if(data.error){showFeedback(data.error);return;}
        giveUpModal.style.display="none";
        showGiveUpScreen(data.secret_word);
    }catch(error){showFeedback("Erro ao desistir");}
});

if(privacyLink) privacyLink.addEventListener("click",(e)=>{e.preventDefault();privacyModal.style.display="flex";});
if(closePrivacyModal) closePrivacyModal.addEventListener("click",()=>{privacyModal.style.display="none";});
if(acceptPrivacyBtn) acceptPrivacyBtn.addEventListener("click",()=>{privacyModal.style.display="none";localStorage.setItem('privacyAccepted','true');});

if(donationLink && donationModal) donationLink.addEventListener("click",(e)=>{e.preventDefault();donationModal.style.display="flex";setTimeout(fixDonationImage,100);});
if(closeDonationModal) closeDonationModal.addEventListener("click",()=>{donationModal.style.display="none";});
if(closeDonationBtn) closeDonationBtn.addEventListener("click",()=>{donationModal.style.display="none";});
if(donationImage){
    donationImage.onerror=function(){this.classList.add('error');};
    donationImage.onload=function(){this.classList.remove('error');};
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded",()=>{
    initTheme();
    initFeedbackModal();
    updateUI();
    input.focus();
    setTimeout(fixDonationImage,300);
    document.addEventListener('click',function(e){if(e.target.matches('a[href^="#"]')) e.preventDefault();},false);
    window.addEventListener("click",(e)=>{
        if(e.target===modal) modal.style.display="none";
        if(e.target===giveUpModal) giveUpModal.style.display="none";
        if(e.target===privacyModal) privacyModal.style.display="none";
        if(e.target===donationModal) donationModal.style.display="none";
        if(e.target===feedbackModal) feedbackModal.style.display="none";
    });
});

// ===== SALVAMENTO AUTOMÁTICO =====
window.addEventListener('beforeunload',()=>{saveGameState();});
setInterval(saveGameState,10000);
