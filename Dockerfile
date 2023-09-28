# 使用Node.js的官方镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 将应用程序的依赖项复制到容器中
COPY package*.json ./

# 安装依赖项
RUN npm install

# 将应用程序的源代码复制到容器中
COPY . .

# 暴露应用程序的端口
EXPOSE 3000

# 启动应用程序
CMD ["npm", "start"]
