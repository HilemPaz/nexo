// events.js

import * as daily from './daily.js';
import * as ui from './ui.js';


export function initDailyEvents(elements) {

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
    } = elements;

    // 🔥 limpa ranking ao trocar modo
    rankingList.innerHTML = "";

    function checkDailyLock() {
        if (!daily.canPlayToday()) {

            guessInput.disabled = true;
            submitBtn.disabled = true;
            hintBtn.disabled = true;
            giveUpBtn.disabled = true;

            feedbackEl.textContent =
                `Você já jogou hoje! Próximo jogo em ${daily.getTimeUntilReset()}.`;

            return true;
        }

        guessInput.disabled = false;
        submitBtn.disabled = false;
        hintBtn.disabled = false;
        giveUpBtn.disabled = false;

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
                feedbackEl.textContent = result.error;
                return;
            }

            const state = daily.addAttempt(result);

            ui.renderAttempts(guessList, state.attempts);
            ui.updateProgress(progressFill, state.attempts);
            ui.updateRanking(rankingList, state.attempts); // ⭐ ranking

            if (result.correct) {

                ui.showResult(
                    resultArea,
                    finalWordEl,
                    finalAttemptsEl,
                    state.attempts,
                    true,
                    result.word
                );

                checkDailyLock();

            } else if (state.finished) {

                ui.showResult(
                    resultArea,
                    finalWordEl,
                    finalAttemptsEl,
                    state.attempts,
                    false,
                    "Palavra secreta"
                );

                checkDailyLock();

            } else {

                feedbackEl.textContent =
                    `Palavra: ${result.word} — Proximidade: ${result.proximity}`;
            }

        } catch (err) {

            feedbackEl.textContent = "Erro ao processar a palavra.";
            console.error(err);
        }
    }

    guessForm.onsubmit = (e) => {

        e.preventDefault();

        if (checkDailyLock()) return;

        const word = ui.normalize(guessInput.value);

        if (!word) return;

        submitGuess(word);
        renderLastGuess(word);

        guessInput.value = "";
    };

    hintBtn.onclick = async () => {

        if (checkDailyLock()) return;

        const res = await fetch("/hint");
        const hint = await res.json();

        const state = daily.addAttempt(hint);
        renderHint(hint);
        ui.renderAttempts(guessList, state.attempts);
        ui.updateRanking(rankingList, state.attempts);

        feedbackEl.textContent =
            `Dica: ${hint.word} — Proximidade: ${hint.proximity}`;
    };

    giveUpBtn.onclick = async () => {

        if (checkDailyLock()) return;

        const res = await fetch("/give-up", { method: "POST" });
        const result = await res.json();

        const state = daily.addAttempt({
            word: result.secret_word,
            correct: false,
            rank: 9999
        });

        ui.renderAttempts(guessList, state.attempts);
        ui.updateRanking(rankingList, state.attempts);

        ui.showResult(
            resultArea,
            finalWordEl,
            finalAttemptsEl,
            state.attempts,
            false,
            result.secret_word
        );

        checkDailyLock();
    };

    // 🔥 Inicialização
    const state = daily.getDailyState();

    ui.renderAttempts(guessList, state.attempts);
    ui.updateRanking(rankingList, state.attempts);
    ui.updateProgress(progressFill, state.attempts);

    checkDailyLock();
}
