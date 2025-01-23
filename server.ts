import express from 'express';
import { profileRouter } from './src/profile/profile.controller';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

async function main() {
    app.use(express.json());

    app.use('/api/profile', profileRouter);

    app.all('*', (request,response) => {
        response.status(404).json({message: 'Not Found'});
    });

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}

main();