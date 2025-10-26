import type { User, StudyProgress, PlacementTestResult } from '../types';

const USERS_KEY = 'app_users';

const getUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("Error parsing users from localStorage", error);
        return [];
    }
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByNameLocal = (name: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.name.toLowerCase() === name.toLowerCase());
};

export const registerUserLocal = (name: string, password: string): { success: boolean, message?: string } => {
    const users = getUsers();
    if (findUserByNameLocal(name)) {
        return { success: false, message: 'Tên người dùng đã tồn tại.' };
    }
    // Create a user without level/progress, which will be added after placement test
    const newUser: Partial<User> = { name, password, studyProgress: {} };
    users.push(newUser as User);
    saveUsers(users);
    return { success: true };
};

export const loginUserLocal = (name: string, password: string): { success: boolean, user?: User, message?: string } => {
    const user = findUserByNameLocal(name);
    if (user && user.password === password) {
        return { success: true, user };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
};

export const updateUserProgressLocal = (name: string, progress: StudyProgress): void => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase());
    if (userIndex !== -1) {
        users[userIndex].studyProgress = progress;
        saveUsers(users);
    }
};

export const completePlacementTestLocal = (name: string, result: PlacementTestResult): User | undefined => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase());
    if (userIndex !== -1) {
        const updatedUser: User = {
            ...users[userIndex],
            level: result.level,
            placementTestResult: result,
            studyProgress: users[userIndex].studyProgress || {}, // Preserve progress if any
        };
        users[userIndex] = updatedUser;
        saveUsers(users);
        return updatedUser;
    }
    return undefined;
};