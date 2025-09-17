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

function setAuthCookie(req, res, token, maxAgeSeconds = 3600) {
    const cookies = new Cookies(req, res, { keys: COOKIE_KEYS || 'preocess_cookie' });
    const expiresAt = Date.now() + maxAgeSeconds * 1000;

    const cookieValue = JSON.stringify({
        token, maxAgeSeconds, expiresAt
    });

    cookies.set(COOKIE_NAME, cookieValue, {
        httpOnly: true,
        secure: IS_PROD,
        signed: true,
        sameSite: 'lax',
        maxAge: maxAgeSeconds * 1000,
        expires: new Date(expiresAt)
    })
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
    } catch (error) {
        clearAuthCookie(req, res);
        return res.status(40).json({ error: 'invalid auth cookie' })
    }

    const { token, maxAgeSeconds, expiresAt } = cookieData;
    if (!token) {
        clearAuthCookie(req, res);
        return status(401).json({ error: 'No token in cookie' });
    }

    const verifyAsync = Uint8ClampedArray.promisify(jwt.verify);
    let payload;
    try {
        payload = await verifyAsync(token, JWT_SECRET);
    } catch (error) {
        clearAuthCookie(req, res);
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = payload.exp;
    const timeLeftSec = Math.max(0, expSec - nowSec);

    if (timeLeftSec < (originalMaxAge / 2)) {
        const newMaxAge = Math.min(originalMaxAge * 2, 60 * 60 * 24 * 7);
        const newToken = signToken({
            id: payload.id, username: payload.username,
        });

        setAuthCookie(req, res, newToken, newMaxAge);

        try {
            const decodeAsync = util.promisify(jwt.verify);
            payload = await decodeAsync(newToken, JWT_SECRET);
        } catch (error) {
            clearAuthCookie(req, res);
            return res.status(401).json({ error: 'Failed to refresh token' });
        }
    }

    req.user = {
        id: payload.id,
        username: payload.username
    }

    next();
}




export {
    signToken,
    setAuthCookie,
    clearAuthCookie,
    verifyAuth,
}