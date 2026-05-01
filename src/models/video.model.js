import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
mongooseAggregatePaginate;

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      require: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    ispublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model("Video", videoSchema);
