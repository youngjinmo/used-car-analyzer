import express from 'express';
import path from 'path';
import router from './routes';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../../front/dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front/dist/index.html'));
});

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
