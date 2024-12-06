import {rateLimit} from 'express-rate-limit';

const Limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: true,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})

export default Limit;