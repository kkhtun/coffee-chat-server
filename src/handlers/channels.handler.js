module.exports =
    ({ ChannelsController }) =>
    ({ io, socket }) => ({
        getChannels: async () => {
            const channels = await ChannelsController.getChannels();
            socket.emit("list:channels", { data: channels });
        },
    });
