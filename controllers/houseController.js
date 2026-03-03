// import House from "../models/house.js";

// export const createHouse = async (req, res) => {
//     try {
//         const house = await House.create({
//             ...req.body,
//             owner: req.user.id
//         });

//         res.status(201).json(house);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getAllHouses = async (req, res) => {
//     const houses = await House.find().populate('owner', 'name email');
//     res.json(houses);
// };

import House from "../models/House.js";

export const createHouse = async (req, res) => {
    try {
        const { title, description, price, type, rooms, bathrooms, isFurnished, address, images ,owner} = req.body;

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
            owner   // coming from protect middleware
        });

        res.status(201).json({
            success: true,
            data: house
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,message: error.message });
    }
};

//Get All Houses

export const getAllHouses = async (req, res) => {
    try {

        let search=req.query.search || "";
        const query = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } }
            ]
        };
        
        const houses = await House.find(query)


        if (houses.length === 0) {
            return res.status(404).json({ success: false, message: "No houses found" });
        }
        // .populate("owner", "name email");

        res.json({
            success: true,
            count: houses.length,
            data: houses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get single house by id
export const getHouseById = async (req, res) => {
    try {
        const house = await House.findById(req.params.id)
            .populate("owner", "name email");

        if (!house) {
            return res.status(404).json({ message: "House not found" });
        }

        res.json({ success: true, data: house });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Update House (Admin only)
export const updateHouse = async (req, res) => {
    try {
        const house = await House.findOne({homeId: req.params.id});

        if (!house) {
            return res.status(404).json({ message: "House not found" });
        }

        const updatedHouse = await House.findOneAndUpdate(
            {homeId: req.params.id},
            req.body,
            { new: true }
        );

        res.status(200).json(updatedHouse);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Delete House (Admin only)
export const deleteHouse = async (req, res) => {
    try {
const house = await House.findOne({ homeId: req.params.id });

        if (!house) {
            return res.status(404).json({ message: "House not found" });
        }

        await house.deleteOne();

        res.status(200).json({ message: "House deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
