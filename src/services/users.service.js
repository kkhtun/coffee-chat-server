module.exports = ({ UserModel }) => ({
    syncUser: async ({ name, email, picture, last_login_at }) => {
        const user = await UserModel.findOne({ email }).exec();
        if (user) {
            return await UserModel.findOneAndUpdate(
                {
                    email,
                },
                {
                    name,
                    picture,
                    last_login_at,
                },
                { new: true }
            );
        } else {
            const newUser = new UserModel({
                email,
                name,
                picture,
                last_login_at,
            });
            return await newUser.save();
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
