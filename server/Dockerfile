# Ruyi AI Admin — backend (Gin)
FROM golang:1.23-alpine AS build
WORKDIR /src
# Pure-Go sqlite (glebarez) -> no CGO needed
ENV CGO_ENABLED=0 GOOS=linux
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /out/server .

FROM alpine:3.20
WORKDIR /app
COPY --from=build /out/server .
COPY config.yaml .
ENV DB_DSN=/app/data/app.db
RUN mkdir -p /app/data
EXPOSE 8080
CMD ["./server"]
