# Dockerfile for nodejs express app written in typescript

# Use the official image as a parent image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy everything from the current directory to the PWD (Present Working Directory) of the container
COPY . .

RUN ls -la

# Install the dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Run the app with node
CMD ["node", "dist/app.js"]



