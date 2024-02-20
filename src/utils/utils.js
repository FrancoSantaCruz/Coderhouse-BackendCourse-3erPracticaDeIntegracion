import bcrypt from 'bcrypt';

// BCRYPT
export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
};

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
}
