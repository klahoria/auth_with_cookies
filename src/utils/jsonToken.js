// import Cookies from "cookies";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import util from 'util';

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
const COOKIE_KEYS = (process.env.COOKIE_KEYS || 'test_cookie_key').split(',');
const TOKEN_EXPIRY_SECONDS = parseInt(process.env.TOKEN_EXPIRY_SECONDS || '3600', 10); // seconds
const COOKIE_NAME = process.env.COOKIE_NAME || 'auth';
const IS_PROD = process.env.NODE_ENV === 'production';



function signToken(payload, expiresInSeconds = TOKEN_EXPIRY_SECONDS) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });
}

function setAuthCookie(req, res, token, maxAgeSeconds = TOKEN_EXPIRY_SECONDS) {
    const cookies = new Cookies(req, res, { keys: COOKIE_KEYS });
    const expiresAt = Date.now() + maxAgeSeconds * 1000;

    // Store token and metadata as JSON string. Cookie itself is signed by `cookies` lib.
    const cookieValue = JSON.stringify({
        token,
        maxAgeSeconds,
        expiresAt
    });

    cookies.set(COOKIE_NAME, cookieValue, {
        httpOnly: true,
        secure: IS_PROD,       // true in production (requires HTTPS)
        signed: true,          // signs the cookie with COOKIE_KEYS
        sameSite: 'lax',
        maxAge: maxAgeSeconds * 1000, // in ms
        expires: new Date(expiresAt)
    });
}

function clearAuthCookie(req, res) {
    const cookies = new Cookies(req, res, { keys: process.env.COOKIE_KEYS || 'preocess_cookie' });
    const cookieRaw = cookies.get(COOKIE_NAME, { signed: true })
    if (!cookieRaw) {
        return res.status(401).json({ error: 'No auth cookie' })
    }
}

async function verifyAuth(req, res, next) {
    const cookies = new Cookies(req, res, { keys: COOKIE_KEYS });
    const cookieRaw = cookies.get(COOKIE_NAME, { signed: true });

    if (!cookieRaw) {
        return res.status(401).json({ error: 'No auth cookie' });
    }

    let cookieData;
    try {
        cookieData = JSON.parse(cookieRaw);
    } catch (err) {
        // Bad cookie format - clear and reject
        clearAuthCookie(req, res);
        return res.status(401).json({ error: 'Invalid auth cookie' });
    }

    const { token, maxAgeSeconds, expiresAt } = cookieData;
    if (!token) {
        clearAuthCookie(req, res);
        return res.status(401).json({ error: 'No token in cookie' });
    }

    // Verify JWT (promisify jwt.verify)
    const verifyAsync = util.promisify(jwt.verify);
    let payload;
    try {
        payload = await verifyAsync(token, JWT_SECRET);
    } catch (err) {
        // token invalid or expired
        clearAuthCookie(req, res);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // token is valid. compute time left.
    // jwt `exp` is in seconds since epoch
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = payload.exp; // available because we used expiresIn when signing
    const timeLeftSec = Math.max(0, expSec - nowSec);

    // If cookie metadata present, compute threshold. If not, use maxAgeSeconds.
    const originalMaxAge = (maxAgeSeconds && Number(maxAgeSeconds)) || TOKEN_EXPIRY_SECONDS;

    // If less than half time left => refresh (issue new token and cookie)
    if (timeLeftSec < (originalMaxAge / 2)) {
        // New maxAge: double original (but you may want a cap)
        const newMaxAge = Math.min(originalMaxAge * 2, 60 * 60 * 24 * 7); // cap: 7 days (example)
        const newToken = signToken({ id: payload.id, username: payload.username }, newMaxAge);

        // set new cookie with updated expiry metadata
        setAuthCookie(req, res, newToken, newMaxAge);

        // decode new token to attach user info
        try {
            const decodeAsync = util.promisify(jwt.verify);
            payload = await decodeAsync(newToken, JWT_SECRET);
        } catch (err) {
            // unlikely immediately after sign
            clearAuthCookie(req, res);
            return res.status(401).json({ error: 'Failed to refresh token' });
        }
    }

    // Attach user payload (without sensitive fields)
    req.user = {
        id: payload.id,
        username: payload.username
    };

    next();
}




export {
    signToken,
    setAuthCookie,
    clearAuthCookie,
    verifyAuth,
}