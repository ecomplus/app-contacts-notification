const { parseAsync } = require('json2csv')

exports.get = async ({ appSdk, admin }, req, res) => {
  const { storeId } = req

  const querySnapshot = await admin.firestore()
    .collection('offer_notifications')
    .where('store_id', '==', storeId)
    .get()

  const notifications = querySnapshot.docs.map(doc => {
    const data = doc.data()
    let createdAt
    if (data.created_at && data.created_at.toDate) {
      createdAt = data.created_at.toDate().toISOString()
    }
    return {
      ...data,
      created_at: createdAt
    }
  })

  const csv = await parseAsync(notifications)
  const datetime = new Date().toISOString().replace(/\W/g, '')
  const filename = `notifications_${storeId}_${datetime}.csv`

  res.header('Content-Type', 'text/csv')
  res.attachment(filename)
  return res.send(csv)
}
