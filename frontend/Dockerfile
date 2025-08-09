FROM node:18-alpine

WORKDIR /app

# کپی package.json
COPY package*.json ./

# نصب dependencies
RUN npm install

# کپی کل پروژه
COPY . .

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
