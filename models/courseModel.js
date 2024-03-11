const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Course name required"],
    },
    year: {
      type: String,
      trim: true,
    },
    image: String,
    instructor: String,
    materials: {
      type: mongoose.Schema.ObjectId,
      ref: "Material",
    },
  },
  { timestamps: true }
);

const setImage = (doc) => {
  console.log(doc);
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/courses/${doc.image}`;
    doc.image = imageUrl;
  }
};

courseSchema.post(["init", "save"], setImage);

module.exports = mongoose.model("Course", courseSchema);
