// import House from "../models/house.js";

// export const createHouse = async (req, res) => {
//     try {
//         const house = await House.create({
//             ...req.body,
//             owner: req.user.id
//         });

//         res.json(house);
//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };

// export const getAllHouses = async (req, res) => {
//     const houses = await House.find().populate('owner', 'name email');
//     res.json(houses);
// };

import House from "../models/House.js";

export const createHouse = async (req, res) => {
    try {
        const { title, description, price, type, rooms, bathrooms, isFurnished, address, images, thumbnail, owner } = req.body;

        const house = await House.create({
            title,
            description,
            type,
            rooms,
            bathrooms,
            isFurnished,
            address,
            price,
            images,
            thumbnail,
            owner,
            approvalStatus: 'Pending'
        });

        res.json({
            status: 1,
            data: house
        });

    } catch (error) {
        res.json({
            status: 0, message: error.message
        });
    }
};

//Get All Houses

export const getAllHouses = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let sort=null;
        if(!req.query.sort){
            sort={createdAt: -1}
        }

        const matchQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };
        matchQuery={
            ...matchQuery,
            approvalStatus: 'Approved',
            availability: true,
            isActive: true,
        }

        let agg = [
            {
                $match: matchQuery
            },
            {
                $sort: sort
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"userId",
                    as:"owner"
                }
            },

             {
                $project: {
                    _id: 0,
                    owner: { $first: "$owner" },
                    title:1,
                    description:1,
                    price:1,
                    type:1,
                    rooms:1,
                    bathrooms:1,
                    isFurnished:1,
                    address:1,
                    images:1,
                    thumbnail:1,
                    approvalStatus:1,
                    availability:1,
                    isActive:1,
                    createdAt:1,
                    updatedAt:1,

                   
                }
            }

        ]
        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No houses found" });
        }

        res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

// Protected list API:
// - Admin: all houses
// - Normal user: only houses owned by logged-in user
export const getHousesByRole = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const textQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };

        const isAdmin = Boolean(req.user?.isAdmin);
        const userIdValue = req.user?.userId;
        const mongoIdValue = req.user?._id?.toString();

        const matchQuery = isAdmin
            ? textQuery
            : {
                $and: [
                    textQuery,
                    { owner: { $in: [userIdValue, mongoIdValue].filter(Boolean) } }
                ]
            };

        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No houses found" });
        }

        return res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });
    } catch (error) {
        return res.json({ status: 0, message: error.message });
    }
};

//Get only Approved Houses (Public)
export const getApprovedHouses = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchQuery = {
            approvalStatus: 'Approved',
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };

        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No approved houses found" });
        }

        res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

//Get single house by id
export const getHouseById = async (req, res) => {
    try {
        const house = await House.findById(req.params.id)
            .populate("owner", "name email");

        if (!house) {
            return res.json({ status: 0, message: "House not found" });
        }

        res.json({ status: 1, data: house });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};




// Update House (Admin only)
export const updateHouse = async (req, res) => {
    try {
        const house = await House.findOne({ homeId: req.params.id });

        if (!house) {
            return res.json({ status: 0, message: "House not found" });
        }

        const updatedHouse = await House.findOneAndUpdate(
            { homeId: req.params.id },
            req.body,
            { new: true }
        );

        res.json({ status: 1, data: updatedHouse });
    } catch (error) {
        res.json({ status: 0, message: "Server error" });
    }
};


// Delete House (Admin only)
export const deleteHouse = async (req, res) => {
    try {
        const house = await House.findOne({ homeId: req.params.id });

        if (!house) {
            return res.json({ status: 0, message: "House not found" });
        }

        await house.deleteOne();

        res.json({ status: 1, message: "House deleted successfully" });
    } catch (error) {
        res.json({ status: 0, message: "Server error" });
    }
};
