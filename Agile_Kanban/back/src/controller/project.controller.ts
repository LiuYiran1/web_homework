import { Controller, Post, Body, Inject, Put,Get,Query } from '@midwayjs/core';
import { ProjectService } from '../service/project.service';

@Controller('/projects')
export class ProjectController {
  @Inject()
  projectService: ProjectService;

  @Post('/')
  async createProject(@Body() body: { userId: string; projects: any[] }) {
    console.log('Create project request received:', body);
    const { userId, projects } = body;
    const result = await this.projectService.createProjects(userId, projects);
    return result;
  }
  
  @Put('/')
  async updateProject(@Body() body: { userId: string; projects: any[] }) {
    console.log('Update project request received:', body);
    const { userId, projects } = body;
    const result = await this.projectService.updateProjects(userId, projects);
    return result;
  }

  @Post('/delete')
  async deleteProject(@Body() body: { userId: string; projectId: number }) {
    console.log('Delete project request received:', body);
    const { userId, projectId } = body;
    const result = await this.projectService.deleteProject(userId, projectId);
    return result;
  }

  @Post('/tasks')
  async saveTasks(@Body() body: { userId: string; projects: any[] }) {
    console.log('Save tasks request received:', body);
    const { userId, projects } = body;
    const result = await this.projectService.saveTasks(userId, projects);
    return result;
  }

  @Get('/')
  async getProjects(@Query() query: { userId: string }) {
    console.log('Get projects request received:', query);
    const { userId } = query;
    const result = await this.projectService.getProjects(userId);
    return result;
  }
}
