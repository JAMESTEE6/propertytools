// auth.js - 帳號驗證 & 審核系統
const ADMIN = {
    account: "admin",       // 你的管理員帳號
    password: "admin123456"// 你的管理員密碼，可自行修改
};

// --- 註冊功能 ---
function register(newAcc, newPwd, confirmPwd) {
    // 基本驗證
    if (!newAcc || !newPwd || !confirmPwd) {
        return { success: false, msg: "❌ 請填寫所有欄位" };
    }
    if (newPwd !== confirmPwd) {
        return { success: false, msg: "❌ 密碼不一致" };
    }
    if (newAcc === ADMIN.account) {
        return { success: false, msg: "❌ 此帳號為管理員專用" };
    }

    // 檢查帳號是否已存在（待審核 + 已通過）
    const pending = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    const approved = JSON.parse(localStorage.getItem("approvedUsers") || "[]");
    const allUsers = [...pending, ...approved];

    if (allUsers.find(u => u.account === newAcc)) {
        return { success: false, msg: "❌ 帳號已存在" };
    }

    // 加入待審核名單
    pending.push({
        account: newAcc,
        password: newPwd,
        status: "pending",
        regTime: new Date().toLocaleString()
    });
    localStorage.setItem("pendingUsers", JSON.stringify(pending));
    return { success: true, msg: "✅ 註冊成功！請等待管理員審核" };
}

// --- 登入功能 ---
function login(acc, pwd) {
    // 管理員登入
    if (acc === ADMIN.account && pwd === ADMIN.password) {
        localStorage.setItem("currentUser", ADMIN.account);
        return { success: true, isAdmin: true, msg: "登入成功" };
    }

    // 一般使用者登入 → 先找已通過的帳號
    const approved = JSON.parse(localStorage.getItem("approvedUsers") || "[]");
    const user = approved.find(u => u.account === acc && u.password === pwd);
    if (user) {
        localStorage.setItem("currentUser", user.account);
        return { success: true, isAdmin: false, msg: "登入成功" };
    }

    // 沒找到 → 檢查是否在待審核名單
    const pending = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    const pendingUser = pending.find(u => u.account === acc && u.password === pwd);
    if (pendingUser) {
        return { success: false, msg: "⏳ 帳號已註冊，等待管理員審核中" };
    }

    // 都沒有 → 帳密錯誤
    return { success: false, msg: "❌ 帳號或密碼錯誤" };
}

// --- 管理員：審核通過 ---
function approveUser(index) {
    let pending = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    let approved = JSON.parse(localStorage.getItem("approvedUsers") || "[]");
    const user = pending.splice(index, 1)[0];
    user.status = "approved";
    user.approveTime = new Date().toLocaleString();
    approved.push(user);
    localStorage.setItem("pendingUsers", JSON.stringify(pending));
    localStorage.setItem("approvedUsers", JSON.stringify(approved));
}

// --- 管理員：拒絕帳號 ---
function rejectUser(index) {
    let pending = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    pending.splice(index, 1);
    localStorage.setItem("pendingUsers", JSON.stringify(pending));
}

// --- 檢查是否已登入 ---
function checkLogin() {
    const user = localStorage.getItem("currentUser");
    if (!user) {
        window.location.href = "login.html";
    }
}

// --- 檢查是否為管理員 ---
function checkAdmin() {
    const user = localStorage.getItem("currentUser");
    if (!user || user !== ADMIN.account) {
        alert("❌ 沒有權限！");
        window.location.href = "index.html";
    }
}

// --- 登出 ---
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
