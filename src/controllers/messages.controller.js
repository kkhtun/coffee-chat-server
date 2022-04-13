module.exports = ({ MessagesService, ChannelsService, UsersService }) => ({
    getMessages: MessagesService.getMessages,
    getMoreMessages: MessagesService.getMoreMessages,
    createMessage: async ({ body, channel_id, user_id }) => {
        await ChannelsService.getOneChannel({ _id: channel_id });
        await UsersService.getOneUserByFilter({ _id: user_id });
        return await MessagesService.createMessage({
            body,
            channel_id,
            user_id,
        });
    },
    deleteMessage: MessagesService.deleteMessage,
});
