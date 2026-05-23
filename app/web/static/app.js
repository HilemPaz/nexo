// app.js
import * as theme from './theme.js';
import * as modals from './modals.js';
import * as classicEvents from './classic/events-classic.js';
import * as ui from './classic/ui-classic.js';

document.addEventListener("DOMContentLoaded", () => {

    // ---------------- STATE MACHINE ----------------
    const GameState = Object.freeze({
        IDLE: "idle",
        PLAYING: "playing",
        WON: "won",
        GAVE_UP: "gave_up",
        VIEWING_CONNECTIONS: "viewing_connections"
    });

    let gameState = GameState.IDLE;
    let modeController = null;

    function setGameState(newState) {
        gameState = newState;
    }

    // MOBILE MENU
    const menuToggle = document.getElementById("mobileMenuToggle");
    const actionsCard = document.querySelector(".actions-card");
    let overlay = document.querySelector(".mobile-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "mobile-overlay";
        document.body.appendChild(overlay);
    }

    if (menuToggle && actionsCard) {
        menuToggle.addEventListener("click", () => {
            actionsCard.classList.toggle("open");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            actionsCard.classList.remove("open");
            overlay.classList.remove("active");
        });
    }

    // ==========================
    // SESSION ID (um por jogador)
    // ==========================
    function getSessionId() {
        let id = localStorage.getItem("game_session");

        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("game_session", id);
        }

        return id;
    }

    window.getSessionId = getSessionId;

    const originalFetch = window.fetch;

    window.fetch = function (url, options = {}) {
        options.headers = {
            ...(options.headers || {}),
            "X-Session-ID": getSessionId()
        };

        return originalFetch(url, options);
    };
    // ---------------- THEME ----------------
    const themeToggle = document.getElementById("themeToggle");
    theme.initTheme(themeToggle);
    themeToggle.addEventListener("click", () => theme.toggleTheme(themeToggle));

    // ---------------- ELEMENTOS ----------------
    const elements = {
        guessForm: document.getElementById("guess-form"),
        guessInput: document.getElementById("guess-input"),
        hintBtn: document.getElementById("hint-btn"),
        giveUpBtn: document.getElementById("give-up-btn"),
        guessList: document.getElementById("guess-list"),
        progressFill: document.getElementById("progress-fill"),
        feedbackEl: document.getElementById("feedback"),

        // RESULT
        resultArea: document.getElementById("result-area"),
        resultModal: document.getElementById("result-modal"),
        resultTitle: document.getElementById("result-title"),
        finalWordEl: document.getElementById("final-word"),
        finalAttemptsEl: document.getElementById("final-attempts"),

        // LISTAS
        connectionsList: document.getElementById("connections-modal-list"),

        lastGuessHighlight: document.getElementById("last-guess-highlight"),
        newGameBtn: document.getElementById("newGameBtn"),

        attemptsEl: document.getElementById("attempts"),
        hintsEl: document.getElementById("hints")
    };

    // ---------------- UI RESET ----------------
    function resetUI() {

        elements.guessList.innerHTML = "";
        elements.feedbackEl.textContent = "";

        if (elements.connectionsList) {
            elements.connectionsList.innerHTML = "";
        }

        document.querySelectorAll(".modal.visible")
            .forEach(m => m.classList.remove("visible"));

        const toggle = document.getElementById("connections-toggle");

        if (toggle) {
            toggle.innerHTML = '<i class="fas fa-search"></i> Ver conexões';
        }

        elements.guessInput.disabled = false;
        elements.hintBtn.disabled = false;
        elements.giveUpBtn.disabled = false;
    }


    // ---------------- START MODE ----------------
    function startClassic() {

        if (modeController) {
            modeController.abort();
        }

        modeController = new AbortController();
        const signal = modeController.signal;

        resetUI();
        setGameState(GameState.PLAYING);

        classicEvents.initClassicEvents(elements, signal, setGameState);
    }

    // ---------------- NOVO JOGO ----------------
    elements.newGameBtn.addEventListener("click", () => {

        modals.closeModal(elements.resultModal);

        setGameState(GameState.IDLE);

        startClassic();
    });

    // ---------------- MODAIS ----------------
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

        giveUpBtn: elements.giveUpBtn,
        giveUpModal: document.getElementById("give-up-modal"),
        closeGiveUpModal: document.getElementById("close-give-up-modal"),
        confirmGiveUp: document.getElementById("confirm-give-up"),
        cancelGiveUp: document.getElementById("cancel-give-up"),

        resultModal: elements.resultModal,
        closeResultModal: document.getElementById("close-result-modal"),


        ui,
        resultArea: elements.resultArea
    });

    // inicia automaticamente
    startClassic();
});
