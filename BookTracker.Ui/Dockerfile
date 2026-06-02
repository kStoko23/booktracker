FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build

FROM node:22-alpine AS final
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist .
EXPOSE 5173
CMD ["serve", "-s", "."]
