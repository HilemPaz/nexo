// events-classic.js

import * as classic from './classic.js';
import * as ui from './ui-classic.js';
import { closeModal } from "../modals.js";

export function initClassicEvents(elements) {

    const {
        guessForm,
        guessInput,
        hintBtn,
        giveUpBtn,
        guessList,
        progressFill,
        feedbackEl,
        newGameBtn,
        connectionsList,
    } = elements;


    let state = classic.getState();

    // CONNECTIONS)
    const connectionsBtn = document.getElementById("connections-toggle");
    const connectionsModal = document.getElementById("connections-modal");
    const closeConnections = document.getElementById("close-connections-modal");
    const closeConnectionsBtn = document.getElementById("close-connections-btn");

    // ============================
    // OPEN
    // ============================
    connectionsBtn?.addEventListener("click", () => {
        const data = window.__connections || [];
        renderConnectionsModal(data);
        connectionsModal?.classList.add("visible");
    });

    // ============================
    // CLOSE
    // ============================
    function closeConnectionsModal() {
        connectionsModal?.classList.remove("visible");
    }

    closeConnections?.addEventListener("click", closeConnectionsModal);
    closeConnectionsBtn?.addEventListener("click", closeConnectionsModal);

    // fechar clicando fora
    connectionsModal?.addEventListener("click", (e) => {
        if (e.target === connectionsModal) {
            closeConnectionsModal();
        }
    });

    // =========================
    // ENVIAR PALPITE
    // =========================
    async function submitGuess(word) {

        try {
            word = ui.normalize(word);
            ui.showFeedback(feedbackEl, "");
            if (!word) return null;

            if (state.attempts.some(a => a.word === word)) {
                ui.showFeedback(feedbackEl, "Você já tentou essa palavra.");
                setTimeout(() => ui.showFeedback(feedbackEl, ""), 2500);
                return null;
            }

            const res = await fetch("/guess", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word })
            });

            const result = await res.json();

            if (!res.ok) {
                ui.showFeedback(feedbackEl, result?.error || "Palavra inválida.");
                setTimeout(() => ui.showFeedback(feedbackEl, ""), 2500);
                return null;
            }

            state = classic.addAttempt(state, result);
            ui.updateCounters(elements, state);

            classic.renderAttempts(state, guessList);
            state = classic.updateProgress(state, progressFill);

            ui.renderHighlight(elements, result);

            if (result.success) {

                let connections = [];
                try {
                    const auditRes = await fetch("/audit");
                    connections = await auditRes.json();
                } catch (err) {
                    console.error("Erro ao buscar audit:", err);
                }

                state = { ...state, connections };

                window.__connections = connections;

                classic.showResult(state, elements, result.word);

                renderConnectionsModal(connections)
                disableInputs();
            }

            return result;

        } catch (err) {
            console.error(err);
            ui.showFeedback(feedbackEl, "Erro ao processar a palavra.");
            return null;
        }
    }

    // =========================
    // FORM
    // =========================
    guessForm.onsubmit = async (e) => {
        e.preventDefault();
        const word = ui.normalize(guessInput.value);
        if (!word) return;
        await submitGuess(word);
        guessInput.value = "";
    };

    // =========================
    // HINT
    // =========================
    hintBtn.onclick = async () => {
        try {
            const res = await fetch("/hint");
            const hint = await res.json();
            if (!hint?.word) return;

            state = classic.useHint(state, hint);
            ui.updateCounters(elements, state);

            classic.renderAttempts(state, guessList);
            state = classic.updateProgress(state, progressFill);
            ui.renderHighlight(elements, hint);

        } catch (err) {
            console.error("Erro ao buscar dica:", err);
        }
    };

    // =========================
    // GIVE UP
    // =========================
    async function handleGiveUp() {

        try {
            const res = await fetch("/give-up", { method: "POST" });
            const result = await res.json();

            let connections = [];
            try {
                const auditRes = await fetch("/audit");
                connections = await auditRes.json();
            } catch (err) {
                console.error("Erro audit:", err);
            }

            state = {
                ...state,
                finished: true,
                connections
            };

            window.__connections = connections;

            classic.showResult(state, elements, result.secret_word || "???");
            renderConnectionsModal(connections)

            disableInputs();

        } catch (err) {
            console.error("Erro give up:", err);
        }
    }

    document.addEventListener("playerGiveUp", handleGiveUp);

    // =========================
    // NOVA PARTIDA
    // =========================
    if (newGameBtn) {
        newGameBtn.onclick = async () => {

            try {
                await fetch("/new-game", { method: "POST" });
            } catch (err) {
                console.error("Erro new-game:", err);
            }
            const resultModal = document.getElementById("result-modal");
            closeModal(resultModal, true);
            state = classic.newGame();

            ui.updateCounters(elements, state);
            enableInputs();

            guessList.innerHTML = "";
            if (connectionsList) connectionsList.innerHTML = "";

            feedbackEl.textContent = "";

            if (elements.lastGuessHighlight) {
                elements.lastGuessHighlight.innerHTML = "";
                elements.lastGuessHighlight.classList.remove("pop");
            }

            if (progressFill)
                progressFill.style.width = "0%";

            const progressText = document.getElementById("progress-text");
            if (progressText)
                progressText.textContent = "0% mais próximo";

            if (elements.resultArea) {
                elements.resultArea.classList.remove("visible");
                elements.resultArea.classList.add("hidden");

                if (elements.finalWordEl) elements.finalWordEl.textContent = "";
                if (elements.finalAttemptsEl) elements.finalAttemptsEl.textContent = "";
                const titleEl = document.getElementById("result-title");
                if (titleEl) titleEl.textContent = "";
            }

        };
    }


    // ============================
    // RENDER CONNECTIONS MODAL
    // ============================
    function renderConnectionsModal(connections = []) {

        if (!connectionsList) return;

        connectionsList.innerHTML = "";

        connections.forEach(c => {

            const li = document.createElement("li");
            const rank = c.rank ?? 9999;

            li.className = ui.getRankClass(rank);

            li.innerHTML = `
            <span>${c.word ?? c}</span>
            <span>#${rank}</span>
        `;

            connectionsList.appendChild(li);
        });
    }

    function disableInputs() {
        guessInput.disabled = true;
        hintBtn.disabled = true;
        giveUpBtn.disabled = true;
    }

    function enableInputs() {
        guessInput.disabled = false;
        hintBtn.disabled = false;
        giveUpBtn.disabled = false;
    }

    classic.renderAttempts(state, guessList);
    state = classic.updateProgress(state, progressFill);
}
