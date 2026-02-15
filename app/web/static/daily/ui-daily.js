// ui-daily.js

export function normalize(word) {
    return word?.toLowerCase().trim() ?? "";
}

export function getRankClass(rank) {
    if (rank === 1) return "correct";
    if (rank <= 50) return "near";
    if (rank <= 200) return "medium";
    if (rank <= 500) return "far";
    return "veryFar";
}

export function renderAttempts(container, attempts) {
    if (!container || !attempts) return;

    // garante que rank seja número
    const sorted = [...attempts].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));

    container.innerHTML = "";

    sorted.forEach(attempt => {
        const li = document.createElement("li");
        li.className = getRankClass(attempt.rank ?? 9999);
        li.innerHTML = `<span class="word">${attempt.word ?? "???"}</span>
                        <span class="rank">#${attempt.rank ?? "?"}</span>`;
        container.appendChild(li);
    });
}

/* Atualiza barra de progresso */
export function updateProgress(progressFill, value) {
    if (!progressFill) return;
    // garante 0 a 100
    const safeValue = Math.min(Math.max(value ?? 0, 0), 100);
    progressFill.style.width = `${safeValue}%`;
}

/* Mostra resultado final */
export function showResult(
    resultAreaEl,
    titleEl,
    finalWordEl,
    finalAttemptsEl,
    attempts,
    correct,
    word
) {
    if (!resultAreaEl) return;

    if (titleEl)
        titleEl.textContent = correct ? "🎉 Você acertou!" : "😢 Você desistiu!";

    if (finalWordEl)
        finalWordEl.textContent = word ?? "???";

    if (finalAttemptsEl)
        finalAttemptsEl.textContent = attempts?.length ?? 0;

    resultAreaEl.classList.remove("hidden");
}

/* Destaque da última tentativa */
export function renderHighlight(elements, guess) {
    if (!elements?.lastGuessHighlight || !guess) return;

    const highlight = elements.lastGuessHighlight;

    highlight.innerHTML = "";

    const li = document.createElement("li");
    li.className = getRankClass(guess.rank ?? 9999);
    li.innerHTML = `<span class="word">${guess.word?.toUpperCase() ?? "???"}</span>
                    <span class="rank">#${guess.rank ?? "?"}</span>`;

    highlight.appendChild(li);

    // animação pop
    highlight.classList.remove("pop");
    void highlight.offsetWidth;
    highlight.classList.add("pop");
}

/* Renderiza dica, se existir */
export function renderHint(word) {
    const hintEl = document.getElementById("daily-hint");
    if (!hintEl) return;
    hintEl.textContent = word ?? "???";
}
