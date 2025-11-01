import type { User, StudyProgress, PlacementTestResult, DailyProgress } from '../types';

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

export const getAllUsersLocal = (): User[] => {
    return getUsers();
};

export const findUserByNameLocal = (name: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.name.toLowerCase() === name.toLowerCase());
};

export const registerUserLocal = (name: string, password: string): { success: boolean, user?: User, message?: string } => {
    const users = getUsers();
    if (findUserByNameLocal(name)) {
        return { success: false, message: 'Tên người dùng đã tồn tại.' };
    }
    
    const newUser: User = { 
        name, 
        password, 
        level: 'A2', // Default level
        studyProgress: {}, 
        dailyProgress: undefined, 
        challengeProgress: {},
        placementTestResult: undefined, // No test taken yet
        customWords: [],
    };
    users.push(newUser);
    saveUsers(users);
    
    // Log in the new user immediately
    sessionStorage.setItem('loggedInUser', newUser.name);
    return { success: true, user: newUser };
};

export const loginUserLocal = (name: string, password: string): { success: boolean, user?: User, message?: string } => {
    const user = findUserByNameLocal(name);
    if (user && user.password === password) {
        return { success: true, user };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
};

export const updateUserLocal = (updatedUser: User): void => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === updatedUser.name.toLowerCase());
    if (userIndex !== -1) {
        // Preserve password if it's not included in the update
        const existingPassword = users[userIndex].password;
        users[userIndex] = { ...updatedUser, password: updatedUser.password || existingPassword };
        saveUsers(users);
    }
};

export const updateUserProgressLocal = (name: string, progress: StudyProgress): void => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase());
    if (userIndex !== -1) {
        users[userIndex].studyProgress = progress;
        saveUsers(users);
    }
};

export const updateUserDailyProgressLocal = (name: string, progress: DailyProgress): void => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name.toLowerCase());
    if (userIndex !== -1) {
        users[userIndex].dailyProgress = progress;
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
        };
        users[userIndex] = updatedUser;
        saveUsers(users);
        return updatedUser;
    }
    return undefined;
};