FROM node:14

# Set working directory in Docker, any commands we run will be run from this directory.
WORKDIR /app

# copy package.json into the container
COPY package*.json ./

# install dependencies in the container.
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY ./ ./

# build the project
RUN npm run build

# Step 2: Use a lighter base image to carry the build artifacts
FROM nginx:1.19

# Copy the build artifacts from step 1
COPY --from=0 /app/build /usr/share/nginx/html

# The port your app runs on
EXPOSE 80

# Start Nginx and keep it from running in the background
CMD ["nginx", "-g", "daemon off;"]
