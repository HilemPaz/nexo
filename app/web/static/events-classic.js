// events-classic.js

import * as classic from './classic.js';
import * as ui from './ui.js';

export function initClassicEvents(elements) {

    const {
        guessForm,
        guessInput,
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

    // limpa ranking
    rankingList.innerHTML = "";

    let state = classic.getState();

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

            state = classic.addAttempt(state, result);

            classic.renderAttempts(state, guessList);
            classic.updateProgress(state, progressFill);

            ui.updateRanking(rankingList, state.attempts); // ⭐ ranking

            if (result.correct) {

                classic.showResult(
                    state,
                    resultArea,
                    finalWordEl,
                    finalAttemptsEl,
                    result.word
                );

            } else if (state.finished) {

                classic.showResult(
                    state,
                    resultArea,
                    finalWordEl,
                    finalAttemptsEl,
                    "Palavra secreta"
                );

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

        const word = ui.normalize(guessInput.value);

        if (!word) return;

        submitGuess(word);
        renderLastGuess(word);

        guessInput.value = "";
    };

    hintBtn.onclick = async () => {

        const res = await fetch("/hint");
        const hint = await res.json();

        state = classic.useHint(state, hint);

        classic.renderAttempts(state, guessList);
        classic.updateProgress(state, progressFill);

        ui.updateRanking(rankingList, state.attempts);
    };

    giveUpBtn.onclick = async () => {

        const res = await fetch("/give-up", { method: "POST" });
        const result = await res.json();

        state = classic.addAttempt(state, {
            word: result.secret_word,
            correct: false,
            rank: 9999
        });
        renderHint(hint);
        classic.renderAttempts(state, guessList);
        ui.updateRanking(rankingList, state.attempts);

        classic.showResult(
            state,
            resultArea,
            finalWordEl,
            finalAttemptsEl,
            result.secret_word
        );
    };

    // 🔥 Inicializa UI
    classic.renderAttempts(state, guessList);
    classic.updateProgress(state, progressFill);
    ui.updateRanking(rankingList, state.attempts);
}
