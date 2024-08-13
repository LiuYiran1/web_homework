- **github 地址:**https://github.com/LiuYiran1/web_homework
- **打包方式:docker**
- **仓库地址:**https://hub.docker.com/repository/docker/flamer800/web_course/general
- **使用方式:**
  - 拉取镜像
```bash
docker pull flamer800/web_course:frontend-latest
docker pull flamer800/web_course:backend-latest
```
  - 运行容器
```bash
docker run -d -p 3000:80 --name frontend flamer800/web_course:frontend-latest
docker run -d -p 5173:80 --name backend flamer800/web_course:backend-latest
```
  - **问题**:可能出现前后端通信的问题,如果在登录界面无法注册的话,就分别在github上的Agile_Kanban的front和back目录中运行npm run dev后,点击前端网址即可使用.
- **附加功能:**用户注册,用户名&密码验证
- **后端存储数据部分:**将每个用户的用户名和密码存入一个文件中,将每个用户的数据存入以用户id为名的目录,将每个项目的数据存入以项目名称+项目id为名的目录,将每个任务的数据存入以任务id为名的目录中,用txt文件存储任务的描述和完成情况和评论,其余任务附件也存入相应任务目录下

- **简要概述**:
  - 多用户登录 :先注册账号,之后输入相应用户名和密码登录,密码不对不予进入下一个页面
  - 项目创建:点击创建按钮即可创建(双击项目可修改项目的名称或删除项目)
  - 项目添加任务:先选定项目再填入任务描述和附件再点击创建任务即可创建
  - 任务查看:下拉任务框即可查看(双击任务框可对任务内容进行修改,点击完成框即可表示完成任务)
  - 点击任务的评论按钮即可评论
  - 点击删除按钮即可删除任务
  - 点击左上角的标识可展示任务看板
  - 点击注销退出登录
