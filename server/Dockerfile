# Use a Node.js base image with TypeScript pre-installed
FROM node:16

# Create app directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy TypeScript configuration files
COPY tsconfig.json .

# Bundle app source inside Docker image
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# The application is configured to run on port 5000
# so expose that port
EXPOSE 4000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "dist/app.js" ]
