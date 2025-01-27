import { redirectSchema } from "../models/dbSchemas/redirectSchema"
import { UrlSchema } from "../models/dbSchemas/urlSchema";
import { NO_DATA_AVL_MSG, SUCCESS_MSG } from "../utils/messages/message";
import { ResponseWithObject } from "../utils/status/status";
import { ErrorHandler } from "./errorHandlerService";

const analysisByAlias = async (alias: string) => {
  const pipeline: any = [
    {
      $match: {
        url: "myUrl"
      }
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          )
        }
      }
    },
    {
      $facet: {
        totalStats: [
          {
            $group: {
              _id: null,
              totalClicks: {
                $count: {}
              },
              uniqueUsers: {
                $addToSet: "$ip"
              }
            }
          },
          {
            $project: {
              totalClicks: 1,
              uniqueUsers: {
                $size: "$uniqueUsers"
              }
            }
          }
        ],
        clicksByDate: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt"
                }
              },
              clicks: {
                $count: {}
              }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ],
        osType: [
          {
            $group: {
              _id: "$os",
              uniqueClicks: {
                $count: {}
              },
              uniqueUsers: {
                $addToSet: "$ip"
              }
            }
          },
          {
            $project: {
              osName: "$_id",
              uniqueClicks: 1,
              uniqueUsers: {
                $size: "$uniqueUsers"
              }
            }
          }
        ],
        deviceType: [
          {
            $group: {
              _id: "$device",
              uniqueClicks: {
                $count: {}
              },
              uniqueUsers: {
                $addToSet: "$ip"
              }
            }
          },
          {
            $project: {
              deviceName: "$_id",
              uniqueClicks: 1,
              uniqueUsers: {
                $size: "$uniqueUsers"
              }
            }
          }
        ]
      }
    },
    {
      $project: {
        totalClicks: {
          $arrayElemAt: [
            "$totalStats.totalClicks",
            0
          ]
        },
        uniqueUsers: {
          $arrayElemAt: [
            "$totalStats.uniqueUsers",
            0
          ]
        },
        clicksByDate: "$clicksByDate",
        osType: "$osType",
        deviceType: "$deviceType"
      }
    }
  ]
  const analyticsData = await redirectSchema.aggregate(pipeline);
  if (analyticsData && analyticsData.length > 0) {
    return new ResponseWithObject(200, SUCCESS_MSG, analyticsData);
  } else {
    throw new ErrorHandler(400, NO_DATA_AVL_MSG)
  }
}

const analysisByTopic = async (topic: string) => {
  const pipeline: any = [
    {
      '$lookup': {
        'from': 'Url',
        'localField': 'url',
        'foreignField': 'urlId',
        'as': 'urlDetails'
      }
    }, {
      '$match': {
        'urlDetails.topic': topic
      }
    }, {
      '$unwind': '$urlDetails'
    }, {
      '$addFields': {
        'date': {
          '$dateToString': {
            'format': '%Y-%m-%d',
            'date': '$createdAt'
          }
        }
      }
    }, {
      '$facet': {
        'globalStats': [
          {
            '$group': {
              '_id': null,
              'totalClicks': {
                '$count': {}
              },
              'uniqueUsers': {
                '$addToSet': '$ip'
              }
            }
          }, {
            '$project': {
              'totalClicks': 1,
              'uniqueUsers': {
                '$size': '$uniqueUsers'
              }
            }
          }
        ],
        'clicksByDate': [
          {
            '$group': {
              '_id': '$date',
              'totalClicks': {
                '$count': {}
              }
            }
          }, {
            '$sort': {
              '_id': 1
            }
          }, {
            '$project': {
              'date': '$_id',
              'totalClicks': 1,
              '_id': 0
            }
          }
        ],
        'urls': [
          {
            '$group': {
              '_id': '$urlDetails.shortUrl',
              'totalClicks': {
                '$count': {}
              },
              'uniqueUsers': {
                '$addToSet': '$ip'
              }
            }
          }, {
            '$project': {
              'shortUrl': '$_id',
              'totalClicks': 1,
              'uniqueUsers': {
                '$size': '$uniqueUsers'
              },
              '_id': 0
            }
          }
        ]
      }
    }, {
      '$project': {
        'totalClicks': {
          '$arrayElemAt': [
            '$globalStats.totalClicks', 0
          ]
        },
        'uniqueUsers': {
          '$arrayElemAt': [
            '$globalStats.uniqueUsers', 0
          ]
        },
        'clicksByDate': '$clicksByDate',
        'urls': '$urls'
      }
    }
  ]
  const analyticsData = await redirectSchema.aggregate(pipeline);
  if (analyticsData && analyticsData.length > 0) {
    return new ResponseWithObject(200, SUCCESS_MSG, analyticsData)
  } else {
    throw new ErrorHandler(400, NO_DATA_AVL_MSG)
  }
}

