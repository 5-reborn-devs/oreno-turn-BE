FROM node:20

WORKDIR /

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with yarn
RUN ["yarn"]

COPY . .

EXPOSE 6666

RUN ["yarn", "migrate"]
# Run the server
CMD ["yarn", "lobby"]

