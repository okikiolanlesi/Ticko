import { Document, Model, Schema, Types } from "mongoose";

const mongoose = require("mongoose");
const slugify = require("slugify");

interface IOfflineLocation {
  type: "Point";
  coordinates: [number, number];
  address: string;
  description: string;
  day: number;
}

interface IDate {
  eventType: "online" | "offline";
  date: Date;
  onlineLocation?: string;
  offlineLocation?: IOfflineLocation;
}
interface ITickets {
  price: number;
  ticketsLeft: number;
  name: string;
}
export interface IEvent extends Document {
  eventType: string;
  name: string;
  description: string;
  tickets: [ITickets];
  slug: string;
  organization: Types.ObjectId;
  coverImage: string;
  images?: string[];
  dates: [IDate];
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Events must have a name"],
      maxlength: [
        40,
        "An event name must have less or equal then 40 characters",
      ],
      minlength: [3, "A event name must have more or equal then 3 characters"],
      //   trim: true,
    },
    description: {
      type: String,
      required: [true, "Events must have a description"],
      maxlength: [
        1000,
        "An event description must have less or equal then 1000 characters",
      ],
      minlength: [3, "A event name must have more or equal then 3 characters"],
    },
    tickets: {
      type: [
        {
          price: Number,
          ticketsLeft: Number,
          name: String,
        },
      ],
      required: [true, "An event must have tickets"],
    },
    slug: {
      type: String,
      //   required: [true, "An event must have a slug"],
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    coverImage: {
      type: String,
      required: [true, "An event must have a cover image"],
    },
    images: [String],
    dates: {
      type: [
        {
          eventType: {
            type: String,
            enum: ["online", "offline"],
            required: [true, "An event must have an eventType"],
          },
          date: {
            type: Date,
            required: [true, "An event must have a date"],
          },
          onlineLocation: {
            type: String,
            required: function (this: IDate) {
              return this.eventType === "online";
            },
          },
          offLinelocation: {
            type: new Schema({
              type: {
                type: String,
                enum: ["Point"],
                default: "Point",
              },
              coordinates: {
                type: [Number],
                required: [true, "An event must have coordinates"],
              },
              address: {
                type: String,
                required: [true, "An event must have an address"],
              },
              description: {
                type: String,
                required: [true, "An event must have a description"],
              },
              day: {
                type: Number,
                required: [true, "An event must have a day"],
              },
            }),
            required: function (this: IDate) {
              return this.eventType === "offline";
            },
          },
        },
      ],
      required: [true, "An event must have a date"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// eventSchema
//   .path("onlineLocation")
//   .required(
//     true,
//     'onlineLocation is required when eventType is set to "online".'
//   );
// eventSchema
//   .path("offlineLocation")
//   .required(
//     false,
//     'offlineLocation is required when eventType is set to "offline".'
//   );

eventSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true });
  next();
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: "organization",
    select: "name",
  });
  next();
});

eventSchema.methods.slugifyName = function () {
  this.slug = slugify(this.name, { lower: true });
};

const Event: Model<IEvent> = mongoose.model("Event", eventSchema);

export default Event;
