importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
	console.log('Workbox berhasil dimuat')
} else {
	console.log('Workbox gagal dimuat')
}

workbox.precaching.precacheAndRoute([
	{url: '/', revision: '1'},
	{url: '/index.html', revision: '1'},
	{url: '/match.html', revision: '1'},
	{url: '/nav.html', revision: '1'},
	{url: '/player.html', revision: '1'},
	{url: '/team.html', revision: '1'},
	{url: '/assets/css/materialize.min.css', revision: '1'},
	{url: '/assets/img/match-fav.svg', revision: '1'},
	{url: '/assets/img/match.svg', revision: '1'},
	{url: '/assets/img/pemain-fav.svg', revision: '1'},
	{url: '/assets/img/pemain.svg', revision: '1'},
	{url: '/assets/img/tim.svg', revision: '1'},
	{url: '/assets/js/api.js', revision: '1'},
	{url: '/assets/js/database.js', revision: '1'},
	{url: '/assets/js/idb.js', revision: '1'},
	{url: '/assets/js/materialize.min.js', revision: '1'},
	{url: '/assets/js/nav.js', revision: '1'},
	{url: '/assets/js/script.js', revision: '1'},
	{url: '/manifest.json', revision: '1'},
	{url: '/icon.png', revision: '1'}
]);

workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	workbox.strategies.cacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60
			})
		]
	})
);

workbox.routing.registerRoute(
	new RegExp('.html'),
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'pages',
		networkTimeoutSeconds: 3
	})
);

workbox.routing.registerRoute(
	new RegExp('https://api.football-data.org/v2/'),
	workbox.strategies.staleWhileRevalidate()
);

// cache css google
workbox.routing.registerRoute(
	/\^https:\/\/fonts\.googleapis\.com/,
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'google-fonts-stylesheet'
	})
)

// cache font
workbox.routing.registerRoute(
	/^https:\/\/fonts\.gstatic\.com/,
	workbox.strategies.cacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200]
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30
			})
		]
	}))

self.addEventListener('push', function(event){
	var body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload'
	}

	var options = {
		body: body,
		icon: 'icon.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	}
	event.waitUntil(self.registration.showNotification('Push Notification', options))
})