# # Use an official Node runtime as a parent image
FROM node:16
# # Set the working directory in the container
WORKDIR /usr/src/app
# # Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./
# # Install any needed packages including nodemon for development
RUN npm install
RUN npm install -g nodemon
# # Bundle app source inside the Docker image
COPY . .
# # Make port 5000 available to the world outside this container
EXPOSE 5000
# # Define environment variable
ENV NODE_ENV=development
# # Command to run the app using nodemon
CMD ["nodemon", "-L", "index.js"]