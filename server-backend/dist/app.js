"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("./config/constants");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173',
        'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization']
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Debug logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Static files setup
const uploadPath = path_1.default.join(__dirname, '../uploads');
// Create uploads directory if it doesn't exist
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
}
// Ensure default image exists
const defaultImagePath = path_1.default.join(uploadPath, 'default.jpg');
if (!fs_1.default.existsSync(defaultImagePath)) {
    try {
        // Create a simple default image or copy from assets
        const defaultImageSource = path_1.default.join(__dirname, '../assets/default.jpg');
        if (fs_1.default.existsSync(defaultImageSource)) {
            fs_1.default.copyFileSync(defaultImageSource, defaultImagePath);
        }
        else {
            console.warn('Default image source not found at:', defaultImageSource);
        }
    }
    catch (error) {
        console.error('Error setting up default image:', error);
    }
}
// Serve static files with proper MIME types
app.use('/uploads', (req, res, next) => {
    express_1.default.static(uploadPath, {
        setHeaders: (res, path) => {
            if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
                res.setHeader('Content-Type', 'image/jpeg');
            }
            else if (path.endsWith('.png')) {
                res.setHeader('Content-Type', 'image/png');
            }
        }
    })(req, res, next);
});
// API Routes
const apiRouter = express_1.default.Router();
apiRouter.use('/auth', authRoutes_1.default);
apiRouter.use('/users', userRoutes_1.default);
apiRouter.use('/posts', postRoutes_1.default);
apiRouter.use('/roles', roleRoutes_1.default);
apiRouter.use('/likes', likeRoutes_1.default);
apiRouter.use('/comments', commentRoutes_1.default);
app.use('/api', apiRouter);
// Test endpoint for uploads directory
app.get('/test-uploads', (req, res) => {
    try {
        const files = fs_1.default.readdirSync(uploadPath);
        res.json({
            message: 'Uploads directory content',
            files,
            uploadPath,
            defaultImageExists: fs_1.default.existsSync(defaultImagePath)
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error checking uploads directory',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connection established.'))
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1); // Detener el servidor si no hay conexión
    });
// Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log(`📁 Uploads directory: ${uploadPath}`);
// });
exports.default = app;
