# Clear Verified Demo App

This is a demo app that can be used to simulate the Clear Verified flow and provide best practice in terms of implementation for our Web SDK. Our Web SDK can be integrated with a Modal UI or through a link and redirect. 

You can read more about Clear Verified in our public docs at: https://docs.clearme.com/docs/verify-users-web. 

If you have any questions, reach out to CLEAR Verified technical support

# Set Up 
### Configure CLEAR

Work with your CLEAR account team to get your **PROJECT_ID**, and **API_KEY**. 

In this sample app, we have two separate Clear Verified Projects demostrating a KYC verification flow and a Document based verification flow. Clear Verified can support any number of custom and modular verification flow and this app demostrates how you can integration two types of verification types in the same project

In addition, we setup both the Web Modal integration type and the link integration type. When running the app, you can choose on the Demo App homepage which flow to use. 

#### Link Integration Setup 
If you are using our [link integration](https://docs.clearme.com/docs/verify-users-link) Ensure your config can callback to the correct **REDIRECT_URI**. Otherwise, after the verification, the end user will be stuck on the verfication status screen
In this case we have defined our `REACT_APP_REDIRECT_URI` to `http://localhost:3000/callback`

Update `.env` file (lives in the base project directory). Input your `PROJECT_ID`, `API_KEY`

### Running the Buildscript
For developers using MacOS, you can build the project and run it automatically with the file: **mac_build.sh**. Just navigate to the folder and run the following command: 
```
./mac_build.sh
```

### Manual Setup
You can also choose to manually run this project. Before getting started, ensure that you have the Docker installed on your machine
- Docker: [Installation Guide](https://docs.docker.com/install/)

Docker Desktop is an additional UI tool that is free for individual users but needs a paid license for enterprises. If you choose to install Desktop Desktop, Docker Compose comes included. 
- Docker Desktop: [Installation Guide](https://www.docker.com/products/docker-desktop/)

If you choose not to install Docker Desktop, you can install Docker Compose and Colima
- Docker Compose: [Installation Guide](https://docs.docker.com/compose/install/)
- Colima: [Installation Guide](https://github.com/abiosoft/colima)

#### Run The App
_Execute locally (localhost:3000)_

1. Clone the repository 
   ```sh
   git clone https://github.com/poweredbyclear/Demo-Verify-React-Web.git
   ```
   

2. Navigate into the project directory:
   ```sh
   cd Demo-Verify-React-Web
   ```

3. Build and run the project using Docker Compose:
   ```sh
   docker-compose up --build
   ```
   
This command will build the Docker images and start the containers defined in the `docker-compose.yml` file.

4. Go to `localhost:3000` on your browser to get started

5. **For the best experience**, open Developer Tools (right click -> inspect) and simulate a mobile viewport with the _"device toolbar"_.
