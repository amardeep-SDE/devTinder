const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: 'Status must be either "ignored", "interested", "accepted", or "rejected"'
        },
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    // Ensure that the fromUserId and toUserId are not the same
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        return next(new Error("Cannot send a connection request to yourself"));
    }
    next();
});


module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);