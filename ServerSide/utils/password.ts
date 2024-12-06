import bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string) =>{
    const salt = bcryptjs.genSaltSync(10);
    return await bcryptjs.hash(password, salt);
}


export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcryptjs.compare(password, hashedPassword);
}
