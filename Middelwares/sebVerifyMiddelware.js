import { createHash } from 'crypto';

export const verifySEB = (req, res, next) => {
    const sebHash = req.headers['x-safeexambrowser-requesthash'];
    
    const SEB_EXAM_KEY = process.env.SEB_EXAM_KEY;

    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const expected = createHash('sha256')
        .update(url + SEB_EXAM_KEY)
        .digest('hex');

    console.log("=== SEB DEBUG ===");
    console.log("Received:", sebHash);
    console.log("Expected:", expected);
    console.log("Match:", sebHash === expected);

    if (!sebHash) {
        return res.status(403).json({
            message: 'You must open Exam in Safe Exam Browser'
        });
    }

    if (sebHash.toLowerCase() !== expected.toLowerCase()) {
        return res.status(403).json({
            message: 'Unreliable Safe Exam Browser'
        });
    }

    next();
};