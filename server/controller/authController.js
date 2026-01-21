const passport = require('passport');

exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }, (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login?error=auth_failed'); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }

            // Handle redirect from state
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            let redirectPath = '/';

            if (req.query.state) {
                try {
                    // Check if state is a URL or just a path
                    const decoded = decodeURIComponent(req.query.state);
                    // Simple security check: enforce relative path or same domain
                    if (decoded.startsWith('/')) {
                        redirectPath = decoded;
                    }
                } catch (e) {
                    console.error('Error decoding state', e);
                }
            }

            res.redirect(`${clientUrl}${redirectPath}`);
        });
    })(req, res, next);
};


exports.getMe = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: req.user
        });
    } else {
        res.json({
            authenticated: false,
            user: null
        });
    }
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
    });
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateProfile = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { incomeRange, exactIncome } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                incomeRange: incomeRange || null,
                exactIncome: exactIncome || null
            }
        });

        res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
