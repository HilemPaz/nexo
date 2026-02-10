// ui.js

export function normalize(word) {
    return word.toLowerCase().trim();
}

export function getRankClass(rank) {
    if (rank === 1) return "correct";
    if (rank <= 200) return "near";
    if (rank <= 500) return "medium";
     if (rank <= 1000) return "far";
    return "very-far";
}

export function updateProgress(progressFillEl, attempts) {
    if (!attempts || attempts.length === 0) {
        progressFillEl.style.width = "0%";
        return;
    }
    const last = attempts[attempts.length - 1];
    const percentage = Math.max(0, 100 - (last.rank / 1000) * 100);
    progressFillEl.style.width = `${percentage}%`;
}

export function renderAttempts(container, attempts) {

    if (!container) return;

    container.innerHTML = "";

    // mais recente primeiro
    const sorted = [...attempts].reverse();

    sorted.forEach(attempt => {

        const li = document.createElement("li");

        const rank = attempt.rank ?? 9999;

        let distanceClass = "very-far";

        if (rank === 1) distanceClass = "correct";
        else if (rank <= 50) distanceClass = "near";
        else if (rank <= 500) distanceClass = "medium";
        else if (rank <= 1000) distanceClass = "far";

        li.classList.add(distanceClass);

        li.innerHTML = `
            <span class="word">${attempt.word}</span>
            <span class="rank">#${rank}</span>
        `;

        container.appendChild(li);
    });
}

export function showResult(resultAreaEl, finalWordEl, finalAttemptsEl, attempts, victory, word) {
    resultAreaEl.classList.remove("hidden");
    finalWordEl.textContent = word;
    finalAttemptsEl.textContent = attempts.length;
}

export function showFeedback(feedbackEl, msg, persistent = false) {
    feedbackEl.textContent = msg;
    feedbackEl.classList.add("visible", "error");
    if (!persistent) {
        setTimeout(() => {
            feedbackEl.textContent = "";
            feedbackEl.classList.remove("visible", "error");
        }, 2000);
    }
}

export function updateRanking(container, attempts) {

    if (!container) {
        console.warn("Ranking container não encontrado");
        return;
    }

    // limpa sidebar
    container.innerHTML = "";

    if (!attempts || attempts.length === 0) return;

    // menor rank = melhor
    const sorted = [...attempts]
        .filter(a => a.rank) // evita undefined
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 10); // top 10

    sorted.forEach(attempt => {

        const li = document.createElement("li");

        let distanceClass = "very-far";

        if (attempt.rank === 1) distanceClass = "correct";
        else if (attempt.rank <= 50) distanceClass = "near";
        else if (attempt.rank <= 500) distanceClass = "medium";
        else if (attempt.rank <= 1000) distanceClass = "far";

        li.className = distanceClass;

        li.innerHTML = `
            <span class="word">${attempt.word}</span>
            <span class="rank">#${attempt.rank}</span>
        `;

        container.appendChild(li);
    });
}

export function renderLastGuess(word) {
    const el = document.getElementById("last-guess-highlight");

    highlight.innerHTML = "";
    if (!word || word.rank <= 2) return;
    const li = document.createElement("li");
    li.className = getClass(word.rank);
    li.innerHTML = `<span class="word-text">${word.word.toUpperCase()}</span><span class="rank-number">${word.rank}</span>`;
    highlight.appendChild(li);
}

export function useHint(hints) {
    const state = getDailyState();

    if (state.hintsUsed >= hints.length) return null;

    const hint = hints[state.hintsUsed];
    state.hintsUsed++;

    saveState(state);

    return hint;
}

