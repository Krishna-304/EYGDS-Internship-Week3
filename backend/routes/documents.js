import { Router } from 'express';
import { find, findById, create, findByIdAndUpdate, findByIdAndDelete } from '../models/Document';
import { verifyToken } from '../middleware/auth';
const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const documents = await find({});
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const document = await findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newDocument = await create({
            title,
            content,
            owner: req.user.id,
        });
        res.json(newDocument);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const updatedDocument = await findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;