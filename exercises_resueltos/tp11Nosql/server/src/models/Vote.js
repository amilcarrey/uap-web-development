import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
    },
    value: {
        type: Number,
        required: true,
        enum: [1, -1], // 1 for upvote, -1 for downvote
    },
}, { timestamps: true });

// Ensure a user can only vote once per review
voteSchema.index({ user: 1, review: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
