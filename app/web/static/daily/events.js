// events.js

import * as daily from './daily.js';
import * as ui from './ui-daily.js';

export function initDailyEvents(elements) {

    // 🔹 Blindagem: garante que todos os elementos existam
    const {
        guessForm,
        guessInput,
        submitBtn,
        hintBtn,
        giveUpBtn,
        guessList,
        progressFill,
        feedbackEl,
        resultArea,
        finalWordEl,
        finalAttemptsEl,
        rankingList,
        lastGuessHighlight
    } = elements;

    if (!guessForm || !guessInput || !submitBtn) {
        console.warn("Elementos essenciais do modo diário não encontrados!");
        return;
    }

    // ranking local desativado por enquanto
    if (rankingList) rankingList.innerHTML = "";

    function checkDailyLock() {
        if (!daily.canPlayToday()) {
            if (guessInput) guessInput.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
            if (hintBtn) hintBtn.disabled = true;
            if (giveUpBtn) giveUpBtn.disabled = true;

            if (feedbackEl)
                feedbackEl.textContent =
                    `Você já jogou hoje! Próximo jogo em ${daily.getTimeUntilReset()}.`;

            return true;
        }
        return false;
    }

    async function submitGuess(word) {
        try {
            const res = await fetch("/guess", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word })
            });

            const result = await res.json();

            if (!res.ok) {
                if (feedbackEl) feedbackEl.textContent = result.error;
                return;
            }

            const state = daily.addAttempt(result);

            ui.renderAttempts(guessList, state.attempts);
            ui.updateProgress(progressFill, (state.attempts.length / 10) * 100);

            if (result.correct || state.finished) {
                ui.showResult(
                    resultArea,
                    document.getElementById("result-title"),
                    finalWordEl,
                    finalAttemptsEl,
                    state.attempts,
                    result.correct,
                    result.word ?? "Palavra secreta"
                );

                checkDailyLock();
            } else {
                if (feedbackEl)
                    feedbackEl.textContent =
                        `Palavra: ${result.word ?? "???"} — Proximidade: ${result.proximity ?? "???"}`;
            }

        } catch (err) {
            if (feedbackEl)
                feedbackEl.textContent = "Erro ao processar a palavra.";
            console.error(err);
        }
    }

    // Submit do formulário
    guessForm.onsubmit = (e) => {
        e.preventDefault();

        if (checkDailyLock()) return;

        const word = ui.normalize(guessInput.value);
        if (!word) return;

        submitGuess(word);
        ui.renderHighlight({ lastGuessHighlight }, { word, rank: 9999 });

        guessInput.value = "";
    };

    // Botão de hint
    if (hintBtn) {
        hintBtn.onclick = async () => {
            if (checkDailyLock()) return;

            try {
                const res = await fetch("/hint");
                const hint = await res.json();

                const state = daily.addAttempt({
                    word: hint.word,
                    rank: hint.rank ?? 9999,
                    correct: false
                });

                ui.renderHint(hint.word);
                ui.renderAttempts(guessList, state.attempts);

            } catch (err) {
                if (feedbackEl)
                    feedbackEl.textContent = "Erro ao buscar dica.";
                console.error(err);
            }
        };
    }

    // DESISTIR
    async function handleGiveUp() {
        if (checkDailyLock()) return;

        try {
            const res = await fetch("/give-up", { method: "POST" });
            const result = await res.json();

            const state = daily.addAttempt({
                word: result.secret_word,
                correct: false,
                rank: 9999
            });

            ui.showResult(
                resultArea,
                document.getElementById("result-title"),
                finalWordEl,
                finalAttemptsEl,
                state.attempts,
                false,
                result.secret_word
            );

            if (guessInput) guessInput.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
            if (hintBtn) hintBtn.disabled = true;
            if (giveUpBtn) giveUpBtn.disabled = true;

        } catch (err) {
            if (feedbackEl)
                feedbackEl.textContent = "Erro ao desistir.";
            console.error(err);
        }
    }

    // 🔥 Remove listener antigo e adiciona novo
    document.removeEventListener("playerGiveUp", handleGiveUp);
    document.addEventListener("playerGiveUp", handleGiveUp);

    // INIT
    const state = daily.getDailyState();

    ui.renderAttempts(guessList, state.attempts);
    ui.updateProgress(progressFill, (state.attempts.length / 10) * 100);

    checkDailyLock();
}
