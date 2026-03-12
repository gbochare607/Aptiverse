const StudyPlan = require('../models/StudyPlan');

// @desc Get user's study plan
// @route GET /api/study-plan
exports.getStudyPlan = async (req, res) => {
    try {
        let plan = await StudyPlan.findOne({ userId: req.user.id });
        if (!plan) {
            // Create a default empty plan if it doesn't exist
            plan = await StudyPlan.create({ userId: req.user.id, tasks: [] });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add a task to study plan
// @route POST /api/study-plan/task
exports.addTask = async (req, res) => {
    try {
        const { text, time, category } = req.body;
        let plan = await StudyPlan.findOne({ userId: req.user.id });

        if (!plan) {
            plan = new StudyPlan({ userId: req.user.id, tasks: [] });
        }

        plan.tasks.push({
            text,
            time,
            category,
            dueDate: req.body.dueDate || Date.now()
        });
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update a task (e.g., toggle completion)
// @route PUT /api/study-plan/task/:taskId
exports.updateTask = async (req, res) => {
    try {
        const { isCompleted, text, time, category } = req.body;
        const plan = await StudyPlan.findOne({ userId: req.user.id });

        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const task = plan.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (isCompleted !== undefined) task.isCompleted = isCompleted;
        if (text) task.text = text;
        if (time) task.time = time;
        if (category) task.category = category;

        await plan.save();
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Remove a task
// @route DELETE /api/study-plan/task/:taskId
exports.removeTask = async (req, res) => {
    try {
        const plan = await StudyPlan.findOne({ userId: req.user.id });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        plan.tasks = plan.tasks.filter(t => t._id.toString() !== req.params.taskId);
        await plan.save();
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
