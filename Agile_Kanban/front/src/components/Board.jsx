import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Board.css';
import { useNavigate } from 'react-router-dom';
import expandedIcon from "../assets/image/icon.png";

function Board() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);//用户id
  const [isExpanded, setIsExpanded] = useState(true);//折叠按钮
  const [projects, setProjects] = useState([]);//项目
  const [isEditing, setIsEditing] = useState(false);//编辑项目
  const [currentProject, setCurrentProject] = useState(null);//当前项目
  const [selectedProject, setSelectedProject] = useState(null);//被选项目
  const [newTaskDescription, setNewTaskDescription] = useState('');//任务描述
  const [editingTask, setEditingTask] = useState(null);//编辑任务
  const [editedTaskDescription, setEditedTaskDescription] = useState('');
  const [newComment, setNewComment] = useState('');//评论
  const [uploadedFile, setUploadedFile] = useState(null);//附件

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const getProjects = async () => {
        try {
          const response = await axios.get(`/api/projects?userId=${userId}`);
          setProjects(response.data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };

      getProjects();
    }
  }, [userId]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (!userId) return;

      try {
        await axios.post('/api/projects/tasks', { userId, projects });
      } catch (error) {
        console.error('Error saving projects:', error);
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, projects]);

  const deregister = async () => {
    if (!userId || !projects.length) return;

    try {
      await axios.post('/api/projects/tasks', { userId, projects });
    } catch (error) {
      console.error('Error saving projects before logout:', error);
    }

    navigate('/');
  };

  const changeLeftAreaState = () => {
    setIsExpanded(!isExpanded);
  };

  const getNextId = () => {
    if (projects.length === 0) {
      return 1;
    }
    const maxId = Math.max(...projects.map(project => project.id));
    return maxId + 1;
  };

  const addProject = async () => {
    if (!userId) return;

    const newProject = {
      id: getNextId(),
      name: `项目`,
      tasks: []
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);

    try {
      await axios.post('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleProjectClick = (project) => {
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  const handleProjectDoubleClick = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleProjectNameChange = (e) => {
    setCurrentProject({
      ...currentProject,
      name: e.target.value
    });
  };

  const handleSave = async () => {
    if (!userId) return;

    const updatedProjects = projects.map(project =>
      project.id === currentProject.id ? currentProject : project
    );
    setProjects(updatedProjects);
    setIsEditing(false);

    try {
      await axios.put('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async (projectId) => {
    if (!userId) return;

    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    setIsEditing(false);

    try {
      await axios.post('/api/projects/delete', { userId, projectId });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddTask = async () => {
    if (!userId || !selectedProject) return;

    const newTask = {
      id: Date.now(),
      description: newTaskDescription,
      completed: false,
      comments: [],
      attachments: uploadedFile ? [uploadedFile] : []
    };

    const updatedProject = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, newTask]
    };

    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
    setNewTaskDescription('');
    setUploadedFile(null);

    try {
      await axios.put('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTaskToggleComplete = async (taskId) => {
    if (!userId || !selectedProject) return;

    const updatedTasks = selectedProject.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks
    };

    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);

    try {
      await axios.put('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!userId || !selectedProject) return;

    const updatedTasks = selectedProject.tasks.filter(task => task.id !== taskId);

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks
    };

    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);

    try {
      await axios.put('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskDoubleClick = (task) => {
    setEditingTask(task);
    setEditedTaskDescription(task.description);
  };

  const handleTaskDescriptionChange = (e) => {
    setEditedTaskDescription(e.target.value);
  };

  const handleTaskSave = async () => {
    if (!userId || !selectedProject || !editingTask) return;

    const updatedTasks = selectedProject.tasks.map(task =>
      task.id === editingTask.id ? { ...task, description: editedTaskDescription } : task
    );

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks
    };

    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
    setEditingTask(null);

    try {
      await axios.put('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskCancel = () => {
    setEditingTask(null);
  };

  const handleAddComment = async (taskId) => {
    if (!userId || !selectedProject || !newComment.trim()) return;

    const updatedTasks = selectedProject.tasks.map(task =>
      task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task
    );

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks
    };

    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
    setNewComment('');

    try {
      await axios.put('/api/projects', { userId, projects: updatedProjects });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({ filename: file.name, content: reader.result.split(',')[1] });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='container'>
      <div className={`left_area ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button className='expandedIcon' onClick={changeLeftAreaState}>
          <img src={expandedIcon} alt="Expand/Collapse Icon" className='expandedIconImg' />
        </button>
        <div className='projects_menu'>
          <button className='addProject' onClick={addProject}>
            {isExpanded ? '创建新项目' : '✚'}
          </button>
        </div>
        <div className='projects_area'>
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              onDoubleClick={() => handleProjectDoubleClick(project)}
              className={`every_project ${selectedProject?.id === project.id ? 'selected' : ''}`}
            >
              <div className='project_name'>{isExpanded ? project.name : '⊙'}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={`right_area ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button className='deregisterButton' onClick={deregister}>注销</button>
        <button className='task_button' onClick={handleAddTask}>
          创建新任务
        </button>
        {selectedProject && (
          <>
            <input
              type='text'
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className='input_task'
              placeholder='输入新任务描述'
            />
            <input
              type='file'
              onChange={handleFileUpload}
              className='input_file'
            />
            <div className='task_list'>
              {selectedProject.tasks.map(task => (
                <div key={task.id} className='task_item' onDoubleClick={() => handleTaskDoubleClick(task)}>
                  <input
                    type='checkbox'
                    checked={task.completed}
                    onChange={() => handleTaskToggleComplete(task.id)}
                    className='task_checkbox'
                  />
                  {editingTask && editingTask.id === task.id ? (
                    <div className='task_edit'>
                      <input
                        type='text'
                        value={editedTaskDescription}
                        onChange={handleTaskDescriptionChange}
                      />
                      <button onClick={handleTaskSave} className='task_save_button'>
                        保存
                      </button>
                      <button onClick={handleTaskCancel} className='task_cancel_button'>
                        取消
                      </button>
                    </div>
                  ) : (
                    <span className={`task_description ${task.completed ? 'completed' : ''}`}>
                      {task.description}
                    </span>
                  )}
                  <button onClick={() => handleTaskDelete(task.id)} className='task_delete_button'>
                    删除
                  </button>
                  <div className='comments_section'>
                    {task.comments && task.comments.map((comment, index) => (
                      <div key={index} className='comment'>
                        {comment}
                      </div>
                    ))}
                    <input
                      type='text'
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder='添加评论...'
                      className='input_comment'
                    />
                    <button onClick={() => handleAddComment(task.id)} className='comment_add_button'>
                      添加评论
                    </button>
                  </div>
                  <div className='attachments_section'>
                    {task.attachments && task.attachments.map((attachment, index) => (
                      <div key={index} className='attachment'>
                        <a href={`data:application/octet-stream;base64,${attachment.content}`} download={attachment.filename}>
                          {attachment.filename}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isEditing && currentProject && (
        <div className='editPopup'>
          <h2>编辑项目</h2>
          <input
            type='text'
            value={currentProject.name}
            onChange={handleProjectNameChange}
          />
          <button onClick={handleSave}>保存</button>
          <button onClick={handleCancel}>取消</button>
          <button onClick={() => handleDelete(currentProject.id)} className='deletePopupButton'>
            删除项目
          </button>
        </div>
      )}
    </div>
  );
}

export default Board;
