import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import { availableToolDescriptions } from './tools/availableTools';
// import { callTools } from './tools/callTools';
// import openai from "./cacheProxy";
import { ChatService } from './chat.class';


const chatService = new ChatService();


const app = express();
app.use(bodyParser.json());


app.all('/chat', async (req: Request, res: Response) => {
  try {
    const response = await chatService.create(req.body,{});
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.all('/auth', async (req: Request, res: Response) => {
  try {
    const response = await chatService.create(req.body,{});
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const response = await chatService.create({},{});
