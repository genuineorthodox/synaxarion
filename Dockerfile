FROM alpine:latest

WORKDIR /app

COPY . .

EXPOSE 8080

ENTRYPOINT ["httpd", "-f", "-p", "8080"]