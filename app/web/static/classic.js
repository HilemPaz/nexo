// classic.js
import * as ui from './ui.js';

const STORAGE_PREFIX = "classic_game_";

// Carrega estado do localStorage
function loadState() {
    return {
        attempts: JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'guesses')) || [],
        attemptsCount: parseInt(localStorage.getItem(STORAGE_PREFIX + 'attempts')) || 0,
        hints: parseInt(localStorage.getItem(STORAGE_PREFIX + 'hints')) || 0,
        progress: parseFloat(localStorage.getItem(STORAGE_PREFIX + 'progress')) || 0,
        finished: localStorage.getItem(STORAGE_PREFIX + 'finished') === 'true' || false
    };
}

// Salva estado no localStorage
function saveState(state) {
    localStorage.setItem(STORAGE_PREFIX + 'guesses', JSON.stringify(state.attempts));
    localStorage.setItem(STORAGE_PREFIX + 'attempts', state.attemptsCount.toString());
    localStorage.setItem(STORAGE_PREFIX + 'hints', state.hints.toString());
    localStorage.setItem(STORAGE_PREFIX + 'progress', state.progress.toString());
    localStorage.setItem(STORAGE_PREFIX + 'finished', state.finished.toString());
}

// Limpa estado
function clearState() {
    localStorage.removeItem(STORAGE_PREFIX + 'guesses');
    localStorage.removeItem(STORAGE_PREFIX + 'attempts');
    localStorage.removeItem(STORAGE_PREFIX + 'hints');
    localStorage.removeItem(STORAGE_PREFIX + 'progress');
    localStorage.removeItem(STORAGE_PREFIX + 'finished');
}

// Inicializa novo jogo clássico
export function newGame() {
    const state = { attempts: [], attemptsCount: 0, hints: 0, progress: 0, finished: false };
    saveState(state);
    return state;
}

// Adiciona uma tentativa
export function addAttempt(state, attempt) {
    if (state.finished) return state;
    state.attempts.push(attempt);
    state.attemptsCount++;
    if (attempt.correct) {
        state.finished = true;
    }
    if (state.attemptsCount >= 10 && !state.finished) {
        state.finished = true;
    }
    saveState(state);
    return state;
}

// Usa uma dica
export function useHint(state, hint) {
    state.hints++;
    state.attempts.push(hint);
    state.attemptsCount++;
    saveState(state);
    return state;
}

// Atualiza progresso (similar ao diário)
export function updateProgress(state, progressFillEl) {
    if (!state.attempts || state.attempts.length === 0) {
        progressFillEl.style.width = "0%";
        return;
    }
    const last = state.attempts[state.attempts.length - 1];
    const percentage = Math.max(0, 100 - (last.rank / 1000) * 100);
    state.progress = Math.max(state.progress, percentage);
    progressFillEl.style.width = `${state.progress}%`;
}

// Renderiza tentativas
export function renderAttempts(state, guessListEl) {
    ui.renderAttempts(guessListEl, state.attempts);
}

// Verifica se terminou
export function isFinished(state) {
    return state.finished;
}

// Mostra resultado final
export function showResult(state, resultAreaEl, finalWordEl, finalAttemptsEl, word) {
    ui.showResult(resultAreaEl, finalWordEl, finalAttemptsEl, state.attempts, state.finished, word);
}

// Retorna estado atual
export function getState() {
    return loadState();
}
