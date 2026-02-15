// app.js
import * as theme from './theme.js';
import * as modals from './modals.js';
import * as dailyEvents from './daily/events.js';
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
    let currentMode = null;
    let modeController = null;

    function setGameState(newState) {
        gameState = newState;
    }

    function isPlaying() {
        return gameState === GameState.PLAYING;
    }

    // ---------------- THEME ----------------
    const themeToggle = document.getElementById("themeToggle");
    theme.initTheme(themeToggle);
    themeToggle.addEventListener("click", () => theme.toggleTheme(themeToggle));

    // ---------------- ELEMENTOS ----------------
    const elements = {
        guessForm: document.getElementById("guess-form"),
        guessInput: document.getElementById("guess-input"),
        submitBtn: document.getElementById("submitBtn"),
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
        rankingList: document.getElementById("ranking-list"),
        connectionsList: document.getElementById("connections-modal-list"),

        lastGuessHighlight: document.getElementById("last-guess-highlight"),
        newGameBtn: document.getElementById("newGameBtn"),

        attemptsEl: document.getElementById("attempts"),
        hintsEl: document.getElementById("hints")
    };

    const classicBtn = document.getElementById("classicModeBtn");
    const dailyBtn = document.getElementById("dailyModeBtn");

    // ---------------- UI RESET ----------------
    function resetUI() {

        elements.guessList.innerHTML = "";
        elements.rankingList.innerHTML = "";
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
        elements.submitBtn.disabled = false;
        elements.hintBtn.disabled = false;
        elements.giveUpBtn.disabled = false;
    }

    function setActiveMode(mode) {
        classicBtn.dataset.active = (mode === "classic");
        dailyBtn.dataset.active = (mode === "daily");
    }

    // ---------------- START MODE ----------------
    function startMode(mode) {

        if (currentMode === mode) return;

        if (modeController) {
            modeController.abort();
        }

        modeController = new AbortController();
        const signal = modeController.signal;

        currentMode = mode;

        resetUI();
        setActiveMode(mode);
        setGameState(GameState.PLAYING);

        if (mode === "classic") {
            classicEvents.initClassicEvents(elements, signal, setGameState);
        } else {
            dailyEvents.initDailyEvents(elements, signal, setGameState);
        }
    }

    // ---------------- BOTÕES DE MODO ----------------
    classicBtn.addEventListener("click", () => startMode("classic"));
    dailyBtn.addEventListener("click", () => startMode("daily"));

    // ---------------- NOVO JOGO ----------------
    elements.newGameBtn.addEventListener("click", () => {

        modals.closeModal(elements.resultModal);

        setGameState(GameState.IDLE);

        startMode(currentMode || "daily");
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
    startMode("classic");
});
