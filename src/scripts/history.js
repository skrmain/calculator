const STORAGE_KEY = 'calculationHistory';

export function loadHistory() {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(history) ? history : [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
        // storage unavailable or full
    }
}

export function addHistory(expression, result) {
    const history = loadHistory();
    history.unshift({ id: Date.now() + Math.random(), expression, result });
    saveHistory(history);
    return history;
}

export function removeHistory(id) {
    const history = loadHistory().filter((item) => item.id !== id);
    saveHistory(history);
    return history;
}
