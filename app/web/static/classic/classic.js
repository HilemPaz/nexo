// classic.js
import * as ui from './ui-classic.js';
import { openModal } from '../modals.js';

const STORAGE_PREFIX = "classic_game_";

/* =============================
   Helpers
============================= */
function safeJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function normalizeAttempt(obj) {
    return {
        word: ui.normalize(obj?.word ?? "???"),
        rank: obj?.rank ?? 9999,
        proximity: obj?.proximity ?? "far",
        correct: obj?.correct ?? false
    };
}

/* =============================
   Storage
============================= */
function loadState() {
    return {
        attempts: safeJSON(STORAGE_PREFIX + 'guesses', []),
        attemptsCount: parseInt(localStorage.getItem(STORAGE_PREFIX + 'attempts')) || 0,
        hints: parseInt(localStorage.getItem(STORAGE_PREFIX + 'hints')) || 0,
        progress: parseFloat(localStorage.getItem(STORAGE_PREFIX + 'progress')) || 0,
        finished: localStorage.getItem(STORAGE_PREFIX + 'finished') === 'true',
        connections: safeJSON(STORAGE_PREFIX + 'connections', [])
    };
}

function saveState(state) {
    localStorage.setItem(STORAGE_PREFIX + 'guesses', JSON.stringify(state.attempts));
    localStorage.setItem(STORAGE_PREFIX + 'attempts', state.attemptsCount.toString());
    localStorage.setItem(STORAGE_PREFIX + 'hints', state.hints.toString());
    localStorage.setItem(STORAGE_PREFIX + 'progress', state.progress.toString());
    localStorage.setItem(STORAGE_PREFIX + 'finished', state.finished.toString());
    localStorage.setItem(STORAGE_PREFIX + 'connections', JSON.stringify(state.connections || []));
}

function clearState() {
    Object.keys(localStorage)
        .filter(k => k.startsWith(STORAGE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
}

export function ensureModalsClosed(elements) {
    elements?.resultModal?.classList.remove("visible");
    document.getElementById("connections-modal")?.classList.remove("visible");
}

/* =============================
   Game
============================= */
export function newGame() {
    clearState();
    const state = {
        attempts: [],
        attemptsCount: 0,
        hints: 0,
        progress: 0,
        finished: false,
        connections: []
    };
    saveState(state);
    return state;
}

export function addAttempt(state, attempt) {
    if (state.finished) return state;
    const normalized = normalizeAttempt(attempt);
    if (state.attempts.some(a => a.word === normalized.word)) return state;
    const attemptsCount = state.attemptsCount + 1;
    const newState = {
        ...state,
        attempts: [...state.attempts, normalized],
        attemptsCount,
        finished: normalized.correct
    };
    saveState(newState);
    return newState;
}

export function useHint(state, hint) {
    const normalized = normalizeAttempt(hint);
    const newState = {
        ...state,
        hints: state.hints + 1,
        attempts: [...state.attempts, normalized],
    };
    saveState(newState);
    return newState;
}

/* =============================
   UI Sync
============================= */
export function updateProgress(state, progressFillEl) {

    if (!progressFillEl) return state;

    const progressTextEl = document.getElementById("progress-text");

    if (!state.attempts.length) {
        progressFillEl.style.width = "0%";
        if (progressTextEl)
            progressTextEl.textContent = "0% mais próximo";
        return state;
    }

    const bestRank = Math.min(...state.attempts.map(a => a.rank ?? 9999));

    let percentage;

    if (bestRank === 1) percentage = 100;
    else if (bestRank <= 200)
        percentage = 80 - ((bestRank - 2) / 198) * 40;
    else if (bestRank <= 1000)
        percentage = 40 - ((bestRank - 201) / 799) * 30;
    else
        percentage = 10 - Math.min(9, (bestRank - 1001) / 1000);

    percentage = Math.max(1, Math.min(100, Math.round(percentage)));

    const newState = {
        ...state,
        progress: Math.max(state.progress || 0, percentage)
    };

    progressFillEl.style.width = `${newState.progress}%`;

    if (progressTextEl)
        progressTextEl.textContent = `${newState.progress}% mais próximo`;

    saveState(newState);

    return newState;
}


export function renderAttempts(state, guessListEl) {
    ui.renderAttempts(guessListEl, state.attempts);
}

/* =============================
   Show Result
============================= */
export function showResult(state, elements, word) {

    if (!elements?.resultModal) return;
    const resultTitle = elements.resultTitle || document.getElementById("result-title");

    elements.resultModal.classList.remove("visible");

    ui.showResult(
        elements.resultModal,
        resultTitle,
        elements.finalWordEl,
        elements.finalAttemptsEl,
        state.attempts,
        word
    );
    
    requestAnimationFrame(() => {
        openModal(elements.resultModal);
    });
  

    // resumo por rank
    const summary = { correct: 0, near: 0, medium: 0, far: 0, "very-far": 0 };
    state.attempts.forEach(a => {
        const cls = ui.getRankClass(a.rank);
        summary[cls]++;
    });

    document.getElementById("sum-win").textContent = summary.correct;
    document.getElementById("sum-near").textContent = summary.near;
    document.getElementById("sum-mid").textContent = summary.medium;
    document.getElementById("sum-far").textContent = summary.far;
    document.getElementById("sum-very-far").textContent = summary['very-far'];

    // renderiza conexões com cores de rank
    if (elements.connectionsList && state.connections?.length) {
        elements.connectionsList.innerHTML = "";
        state.connections.forEach(c => {
            const li = document.createElement("li");
            const rank = c.rank ?? 9999;
            li.className = ui.getRankClass(rank);
            li.innerHTML = `<span>${c.word ?? c}</span><span>#${rank}</span>`;
            elements.connectionsList.appendChild(li);
        });
    }
}

export function getState() {
    return loadState();
}

export function isFinished(state) {
    return state.finished;
}
