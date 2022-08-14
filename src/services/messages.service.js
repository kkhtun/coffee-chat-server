module.exports = ({ MessageModel }) => ({
    getMessages: async ({ channelId, skip }) => {
        const data = await MessageModel.find({ channel_id: channelId })
            .populate("user_id", "email")
            .sort({ createdAt: -1 })
            .limit(20)
            .skip(skip ? skip : 0);
        return data;
    },
    getMoreMessages: async ({ channelId, skip }) => {
        const count = await MessageModel.find({
            channel_id: channelId,
        }).countDocuments();
        if (count > skip) {
            return await MessageModel.find({ channel_id: channelId })
                .populate("user_id", "email")
                .sort({ createdAt: -1 })
                .limit(20)
                .skip(skip ? skip : 0);
        }
        return [];
    },
    createMessage: async ({ body, channel_id, user_id }) => {
        const message = new MessageModel({ body, channel_id, user_id });
        return await message
            .save()
            .then((msg) => msg.populate("user_id", "email"));
    },
    deleteMessage: async ({ _id }) => {
        const message = await MessageModel.findOne({ _id }).exec();
        if (!message) throw new Error("Message Not Found");
        return {
            ...(await MessageModel.deleteOne({ _id })),
            channelId: message.channel_id
                ? message.channel_id.toString()
                : null,
        };
    },
    deleteMessagesByChannel: async (filter) => {
        return await MessageModel.deleteMany(filter).exec();
    },
});
