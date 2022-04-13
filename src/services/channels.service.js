module.exports = ({ ChannelModel }) => ({
    getChannels: async () => {
        const data = await ChannelModel.find({}).limit(20).exec();
        return data;
    },
    getOneChannel: async (filter) => {
        const data = await ChannelModel.findOne(filter).exec();
        if (!data) throw new Error("Channel Not Found");
        return data;
    },
});
