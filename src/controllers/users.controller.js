module.exports = ({ UsersService }) => ({
    syncUser: UsersService.syncUser,
    logoutUser: async ({ email }) => {
        const user = await UsersService.getOneUserByFilter({ email });
        return await UsersService.clearLastLoginTime({ _id: user._id });
    },
});
