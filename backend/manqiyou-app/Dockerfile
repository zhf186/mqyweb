# 多阶段构建 - 构建阶段
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# 复制 pom.xml 和源代码
COPY pom.xml .
COPY src ./src

# 构建应用（跳过测试以加快构建速度）
RUN mvn clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1000 manqiyou && \
    adduser -D -u 1000 -G manqiyou manqiyou

# 从构建阶段复制 JAR 文件
COPY --from=builder /app/target/*.jar app.jar

# 更改所有权
RUN chown -R manqiyou:manqiyou /app

# 切换到非 root 用户
USER manqiyou

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# 启动应用
ENTRYPOINT ["java", "-jar", "-Xms512m", "-Xmx1024m", "app.jar"]
