const AWS = require('aws-sdk');

exports.handler = async (events, context) => {
    // DynamoDBクライアントの作成
    const dynamodb = new AWS.DynamoDB();
    const tableName = process.env.TABLE_NAME;

    // BatchWriteItemリクエストの作成
    const params = {
        RequestItems: {
            [tableName]: events.map((item) => ({
                PutRequest: {
                    Item: {
                        pk: { S: item.year },
                        sk: { S: item.month_day },
                        diary: { S: item.diary },
                        created_at: { N: item.created_at.toString() },
                        updated_at: { N: item.updated_at.toString() },
                    },
                },
            })),
        },
    };

    try {
        // BatchWriteItemリクエストの実行
        const data = await dynamodb.batchWriteItem(params).promise();
        console.log('Successfully executed BatchWriteItem');
        // 未処理のアイテムがある場合は、UnprocessedItemsに格納される
        console.log('Unprocessed Items:', data.UnprocessedItems);
        return data;
    } catch (err) {
        console.log('Error:', err);
        throw err;
    }
};

// 想定するデータ（events）
// [
//     {
//       "year": "2023",
//       "month_day": "0401",
//       "diary": "晴れだった。",
//       "created_at": 20230401000000,
//       "updated_at": 20230401000000
//     },
//     {
//       "year": "2023",
//       "month_day": "0402",
//       "diary": "雨だった。",
//       "created_at": 20230402000000,
//       "updated_at": 20230402000000
//     },
//     {
//       "year": "2023",
//       "month_day": "0403",
//       "diary": "曇りだった。",
//       "created_at": 20230403000000,
//       "updated_at": 20230403000000
//     }
//   ]
