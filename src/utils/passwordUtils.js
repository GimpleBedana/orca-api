import argon2 from 'argon2';

export const hashPassword = async (password) => {
    return await argon2.hash(password, {
      type: argon2.argon2id,  // Recommended type for best security
      memoryCost: 2 ** 16,    // 64MB memory cost
      timeCost: 3,             // 3 iterations
      parallelism: 1,          // 1 thread
      hashLength: 32           // 32 bytes hash length
    });
};

export const verifyPassword = async (password, hash) => {
    return await argon2.verify(hash, password);
};
