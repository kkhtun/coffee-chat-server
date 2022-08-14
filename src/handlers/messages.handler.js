module.exports =
    ({ MessagesController }) =>
    ({ io, socket }) => ({
        getMessages: async ({ channelId }) => {
            const data = await MessagesController.getMessages({
                channelId,
            });
            socket.emit("list:messages", { data });
        },
        getMoreMessages: async ({ channelId, skip }) => {
            const data = await MessagesController.getMoreMessages({
                channelId,
                skip,
            });
            socket.emit("list:more-messages", { data });
        },
        createMessage: async (data) => {
            try {
                const newMessage = await MessagesController.createMessage({
                    ...data,
                    user_id: socket.data.user._id,
                });
                io.to(newMessage.channel_id.toString()).emit("new:message", {
                    data: newMessage,
                });
            } catch (e) {
                // just a temporary code
                console.log(e);
                io.to(newMessage.channel_id.toString()).emit("error", {
                    error: e.message,
                });
            }
        },
        deleteMessage: async ({ _id }) => {
            const { channelId } = await MessagesController.deleteMessage({
                _id,
            });
            io.to(channelId).emit("deleted:message", { data: _id });
        },
    });
