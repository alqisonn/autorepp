const nodemailer = require('nodemailer');

const API_KEY = 'alqi01';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method Not Allowed'
        });
    }

    try {
        const {
            apiKey,
            sender,
            password,
            target,
            subject,
            body
        } = req.body || {};

        // Validasi API Key
        if (apiKey !== API_KEY) {
            return res.status(401).json({
                success: false,
                message: 'API Key Invalid'
            });
        }

        // Validasi parameter
        if (!sender  !password  !target  !subject  !body) {
            return res.status(400).json({
                success: false,
                message: 'Parameter tidak lengkap!'
            });
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(sender) || !emailRegex.test(target)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid!'
            });
        }

        // Konfigurasi Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender,
                pass: password
            },
            connectionTimeout: 15000,
            greetingTimeout: 10000,
            socketTimeout: 20000
        });

        // Kirim email
        await transporter.sendMail({
            from: sender,
            to: target,
            subject: subject,
            text: body
        });

        return res.status(200).json({
            success: true,
            message: 'Email Berhasil Terkirim!'
        });

    } catch (error) {
        console.error('SEND EMAIL ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal mengirim email',
            error: error.message
        });
    }
};
