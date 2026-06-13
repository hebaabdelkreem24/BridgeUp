// Middelwares/sebVerify.js
import crypto from 'crypto';

const SEB_EXAM_KEY = process.env.SEB_EXAM_KEY;

export const verifySEB = (req, res, next) => {
    const sebHash = req.headers['x-safeexambrowser-requesthash'];

    if (!sebHash) {
        return res.status(403).json({
            message: 'You must open Exam in Safe Exam Browser'
        });
    }

    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const expected = crypto
        .createHash('sha256')
        .update(url + SEB_EXAM_KEY)
        .digest('hex');

    if (sebHash.toLowerCase() !== expected.toLowerCase()) {
        return res.status(403).json({
            message: 'Unreliable Safe Exam Browser  '
        });
    }

    next();
};

