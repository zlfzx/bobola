var webPush = require('web-push');

const vapidKeys = {
	"publicKey":"BEwmqOhxOfAE75vyM82hXh_lBw1XTLIalF7VD7pjvH5y1gfG1URH5ZLBs961xH1O96ox3cdP2X6Gy4IS1yiYEcA",
	"privateKey":"DTWrTrcQO8wjXF35xZSZbxKJvBHAG1LMEtab-2GpXvE"
}

webPush.setVapidDetails(
	'mailto:zulfi.izzulhaq@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)
var pushSubcription = {
	"endpoint": "https://fcm.googleapis.com/fcm/send/c2K1vKuquB4:APA91bHKqKqgDihVk0Njj0M6VOjyxRpr9UpIhX7GbDUKhGkUbXJLvCT6LhskfBxg7fWOqc_uF2ybVFS1_zLm_8pVQIaAEePoTQnOvDJQplPf20pmvFIStVTpOZCFiAKRVggdiBkt4GC5",
	"keys": {
		"p256dh": "BBFgK+lubFzOvf6IqaP6rLh7JIm+VpvKyL0q/5i7ZbiWy/tiHlQOJ5kAg6mOIm/lvkbCKQ8J8HAii9+JyAmrQXY=",
		"auth": "kX/Ap/fJqDyCxeU02juSqA=="
	}
}
var payload = 'Ini adalah Push Notifikasi';
var options = {
	gcmAPIKey: "51230211167",
	TTL: 60
}
webPush.sendNotification(
	pushSubcription,
	payload,
	options
)