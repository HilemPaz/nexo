// daily.js

const DAILY_STORAGE_KEY = "daily_game_state";
const DAILY_HISTORY_KEY = "daily_history";

const MAX_ATTEMPTS = 10;
const MAX_HISTORY = 10;

/* ================================
   HELPERS
================================ */

function getTodayString() {
    // timezone local — evita reset bugado
    return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/* ================================
   STORAGE
================================ */

function loadState() {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = safeParse(raw);

    // protege contra state quebrado
    if (!parsed || parsed.date === undefined) {
        localStorage.removeItem(DAILY_STORAGE_KEY);
        return null;
    }

    return parsed;
}

function saveState(state) {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
}

/* ================================
   HISTORY (ranking local)
================================ */

function loadHistory() {
    const raw = localStorage.getItem(DAILY_HISTORY_KEY);
    return raw ? safeParse(raw) || [] : [];
}

function saveHistory(history) {
    localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
}

function saveDailyResult(state) {
    if (!state.finished || state.resultSaved) return;

    let history = loadHistory();

    // remove mesmo dia se existir
    history = history.filter(day => day.date !== state.date);

    history.unshift({
        date: state.date,
        victory: state.victory,
        attempts: state.attempts.length,
        score: state.score,
        time: state.endTime
            ? Math.floor((state.endTime - state.startTime) / 1000)
            : null
    });

    if (history.length > MAX_HISTORY) {
        history.pop();
    }

    saveHistory(history);

    // marca como salvo (ANTI DUPLICAÇÃO)
    state.resultSaved = true;
    saveState(state);
}

/* ================================
   STATE
================================ */

function createNewState() {
    const state = {
        date: getTodayString(),

        attempts: [],
        finished: false,
        victory: false,

        score: 0,

        startTime: Date.now(),
        endTime: null,

        resultSaved: false
    };

    saveState(state);
    return state;
}

export function getDailyState() {
    const state = loadState();

    // novo dia ou inexistente
    if (!state || state.date !== getTodayString()) {
        return createNewState();
    }

    return state;
}

/* ================================
   GAME LOGIC
================================ */

export function addAttempt(attempt) {
    const state = getDailyState();

    if (state.finished) return state;

    state.attempts.push(attempt);

    // vitória
    if (attempt.correct) {
        state.finished = true;
        state.victory = true;

        state.score =
            (MAX_ATTEMPTS - state.attempts.length + 1) * 100;

        state.endTime = Date.now();
    }

    // derrota
    if (state.attempts.length >= MAX_ATTEMPTS && !state.victory) {
        state.finished = true;
        state.endTime = Date.now();
    }

    saveState(state);

    // salva ranking local automaticamente
    saveDailyResult(state);

    return state;
}

/* ================================
   GETTERS
================================ */

export function canPlayToday() {
    return !getDailyState().finished;
}

export function attemptsLeft() {
    return MAX_ATTEMPTS - getDailyState().attempts.length;
}

export function getDailyHistory() {
    return loadHistory();
}

export function getTimeUntilReset() {
    const now = new Date();

    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);

    const diff = tomorrow - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
}
