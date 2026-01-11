import cors from "cors";
import express, { NextFunction, Request, Response } from 'express';
import { Pool } from 'pg'
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    database: 'auth_app',
    port: 5432
})

const app = express();
app.use(express.json());
app.use(cors());

// const JWT_SECRET = 'SECRETJWT'

dotenv.config()

export interface User {
  id?: number;
  email: string;
  password_hash?: string;
  created_at?: Date;
}

export type TRequest = Request & {
    user?: User
}

function authenticateToken(req: TRequest, res: Response, next: NextFunction) {
    // 1. Извлечь токен
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Проверить наличие токена
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // 3. Верифицировать токен
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // 4. Добавить данные пользователя в req
        req.user = decoded as User; // { userId: 123 }

        // 5. Передать управление обработчику маршрута
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}



app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const _result = await pool.query(`
            select * from users
            where email = $1
        `, [email]);

        if (_result.rows.length > 0) res.status(400).json({ error: 'Такой email уже занят!' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(`
            insert into users (email, password_hash)
            values ($1, $2)
            returning id, email, created_at
        `, [email, hashedPassword]);

        res.json(result.rows[0])

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})

app.post('/auth/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await pool.query(`
            select email, password_hash, id from users
            where email = $1
        `, [email]);

        if (result.rows.length === 0) res.status(400).json({ error: 'Такого пользователя не существует!' });

        const dbPass = result.rows[0].password_hash;

        const checkPass = await bcrypt.compare(password, dbPass);

        if (!checkPass) res.status(400).json({ error: 'Неверный пароль!' });

        // Шаг 2: Подготовить данные (payload)
        const payload = {
            id: result.rows[0].id, // ID пользователя из базы данных
            email: result.rows[0].email
        };

        // Шаг 3: Подготовить секретный ключ
        const secret = process.env.JWT_SECRET as string; // например: "my_super_secret_key"

        // Шаг 4: Подготовить настройки
        const options = {
            expiresIn: '24h' // токен будет действителен 24 часа
        } as SignOptions;

        // Шаг 5: Сгенерировать токен
        const token = jwt.sign(payload, secret, options);

        res.status(200).json(token);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})

app.get('/profile', authenticateToken, async (req: TRequest, res: Response) => {
    try {

        const userId = req?.user?.id;

        if (!userId) res.status(400).json({error: 'err'})

        const result = await pool.query(`
            select id, email, created_at from users
            where id = $1
        `, [userId])

        if (result.rows.length === 0) res.status(404).json({ error: 'error' });

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})

// Путь к папке с фронтендом
const clientBuildPath = path.join(__dirname, "../client/dist");

console.log('[clientBuildPath]:', clientBuildPath)

// Отдаём фронтенд как статику
app.use(express.static(clientBuildPath));

// Для всех маршрутов React SPA возвращаем index.html
// Любой другой маршрут возвращает index.html
app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});


app.listen(5000, () => console.log('server is started'));