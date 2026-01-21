const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendOTP } = require('../services/emailService');

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

exports.register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Check existing
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Create user with unverified status
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false,
                role: 'user' // Default
            }
        });

        // Send OTP
        await sendOTP(email, otp);

        res.status(201).json({ message: 'Registration successful. OTP sent to email.', userId: user.id });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.otp !== otp || new Date() > new Date(user.otpExpires)) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Verify user
        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpires: null
            }
        });

        // Login session
        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login failed' });
            return res.json({ message: 'Verification successful', user });
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.googleId) {
            // If user only has googleId (no password), or not found
            if (user && user.googleId && !user.password) {
                return res.status(400).json({ error: 'Please login with Google' });
            }
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            // Resend OTP logic could be here
            return res.status(403).json({ error: 'Account not verified. Please verify OTP.' });
        }

        req.login(user, (err) => {
            if (err) return next(err);
            return res.json({ message: 'Logged in successfully', user });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
