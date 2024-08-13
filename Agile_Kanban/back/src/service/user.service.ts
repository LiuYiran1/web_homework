import { Provide } from '@midwayjs/core';
import { promises as fs } from 'fs';
import { join } from 'path';

@Provide()
export class UserService {
    private filePath = 'F:/Projects/Agile_Kanban/back/datas/login_infro.txt';

    async saveData(username: string, password: string): Promise<string> {
        let existingData = '';
        try {
            existingData = await fs.readFile(this.filePath, 'utf-8');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        const idTem = existingData.split('\n').filter(line => line.trim() !== '');
        let lastId = '0';
        if (idTem.length > 0) {
            const lastLine = idTem[idTem.length - 1]; // 取最后一行
            if (lastLine) {
                const idTemTem = lastLine.split(',');
                lastId = idTemTem[0] || '0';
            }
        }
        const nextId = parseInt(lastId, 10) + 1;
        const nextIdStr = nextId.toString();
        const userData = `${nextIdStr},${username},${password}\n`;

        await fs.appendFile(this.filePath, userData, 'utf-8');
        return nextIdStr;
    }

    async register(username: string, password: string): Promise<{ success: boolean; userId?: string; message: string }> {
        try {
            const id = await this.saveData(username, password);
            const dirPath = join('datas', id);

            // 创建目录
            await fs.mkdir(dirPath, { recursive: true });
            return { success: true, userId: id, message: 'Registration successful' };
        } catch (error) {
            console.error('Error registration:', error);
            throw new Error('Registration failed');
        }
    }

    async getUser(uid: string): Promise<{ id: string; username: string; password: string } | null> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const lines = data.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                const [id, username, password] = line.split(',');
                if (id === uid) {
                    return { id, username, password };
                }
            }

            return null; //没有找到用户
        } catch (error) {
            console.error('Error retrieving user:', error);
            throw new Error('Failed to retrieve user');
        }
    }

    async login(username: string, password: string): Promise<{ success: boolean; userId?: string; message: string }> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const lines = data.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                const [id, storedUsername, storedPassword] = line.split(',');
                if (storedUsername === username && storedPassword === password) {
                    return { success: true, userId: id, message: 'Login successful' };
                }
            }

            return { success: false, message: 'Invalid username or password' };
        } catch (error) {
            throw new Error('Login failed');
        }
    }

    
}
