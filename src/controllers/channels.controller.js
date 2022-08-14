module.exports = ({ ChannelsService }) => ({
    getChannels: ChannelsService.getChannels,
    createChannel: ChannelsService.createChannel,
    deleteChannel: async (_id) => {
        const channel = await ChannelsService.deleteChannel(_id);
        // const messages = await MessagesService.deleteMessagesByChannel({
        //     channel_id: _id,
        // });
        // removed dt circular dependency
        return { channel };
    },
});
