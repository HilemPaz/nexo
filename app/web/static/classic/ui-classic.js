// ui.js
export function normalize(word) {
    return word.toLowerCase().trim();
}

export function getRankClass(rank) {
    if (rank === 1) return "correct";
    if (rank <= 50) return "near";
    if (rank <= 200) return "medium";
    if (rank <= 500) return "far";
    return "very-far";
}

export function renderAttempts(container, attempts) {
    if (!container) return;

    container.innerHTML = "";
    const sorted = [...attempts].sort((a, b) => a.rank - b.rank);

    sorted.forEach(attempt => {
        const li = document.createElement("li");
        li.className = getRankClass(attempt.rank);
        li.innerHTML = `<span class="word">${attempt.word}</span>
                        <span class="rank">#${attempt.rank}</span>`;
        container.appendChild(li);
    });
}

/* 🔥 FUNÇÃO QUE O DAILY PRECISA */
export function updateProgress(progressFill, value) {
    if (!progressFill) return;
    progressFill.style.width = `${value}%`;
}

export function showResult(
    resultAreaEl,
    titleEl,
    finalWordEl,
    finalAttemptsEl,
    attempts,
    word
) {

    if (!resultAreaEl) return;

    const isWinner = attempts?.some(a => a.correct);

    titleEl.textContent =
        isWinner
            ? "🎉 Você acertou!"
            : "😢 Você desistiu!";

    if (finalWordEl)
        finalWordEl.textContent = word ?? "???";

    if (finalAttemptsEl)
        finalAttemptsEl.textContent = attempts?.length ?? 0;

    resultAreaEl.classList.remove("hidden");
}


export function renderHighlight(elements, guess) {
    const highlight = elements.lastGuessHighlight;
    if (!highlight || !guess) return;

    highlight.innerHTML = "";

    const li = document.createElement("li");
    li.className = getRankClass(guess.rank ?? 9999);
    li.innerHTML = `<span class="word">${guess.word.toUpperCase()}</span>
                    <span class="rank">#${guess.rank ?? "?"}</span>`;

    highlight.appendChild(li);

    highlight.classList.remove("pop");
    void highlight.offsetWidth;
    highlight.classList.add("pop");
}

export function updateCounters(elements, state){

    if(elements.attemptsEl)
        elements.attemptsEl.textContent = state.attemptsCount ?? 0;

    if(elements.hintsEl)
        elements.hintsEl.textContent = state.hints ?? 0;
}

export function showFeedback(el, message, type="error") {

    if (!el) return;

    if (!message) {
        el.textContent = "";
        el.classList.remove("visible", "error");
        return;
    }

    el.textContent = message;
    el.classList.add("visible");
    el.classList.add(type);
}

// ============================
// RENDER CONNECTIONS MODAL
// ============================
export function renderConnectionsModal(data) {
    const list = document.getElementById("connections-modal-list");
    if (!list) return;

    list.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.word}</span>
            <span>${item.rank}</span>
        `;
        list.appendChild(li);
    });
}

