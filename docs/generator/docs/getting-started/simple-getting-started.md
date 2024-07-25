---
sidebar_position: 2
slug: '/getting-started/simple'
title: 'Simple Getting Started'
---

# Simple Getting Started

This documentation provides instructions for setting up a local instance of MADI using Docker. This setup is designed for direct usage and does not include local coding capabilities.

### 1. Install Docker

First, you need to install Docker on your system.

- **For macOS**: Follow [these instructions](https://docs.docker.com/desktop/install/mac-install/) to install Docker Desktop for macOS.
- **For Windows**: Follow [these instructions](https://docs.docker.com/desktop/install/windows-install/) to install Docker Desktop for Windows.

To verify that Docker is installed correctly, you can run a test container. Open your terminal and execute:

```shell
docker run hello-world
```

This command downloads a test image and runs it in a container. If Docker is installed correctly, you will see a message saying "Hello from Docker!"

For more detailed instructions and troubleshooting, refer to the official Docker documentation: [Docker Documentation](https://docs.docker.com/).

### 2. Pull the Latest Images

After installing Docker, you need to fetch the Docker Compose file that includes all the necessary components for MADI.

Download the Docker Compose file using the following command:

```shell
curl -o docker-compose-simple.yml https://raw.githubusercontent.com/nasa-madi/madi-core/main/docker-compose-simple.yml
```

Once the file is downloaded, navigate to the folder containing `docker-compose-simple.yml`, and pull the required Docker images:

```shell
docker compose -f docker-compose-simple.yml pull
```

### 3. Add Environment Variables

In the `docker-compose-simple.yml` file that you downloaded, locate the section related to the API service:

```yaml
  api:
    image: nasamadi/madi-api:latest
    environment:
      - NODE_ENV=development
      - NODE_CONFIG_ENV=docker
      - OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXX
    ports:
      - "3030:3030"
```

Replace `sk-XXXXXXXXXXXXXXXXXXXXXXXX` with your own OpenAI API key. Ensure that you keep the key secure and do not expose it publicly. Save the changes to the file.

### 4. Running the Stack

To start the MADI stack, run the following command in your terminal:

```shell
docker compose -f docker-compose-simple.yml -p madi-simple up
```

If everything is configured correctly, Docker will start up the containers and you should be able to access your local MADI instance by navigating to `http://localhost:3000` in your web browser.


### 5. Side-Loading a Plugin
```yaml
  api:
    image: nasamadi/madi-api:latest
    environment:
      # other configs
      - PLUGINS={"default":"casConfluence"}}
    ports:
      - "3030:3030"
```
