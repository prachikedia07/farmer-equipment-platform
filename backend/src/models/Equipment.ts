import mongoose from "mongoose";

export type EquipmentCategory =
  | "tractor"
  | "rotavator"
  | "cultivator"
  | "seed_drill"
  | "trolley"
  | "harvester"
  | "sprayer"
  | "thresher";

interface IEquipment extends mongoose.Document {
  name: string;
  category: EquipmentCategory;
  price: number;
  pricingType: "hour" | "acre";
  location: string;
  availability: string;
  image?: string;
  owner: mongoose.Types.ObjectId;
  rating: number;
    numReviews: number;
     description?: string;
  features?: string[];
}

const equipmentSchema = new mongoose.Schema<IEquipment>(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        "tractor",
        "rotavator",
        "cultivator",
        "seed_drill",
        "trolley",
        "harvester",
        "sprayer",
        "thresher"
      ],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    pricingType: {
      type: String,
      enum: ["hour", "acre"],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    availability: {
      type: String
    },
    image: {
      type: String
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
  type: String
},
features: {
  type: [String],
  default: []
},
    rating: {
  type: Number,
  default: 0
},
numReviews: {
  type: Number,
  default: 0
}
  },
  {
    timestamps: true
  }
);

const Equipment = mongoose.model<IEquipment>("Equipment", equipmentSchema);

export default Equipment;