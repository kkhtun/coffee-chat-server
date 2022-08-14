module.exports = ({ UserModel }) => ({
    getOneUserByFilter: async (filter, projection = {}, throwError = true) => {
        const user = await UserModel.findOne(filter, projection).lean().exec();
        if (throwError && !user) throw new Error(USER_ERRORS.NOT_FOUND);
        return user;
    },
    syncUser: async (filter, data) => {
        const user = await UserModel.findOne(filter).exec();
        if (!user) {
            const user = new UserModel(data);
            return await user.save();
        } else {
            user.firebase_id = data.firebase_id;
            user.name = data.name;
            user.email = data.email;
            return await user.save();
        }
    },
    getOneUserByFilter: async (filter) => {
        const user = await UserModel.findOne(filter).exec();
        if (!user) throw new Error("User Not Found");
        return user;
    },
    clearLastLoginTime: async ({ _id }) => {
        return await UserModel.findOneAndUpdate(
            {
                _id,
            },
            {
                last_login_at: null,
            },
            { new: true }
        );
    },
    createUser: async ({ email, name, picture, last_login_at }) => {
        const newUser = new UserModel({
            email,
            name,
            picture,
            last_login_at,
        });
        return await newUser.save();
    },
    // this is a temporary feature to keep email field unique even tho some may not come from google gmail
    generateUniqueEmailLikeString: async (name) => {
        let str;
        let user;
        do {
            str = name + "@" + new Date().getTime();
            user = await UserModel.findOne({ email: str });
        } while (!!user);
        return str;
    },
});
