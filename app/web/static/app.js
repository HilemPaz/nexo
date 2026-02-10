// app.js
import * as theme from './theme.js';
import * as modals from './modals.js';
import * as dailyEvents from './events.js';
import * as classicEvents from './events-classic.js';
import * as ui from './ui.js';

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle = document.getElementById("themeToggle");
    theme.initTheme(themeToggle);
    themeToggle.addEventListener("click", () => theme.toggleTheme(themeToggle));

    // ------------------ ELEMENTOS DO JOGO ------------------
    const elements = {
        guessForm: document.getElementById("guess-form"),
        guessInput: document.getElementById("guess-input"),
        submitBtn: document.getElementById("submitBtn"),
        hintBtn: document.getElementById("hint-btn"),
        giveUpBtn: document.getElementById("give-up-btn"),
        guessList: document.getElementById("guess-list"),
        progressFill: document.getElementById("progress-fill"),
        feedbackEl: document.getElementById("feedback"),
        resultArea: document.getElementById("result-area"),
        finalWordEl: document.getElementById("final-word"),
        finalAttemptsEl: document.getElementById("final-attempts"),
        rankingList: document.getElementById("ranking-list"),

        // 🔥 highlights (IMPORTANTE)
        lastGuessHighlight: document.getElementById("last-guess-highlight"),
        hintHighlight: document.getElementById("hint-highlight"),
    };

    // ------------------ BOTÕES DE MODO ------------------
    const classicBtn = document.getElementById("classicModeBtn");
    const dailyBtn = document.getElementById("dailyModeBtn");

  function setActiveMode(mode) {

    classicBtn.dataset.active = "false";
    dailyBtn.dataset.active = "false";

    if(mode === "classic"){
        classicBtn.dataset.active = "true";
    }

    if(mode === "daily"){
        dailyBtn.dataset.active = "true";
    }
}

    // RESET GLOBAL (evita MUITOS bugs visuais)
    function resetUI() {

        elements.guessList.innerHTML = "";

        if (elements.rankingList) {
            elements.rankingList.innerHTML = "";
        }

        elements.feedbackEl.textContent = "";
        elements.resultArea.classList.add("hidden");

        elements.guessInput.value = "";
        elements.guessInput.disabled = false;

        elements.submitBtn.disabled = false;
        elements.hintBtn.disabled = false;
        elements.giveUpBtn.disabled = false;

        // 🔥 RESET DOS HIGHLIGHTS (corrige bug da dica não aparecer)
        if (elements.lastGuessHighlight) {
            elements.lastGuessHighlight.textContent = "";
            elements.lastGuessHighlight.classList.remove("pop");
        }

        if (elements.hintHighlight) {
            elements.hintHighlight.textContent = "";
            elements.hintHighlight.classList.remove("hint-pop");
        }

        // 🔥 Reset da barra de progresso
        if (elements.progressFill) {
            elements.progressFill.style.width = "0%";
        }
    }

    // =============================
    // INICIALIZADOR DE MODO (ULTRA)
    // =============================

    function startMode(mode) {

        setActiveMode(mode);
        resetUI();

        // evita múltiplos listeners
        elements.guessForm?.replaceWith(elements.guessForm.cloneNode(true));

        // re-mapear após clone
        elements.guessForm = document.getElementById("guess-form");

        if (mode === "classic") {
            classicEvents.initClassicEvents(elements);
        } else {
            dailyEvents.initDailyEvents(elements);
        }
    }

    // =============================
    // EVENTOS DOS BOTÕES
    // =============================

    classicBtn.onclick = () => startMode("classic");
    dailyBtn.onclick = () => startMode("daily");

    // Inicializa modo diário
    startMode("daily");

    // ------------------ MODAIS ------------------
    modals.initModals({

        feedbackLink: document.getElementById("feedbackLink"),
        feedbackModal: document.getElementById("feedback-modal"),
        closeFeedbackModal: document.getElementById("close-feedback-modal"),
        closeFeedbackBtn: document.getElementById("close-feedback-btn"),

        donationLink: document.getElementById("donationLink"),
        donationModal: document.getElementById("donation-modal"),
        closeDonationModal: document.getElementById("close-donation-modal"),
        closeDonationBtn: document.getElementById("close-donation"),

        privacyLink: document.getElementById("privacyLink"),
        privacyModal: document.getElementById("privacy-modal"),
        closePrivacyModal: document.getElementById("close-privacy-modal"),
        acceptPrivacyBtn: document.getElementById("accept-privacy-btn"),

        // desistir
        giveUpBtn: elements.giveUpBtn,
        giveUpModal: document.getElementById("give-up-modal"),
        closeGiveUpModal: document.getElementById("close-give-up-modal"),
        confirmGiveUp: document.getElementById("confirm-give-up"),
        cancelGiveUp: document.getElementById("cancel-give-up"),

        showAuditBtn: document.getElementById("show-audit"),
        connectionsModal: document.getElementById("connections-modal"),
        closeModal: document.getElementById("close-modal"),

        ui,
        resultArea: elements.resultArea,
        finalWordEl: elements.finalWordEl
    });

});