const analysisByUser = async (email: string) => {
  const pipeline: any = [
    {
      '$match': {
        'createdBy': email
      }
    }, {
      '$lookup': {
        'from': 'redirectmodels',
        'localField': '_id',
        'foreignField': 'url',
        'as': 'redirects'
      }
    }, {
      '$unwind': {
        'path': '$redirects',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$addFields': {
        'date': {
          '$dateToString': {
            'format': '%Y-%m-%d',
            'date': '$redirects.createdAt'
          }
        },
        'os': '$redirects.os',
        'device': '$redirects.device',
        'ip': '$redirects.ip'
      }
    }, {
      '$facet': {
        'totalUrls': [
          {
            '$group': {
              '_id': null,
              'totalUrls': {
                '$sum': 1
              }
            }
          }, {
            '$project': {
              'totalUrls': '$totalUrls'
            }
          }
        ],
        'globalStats': [
          {
            '$group': {
              '_id': null,
              'totalClicks': {
                '$count': {}
              },
              'uniqueUsers': {
                '$addToSet': '$ip'
              }
            }
          }, {
            '$project': {
              'totalClicks': 1,
              'uniqueUsers': {
                '$size': '$uniqueUsers'
              }
            }
          }
        ],
        'clicksByDate': [
          {
            '$group': {
              '_id': '$date',
              'totalClicks': {
                '$count': {}
              }
            }
          }, {
            '$sort': {
              '_id': 1
            }
          }, {
            '$project': {
              'date': '$_id',
              'totalClicks': 1,
              '_id': 0
            }
          }
        ],
        'osType': [
          {
            '$group': {
              '_id': '$os',
              'uniqueClicks': {
                '$count': {}
              },
              'uniqueUsers': {
                '$addToSet': '$ip'
              }
            }
          }, {
            '$project': {
              'osName': '$_id',
              'uniqueClicks': 1,
              'uniqueUsers': {
                '$size': '$uniqueUsers'
              },
              '_id': 0
            }
          }
        ],
        'deviceType': [
          {
            '$group': {
              '_id': '$device',
              'uniqueClicks': {
                '$count': {}
              },
              'uniqueUsers': {
                '$addToSet': '$ip'
              }
            }
          }, {
            '$project': {
              'deviceName': '$_id',
              'uniqueClicks': 1,
              'uniqueUsers': {
                '$size': '$uniqueUsers'
              },
              '_id': 0
            }
          }
        ]
      }
    }, {
      '$project': {
        'totalUrls': {
          '$arrayElemAt': [
            '$totalUrls.totalUrls', 0
          ]
        },
        'totalClicks': {
          '$arrayElemAt': [
            '$globalStats.totalClicks', 0
          ]
        },
        'uniqueUsers': {
          '$arrayElemAt': [
            '$globalStats.uniqueUsers', 0
          ]
        },
        'clicksByDate': '$clicksByDate',
        'osType': '$osType',
        'deviceType': '$deviceType'
      }
    }
  ];
  const analyticsData = await UrlSchema.aggregate(pipeline);
  if (analyticsData && analyticsData.length > 0) {
    return new ResponseWithObject(200, SUCCESS_MSG, analyticsData);
  } else {
    throw new ErrorHandler(400, NO_DATA_AVL_MSG);
  }
}

export default {
  analysisByAlias,
  analysisByTopic,
  analysisByUser
}