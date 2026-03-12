const API_CONFIG = {
    baseUrl: "https://study-timer-api-pd-0-production.up.railway.app",
    startSessionUrl: "/start",
    stopSessionUrl: "/stop",
    getSessionsUrl: "/session"
};

let seconds = 0;
let intervalId = null;
let isRunning = false;
let sessionStartTime = null;
let sessionStopTime = null;
let sessionsVisible = false;

const button = document.getElementById("mystudy");
const text = document.getElementById("study");


function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

function updateDisplay() {
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.innerText = formatTime(seconds);
}

function setStatus(message) {
    const statusEl = document.getElementById("status-text");
    if (statusEl) statusEl.innerText = message;
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    sessionStartTime = new Date();

    setStatus("STUDYING...");
    document.getElementById("app")?.classList.add("running");
    document.getElementById("btn-start").disabled = true;

    intervalId = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

function stopTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(intervalId);

    sessionStopTime = new Date();

    document.getElementById("app")?.classList.remove("running");
    document.getElementById("btn-start").disabled = false;

    setStatus("PAUSED");

    stopSessionAPI();
}

async function stopSessionAPI() {
    if (!sessionStartTime) return;

    try {
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.stopSessionUrl, {
            method: "POST"
        });

        if (!response.ok) throw new Error(`Stop failed: ${response.status}`);

        const data = await response.json();
        console.log("Session stopped on server:", data);

        sessionStopTime = new Date();
        setStatus("PAUSED");

    } catch (err) {
        console.error("STOP ERROR:", err);
        setStatus("STOP ERROR");
    }
}


async function renderSessions() {
    const container = document.getElementById("sessions-container");
    const list = document.getElementById("sessions-list");

    try {
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.getSessionsUrl);
        const data = await response.json();

        const lastThree = data.slice(-3).reverse(); 

        list.innerHTML = lastThree
            .map(s => {
                const start = new Date(s.start).toLocaleString();
                const end = s.end ? new Date(s.end).toLocaleString() : "Ongoing";
                return `<li><strong>${s.subject}</strong><br>${start} → ${end}</li>`;
            })
            .join("");

    } catch (err) {
        console.error("FETCH ERROR:", err);
        setStatus("FETCH ERROR");
    }
}


async function saveSession() {
    if (isRunning) stopTimer();

    const subjectInput = document.getElementById("subject-input");
    const subject = (subjectInput?.value || "General study").trim();

    setStatus("SAVING...");
    try {
        
        await fetch(API_CONFIG.baseUrl + API_CONFIG.stopSessionUrl, { method: "POST" }).catch(()=>{});

        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.startSessionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject })
        });

        if (!response.ok) throw new Error(`Start failed: ${response.status}`);

        const data = await response.json();
        console.log("Session started:", data);

        seconds = 0;
        updateDisplay();
        if (subjectInput) subjectInput.value = "";
        sessionStartTime = new Date();
        sessionStopTime = null;

        setStatus("SAVED!");
        await renderSessions(); 

    } catch (error) {
        console.error("SAVE ERROR:", error);
        setStatus("CONNECTION ERROR");
    }
}


button.addEventListener('click', async () => {
    const container = document.getElementById("sessions-container");

    if (!sessionsVisible) {
        await renderSessions();     
        container.classList.add("show");
        sessionsVisible = true;
    } else {
        container.classList.remove("show");
        sessionsVisible = false;
    }
});