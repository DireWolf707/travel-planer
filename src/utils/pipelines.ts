export const feedPipeline = (userId) => [
  { $match: { from: userId } },
  { $project: { to: 1, _id: 0 } },
  {
    $lookup: {
      from: "posts",
      as: "posts",
      let: { requiredUser: "$to" },
      pipeline: [
        { $match: { $expr: { $eq: ["$userId", "$$requiredUser"] } } },
        { $project: { userId: 1, caption: 1, createdAt: 1, filename: 1 } },
        {
          $lookup: {
            from: "likes",
            as: "likes",
            let: { requiredPost: "$_id" },
            pipeline: [
              { $set: { _requiredPost: { $toString: "$$requiredPost" } } },
              { $match: { $expr: { $eq: ["$postId", "$_requiredPost"] } } },
            ],
          },
        },
        { $set: { totalLikes: { $size: "$likes" }, liked: { $in: [userId, "$likes.userId"] } } },
        { $unset: "likes" },
        {
          $lookup: {
            from: "users",
            as: "user",
            let: { requiredUser: "$userId" },
            pipeline: [
              { $set: { _requiredUser: { $toObjectId: "$$requiredUser" } } },
              { $match: { $expr: { $eq: ["$_id", "$_requiredUser"] } } },
            ],
          },
        },
        { $unwind: "$user" },
        { $set: { username: "$user.username" } },
        { $unset: "user" },
      ],
    },
  },
  { $unset: "to" },
  { $unwind: "$posts" },
  { $replaceRoot: { newRoot: "$posts" } },
  { $sort: { createdAt: -1 } },
]

export const profilePipeline = (profileId, userId) => [
  { $match: { _id: profileId } },
  { $project: { username: 1, email: 1, createdAt: 1, updatedAt: 1 } },
  {
    $lookup: {
      from: "posts",
      as: "posts",
      let: { requiredUser: "$_id" },
      pipeline: [
        { $set: { _requiredUser: { $toString: "$$requiredUser" } } },
        { $match: { $expr: { $eq: ["$userId", "$_requiredUser"] } } },
        { $project: { userId: 1, caption: 1, createdAt: 1, filename: 1 } },
        {
          $lookup: {
            from: "likes",
            as: "likes",
            let: { requiredPost: "$_id" },
            pipeline: [
              { $set: { _requiredPost: { $toString: "$$requiredPost" } } },
              { $match: { $expr: { $eq: ["$postId", "$_requiredPost"] } } },
            ],
          },
        },
        { $set: { totalLikes: { $size: "$likes" }, liked: { $in: [userId, "$likes.userId"] } } },
        { $unset: "likes" },
        {
          $lookup: {
            from: "users",
            as: "user",
            let: { requiredUser: "$userId" },
            pipeline: [
              { $set: { _requiredUser: { $toObjectId: "$$requiredUser" } } },
              { $match: { $expr: { $eq: ["$_id", "$_requiredUser"] } } },
            ],
          },
        },
        { $unwind: "$user" },
        { $set: { username: "$user.username" } },
        { $unset: "user" },
        { $sort: { createdAt: -1 } },
      ],
    },
  },
]
