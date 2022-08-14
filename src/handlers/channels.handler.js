module.exports =
    ({ ChannelsController }) =>
    ({ io, socket }) => ({
        getChannels: async () => {
            const channels = await ChannelsController.getChannels();
            socket.emit("list:channels", { data: channels });
        },
        createChannel: async (data) => {
            const channel = await ChannelsController.createChannel(data);
            io.emit("new:channel", { data: channel });
        },
        deleteChannel: async ({ _id }) => {
            const deleted = await ChannelsController.deleteChannel(_id);
            io.emit("deleted:channel", { _id });
        },
    });
