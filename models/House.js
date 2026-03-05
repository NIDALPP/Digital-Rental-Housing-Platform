import mongoose from 'mongoose';


const houseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            // required: true,
            trim: true

        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            trim: true
        },
        rooms: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        isFurnished: {
            type: Boolean,
            trim: true
        },
        images: {
            type: [String],
            trim: true
        },
        thumbnail: {
            type: String,
            trim: true
        },
        // name: {
        //     type: String,
        //     trim: true
        // },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        availability: {
            type: Boolean,
            default: true
        },
        approvalStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        owner: {
            type: String,
            // ref: "User",
            required: true
        },
        homeId: {
            type: String,
            trim: true
        },
        amenities: {
            type: [String],
            trim: true
        }
    },
    {
        timestamps: true
    }
);


houseSchema.pre('save', async function (next) {

    const HouseModel = mongoose.model('House');

    const record = await HouseModel.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (record && record.homeId) {
        const match = record.homeId.match(/\d+/);
        if (match) {
            nextNumber = parseInt(match[0]) + 1;
        }
    }

    this.homeId = `HID${String(nextNumber).padStart(3, '0')}`;

    next();
});


const House = mongoose.model('House', houseSchema);

export default House;
