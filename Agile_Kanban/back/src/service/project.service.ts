import { Provide } from '@midwayjs/core';
import { promises as fs } from 'fs';
import { join } from 'path';

@Provide()
export class ProjectService {
    private dataPath = 'F:/Projects/Agile_Kanban/back/datas';//不知道为啥相对路径不行

    async createProjects(userId: string, projects: any[]): Promise<{ success: boolean; message: string }> {
        try {
            for (const project of projects) {
                const userDir = join(this.dataPath, userId);
                const projectDirName = `${project.id}_${project.name}`;
                const projectDir = join(userDir, projectDirName);
                await fs.mkdir(userDir, { recursive: true });
                await fs.mkdir(projectDir, { recursive: true });
            }
            return { success: true, message: 'Projects created successfully' };
        } catch (error) {
            console.error('Error creating projects:', error);
            return { success: false, message: 'Failed to create projects' };
        }
    }

    async updateProjects(userId: string, projects: any[]): Promise<{ success: boolean; message: string }> {
        try {
            const userDir = join(this.dataPath, userId);

            for (const project of projects) {
                const newProjectDir = join(userDir, `${project.id}_${project.name}`);
                // 删除旧目录
                if (await this.directoryExists(userDir, project.id)) {
                    await this.deleteProject(userId, project.id)
                }
                // 创建新目录
                await fs.mkdir(newProjectDir, { recursive: true });
            }

            return { success: true, message: 'Projects updated successfully' };
        } catch (error) {
            console.error('Error updating projects:', error);
            return { success: false, message: 'Failed to update projects' };
        }
    }

    private async directoryExists(userDir: string, id: number): Promise<boolean> {
        try {
            // 获取目录
            const dirs = await fs.readdir(userDir);
            const targetDir = dirs.find(dir => dir.startsWith(`${id}_`));
            return targetDir !== undefined;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false; // 目录不存在
            }
            throw error;
        }
    }

    async deleteProject(userId: string, projectId: number): Promise<{ success: boolean; message: string }> {
        try {
            const userDir = join(this.dataPath, userId);
            const dirs = await fs.readdir(userDir);
            const targetDir = dirs.find(dir => dir.startsWith(`${projectId}_`));

            if (targetDir) {
                const projectDir = join(userDir, targetDir);
                await this.deleteDirectory(projectDir);
                return { success: true, message: 'Project deleted successfully' };
            } else {
                return { success: false, message: 'Project not found' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to delete project' };
        }
    }

    private async deleteDirectory(path: string): Promise<void> {
        try {
            const files = await fs.readdir(path);
            for (const file of files) {
                const filePath = join(path, file);
                const stats = await fs.stat(filePath);
                if (stats.isDirectory()) {
                    await this.deleteDirectory(filePath); // 递归删除子目录!!!!
                } else {
                    await fs.unlink(filePath); 
                }
            }
            await fs.rmdir(path);
        } catch (error) {
            throw new Error(`Failed delete${path}: ${error.message}`);
        }
    }

    async saveTasks(userId: string, projects: any[]): Promise<{ success: boolean; message: string }> {
        try {
            for (const project of projects) {
                await this.saveTasksToFiles(userId, project.id, project.name, project.tasks);
            }
            return { success: true, message: 'successful' };
        } catch (error) {
            console.error('Error', error);
            return { success: false, message: 'Failed save' };
        }
    }

    private async saveTasksToFiles(userId: string, projectId: number, projectName: string, tasks: any[]): Promise<void> {
        try {
            const projectDir = join(this.dataPath, userId, `${projectId}_${projectName}`);

            await fs.mkdir(projectDir, { recursive: true });

            for (const task of tasks) {
                const taskDir = join(projectDir, `${task.id}`);
                await fs.mkdir(taskDir, { recursive: true }); // 为每个任务创建独立目录
                // 保存任务信息
                const taskFilePath = join(taskDir, `info.txt`);
                const taskData = `Description: ${task.description}\nCompleted: ${task.completed}\nComments: ${task.comments.join(' | ')}`;
                await fs.writeFile(taskFilePath, taskData, 'utf-8');
                // 保存附件
                if (task.attachments) {
                    for (const attachment of task.attachments) {
                        const attachmentPath = join(taskDir, attachment.filename);
                        const attachmentData = Buffer.from(attachment.content, 'base64');
                        await fs.writeFile(attachmentPath, attachmentData);
                    }
                }
            }
        } catch (error) {
            throw new Error('Failed save');
        }
    }

    async getProjects(userId: string): Promise<any[]> {
        try {
            const userDir = join(this.dataPath, userId);
            const projectDirs = await fs.readdir(userDir);
            const projects: any[] = [];

            for (const dir of projectDirs) {
                const [id, name] = dir.split('_');
                const project: any = { id: parseInt(id, 10), name: name, tasks: [] };
                const taskDirs = await fs.readdir(join(userDir, dir));

                for (const taskDir of taskDirs) {
                    const taskDirPath = join(userDir, dir, taskDir);
                    const taskFilePath = join(taskDirPath, `info.txt`);
                    const fileContent = await fs.readFile(taskFilePath, 'utf-8');
                    const [descriptionLine, completedLine, commentsLine] = fileContent.split('\n');
                    const description = descriptionLine.replace('Description: ', '');
                    const completed = completedLine.replace('Completed: ', '') === 'true';
                    const comments = commentsLine ? commentsLine.replace('Comments: ', '').split(' | ') : [];

                    const task: any = {
                        id: parseInt(taskDir, 10),
                        description: description,
                        completed: completed,
                        comments: comments,
                        attachments: []
                    };

                    // 读取附件
                    const attachmentFiles = await fs.readdir(taskDirPath);
                    for (const file of attachmentFiles) {
                        if (file !== 'info.txt') {
                            const attachmentPath = join(taskDirPath, file);
                            const attachmentContent = await fs.readFile(attachmentPath);
                            task.attachments.push({
                                filename: file,
                                content: attachmentContent.toString('base64')
                            });
                        }
                    }

                    project.tasks.push(task);
                }
                projects.push(project);
            }

            return projects;
        } catch (error) {
            throw new Error('Failed retrieve');
        }
    }
}
