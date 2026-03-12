const mongoose = require('mongoose');

async function diagnostic() {
    try {
        const uri = 'mongodb://localhost:27017/aptiverse';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in aptiverse:', collections.map(c => c.name));

        const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

        for (const c of collections) {
            const count = await mongoose.connection.db.collection(c.name).countDocuments();
            console.log(` - ${c.name}: ${count} docs`);

            if (c.name === 'questions') {
                const sample = await mongoose.connection.db.collection(c.name).findOne();
                console.log('   Sample Question:', sample ? sample.text : 'No sample found');
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error during diagnostic:', err);
        process.exit(1);
    }
}

diagnostic();
