import crypto from 'crypto';

const SEB_EXAM_KEY = "6283cb5d3dc1627210d2b7fa5b223183417425e10c5f20e75f1026b89daf322b";
const url = "http://localhost:5000/api/v1/assessments/start";

const hash = crypto
    .createHash('sha256')
    .update(url + SEB_EXAM_KEY)
    .digest('hex');

console.log("Hash:", hash);