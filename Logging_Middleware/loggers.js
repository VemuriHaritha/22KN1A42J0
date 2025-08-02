const axios = require("axios");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2a3ZpamF5a3VtYXJ2azIyQGdtYWlsLmNvbSIsImV4cCI6MTc1NDExNTE1NiwiaWF0IjoxNzU0MTE0MjU2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiY2U4MTM0NTMtNjg3OC00ZWIzLThjMDYtZDdlYzUxMTFmYWQxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaGFyaXRoYSB2ZW11cmkiLCJzdWIiOiJiMzI0MDY4Ny0wODc3LTRmYmMtYTY0Yi02MzA0NmVkZjFiZWMifSwiZW1haWwiOiJ2a3ZpamF5a3VtYXJ2azIyQGdtYWlsLmNvbSIsIm5hbWUiOiJoYXJpdGhhIHZlbXVyaSIsInJvbGxObyI6IjIya24xYTQyajAiLCJhY2Nlc3NDb2RlIjoienVQZGt3IiwiY2xpZW50SUQiOiJiMzI0MDY4Ny0wODc3LTRmYmMtYTY0Yi02MzA0NmVkZjFiZWMiLCJjbGllbnRTZWNyZXQiOiJGS0RRTkJWWVVXVnBweHRqIn0.nmV_ATfP02wur-T4FWpYGzSDTJhwinnhSn9a2Ry_UKs";

async function Log(stack, level, pkg, message) {
    try {
        await axios.post("http://20.244.56.144/evaluation-service/logs", {
            stack,
            level,
            package: pkg,
            message
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (err) {
        console.error("logging failed:", err.message);
    }
}

function requestLogger(req, res, next) {
    Log("backend", "info", "route", `${req.method} ${req.url} called`);
    next();
}

module.exports = { Log, requestLogger };
