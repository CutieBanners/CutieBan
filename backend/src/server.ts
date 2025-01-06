import express, { Request, Response } from 'express';
import { CRUDService } from './services/CrudService';
import { DatabaseService } from './services/DatabaseService';


const app = express();
const dbService = new DatabaseService("mongodb://localhost:27017", "CuteBanners", "projects");
const crudService = new CRUDService(dbService);

app.use(express.json());

/**
 * Get a project by its ID.
 * Example: GET /projects/67570b25ab29009f4004fcee
 */
app.get('/projects/:projectId', async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const project = await crudService.getProject(projectId);

  if (!project) {
    res.status(404).json({
      message: `Project with id ${projectId} not found`
    });
    return;
  }

  res.status(200).json(project);
});

/**
 * Create a new project.
 * Request body should contain the title of the project.
 * Example: { "title": "My new project" }
 */
app.post('/projects', async (req: Request, res: Response) => {
  const projectTitle = req.body.title;
  const project = await crudService.createProject(projectTitle);
  res.status(201).json({
    project
  });
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
    if(updateStatus) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    res.status(404).json({ error: error.message });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
