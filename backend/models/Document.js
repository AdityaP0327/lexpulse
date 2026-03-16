const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: null },
    status: { type: String, enum: ['Secure', 'Expiring Soon', 'Expired'], default: 'Secure' },
    isBlockchainVerified: { type: Boolean, default: false },
});

const DocumentModel = mongoose.models.Document || mongoose.model('Document', documentSchema);

class MockDocument {
    constructor(data) {
        Object.assign(this, data);
        this._id = Math.random().toString(36).substring(7);
        this.uploadDate = this.uploadDate || new Date();
    }
    
    async save() {
        MockDocument.data.push(this);
        return this;
    }
    
    static find(query) {
        let results = MockDocument.data.filter(doc => {
            for (let key in query) {
                if (doc[key] !== query[key]) return false;
            }
            return true;
        });
        
        return {
            sort: (sortObj) => {
                let key = Object.keys(sortObj)[0];
                let dir = sortObj[key] === 1 ? 1 : -1;
                return Promise.resolve(results.sort((a, b) => {
                    let valA = a[key] || 0;
                    let valB = b[key] || 0;
                    return valA > valB ? dir : (valA < valB ? -dir : 0);
                }));
            },
            then: (resolve) => resolve([...results])
        };
    }
}
MockDocument.data = [];

module.exports = new Proxy(DocumentModel, {
    construct(target, args) {
        if (mongoose.connection.readyState !== 1) return new MockDocument(...args);
        return new target(...args);
    },
    get(target, prop) {
        if (mongoose.connection.readyState !== 1 && MockDocument[prop]) return MockDocument[prop];
        return target[prop];
    }
});
