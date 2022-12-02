module.exports.singleLookupStage =  (from, localField, foreignField, as, unwindPath) => {
    return[ 
        {
            $lookup: {
                from,
                localField,
                foreignField,
                as
            }
        },
        {
            $unwind: {
                path: `$${unwindPath}`,
            }
        }
    ]
}