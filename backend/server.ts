import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.post('/log', (req: Request, res: Response) => {
  const data = req.body;
  console.log('Message:', data);

  res.status(200).json({
    message: 'Ok',
    data: data
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
