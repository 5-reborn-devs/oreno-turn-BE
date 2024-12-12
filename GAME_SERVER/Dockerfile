FROM node:20

WORKDIR /

# Copy package files
COPY package.json yarn.lock ./src ./

# Install dependencies with yarn
RUN ["yarn"]

COPY . .

EXPOSE 16666

# Run the server
CMD ["yarn", "game"]

