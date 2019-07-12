const bcrypt = require('bcryptjs');

export const hashPassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    return bcrypt.hash(password, 8);
};
