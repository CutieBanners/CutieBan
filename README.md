# CutieBan - A cute kanban for creatives

## Description
This is a [Vite](https://vitejs.dev/) project.

## Getting Started

### Prerequisites
* IDE used PhpStorm 2024.2 or Webstorm 2024.2
* npm 10.2+ [official doc](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* node v21+ [official doc](https://nodejs.org/en/download)
* git version 2.39 [official doc](https://git-scm.com/)
* git-lfs/3.5 + [official doc](https://git-lfs.github.com/)

### Class syntax
The classes are written in order to follow the [Google TypeScript style guidelines](https://google.github.io/styleguide/tsguide.html#classes)

### Getting Started
To try the app, you can use the [public instance deployed here](https://kanban.eliott.pro/).

#### Setting Up Environment Variables

1. **Ensure you have the latest MongoDB setup**. You can download and install it from the [official MongoDB website](https://www.mongodb.com/try/download/community).

2. **Create a `.env` file** in the root directory of both the `frontend` and `backend` folders by copying the provided `.env.template` file:
    ```sh
    cp frontend/.env.template frontend/.env
    cp backend/.env.template backend/.env
    ```

3. **Configure the environment variables** in the `.env` files as needed. For example, in the `backend/.env` file, you might set the database URL, name, and collection:
    ```dotenv
    DB_URL="mongodb://localhost:27017"
    DB_NAME="CuteBanners"
    DB_COLLECTION="projects"
    ```

   And in the `frontend/.env` file, you might set the server API and WebSocket URLs:
    ```dotenv
    VITE_SERVER_API_URL=http://localhost:3000
    VITE_SERVER_WS_URL=ws://localhost:3000
    ```
   
#### Running the Application Locally
##### Frontend
1. **Install dependencies**:
    ```sh
    cd frontend
    npm install
    ```

2. **Start the development server**:
    ```sh
    npm run dev
    ```

##### Backend

1. **Install dependencies**:
    ```sh
    cd backend
    npm install
    ```

2. **Start the development server**:
    ```sh
    npm run dev
    ```

### Workflow
* [Gitflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=Gitflow%20est%20l'un%20des,les%20hotfix%20vers%20la%20production.)
* [How to commit](https://www.conventionalcommits.org/en/v1.0.0/)
* [How to use your workflow](https://nvie.com/posts/a-successful-git-branching-model/)
* Pull requests are open to merge in the develop branch.
* Release on the main branch we use GitFlow and not with GitHub release.
* When creating a new feature, the branch name must be `feature/NameOfTheFeature`
* Before merging a feature into develop, the code should be reviewed by one other person (by opening a pull request).

## License
Distributed under the MIT License. See LICENSE.txt for more information.

## Contact

* If needed you can create an issue on GitHub we will try to respond as quickly as possible.
