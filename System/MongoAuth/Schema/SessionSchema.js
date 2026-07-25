import { model, Schema } from "mongoose";

const schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  files: {
    type: Schema.Types.Mixed,
    default: {},
  },
  lastSync: {
    type: Date,
    default: null,
  },
});

export default model("sessionschemas", schema);
