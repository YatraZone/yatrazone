import axios from 'axios';

export const sendOTP = async (email, otp, message, subject) => {
    const data = {
        sender: {
            name: 'YatraZone',
            email: 'info@yatrazone.com',
        },
        to: [
            {
                email,
            },
        ],
        subject: subject,
        htmlContent: message,
    };

    try {
        await axios.post('https://api.brevo.com/v3/smtp/email', data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
            },
        });
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error.response?.data || error.message);
        return false;
    }
};