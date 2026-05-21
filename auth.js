// 共用功能檔案
function getMYTime() {
    const d = new Date();
    d.setHours(d.getHours() + 8);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const sec = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}:${sec}`;
}

// 檢查是否已登入
function checkLogin() {
    if(localStorage.getItem("isLogin") !== "true") {
        window.location.href = "login.html";
        return;
    }
    showUserInfo();
    localStorage.setItem("lastLogin", getMYTime());
}

// 顯示登入資訊
function showUserInfo() {
    const user = localStorage.getItem("loginUser") || "Guest";
    const lastTime = localStorage.getItem("lastLogin") || "-";
    const infoBox = document.getElementById("userInfo");
    if(infoBox) infoBox.innerHTML = `Welcome: ${user} &nbsp; | &nbsp; LAST LOGIN: ${lastTime}`;
}

// 登出功能
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// 單獨更新銀行時間
function updateBankTime(bankCode) {
    const el = document.querySelector(`.update-text[data-bank="${bankCode}"]`);
    if(el) el.textContent = `Last Updated: ${getMYTime()} by Admin`;
}

window.onload = checkLogin;
