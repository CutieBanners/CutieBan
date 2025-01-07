import express, { Request, Response } from 'express';
import { CRUDService } from './services/CrudService';
import { DatabaseService } from './services/DatabaseService';
import dotenv from "dotenv";
import { SocketService } from './services/SocketService';

dotenv.config();
const cors = require('cors')
const app = express();
const dbService = new DatabaseService(process.env.DB_URL, process.env.DB_NAME, process.env.DB_COLLECTION);
const crudService = new CRUDService(dbService);


app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new SocketService(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

/**
 * Get a project by its ID.
 * Example: GET /projects/67570b25ab29009f4004fcee
 */
app.get('/projects/:projectId', async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const project = await crudService.getProject(projectId);
    if (!project) {
      res.status(404).json({
        message: `Project with id ${projectId} not found`
      });
      return;
    }
    delete (project as any)._id;
    res.status(200).json(project);
  } catch (error) {
    res.status(500);
  }
});

/**
 * Create a new project.
 * Request body should contain the title of the project.
 * Example: { "title": "My new project" }
 */
app.post('/projects', async (req: Request, res: Response) => {
  try{
    const projectTitle = req.body.title;
    const project = await crudService.createProject(projectTitle);
    res.status(201).json({
      project
    });
  } catch (error) {
    res.status(500);
  }
});

/**
 * Update a project by its ID.
 * Request body should contain the updated project data.
 * Example: PUT /projects/67570b25ab29009f4004fcee
 * Request body: { "id": "67570b25ab29009f4004fcee", "title": "Updated project title", "postItList": [...] }
 */
app.put('/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updatedProjectData = req.body;
    const updateStatus = await crudService.updateProject(projectId, updatedProjectData);
    if(updateStatus){
      req.io.notifyProjectChange(projectId);
      res.sendStatus(204);
    }
    else res.sendStatus(404);
  } catch (error) {
    res.status(500);
  }
});

/**
 * Delete a project by its ID.
 * Example: DELETE /projects/67570b25ab29009f4004fcee
 */
app.delete('/projects/:projectId', async (req, res) => {
  try {
      const { projectId } = req.params;
      const deletedCount = await crudService.deleteProject(projectId);
      if(deletedCount) res.sendStatus(204);
      else res.sendStatus(404);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
});


