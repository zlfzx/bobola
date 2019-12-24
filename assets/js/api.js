var api_url 				= 'https://api.football-data.org/v2/',
	api_token 				= 'e9e004cff36d412b89585a0dc5005301',
	kode_liga				= '2021',
	api_klasemen 			= `${api_url}competitions/${kode_liga}/standings?standingType=TOTAL`,
	api_detail_tim			= `${api_url}teams/`, // id_tim
	api_detail_pemain 		= `${api_url}players/`, // id_pemain
	api_jadwal_pertandingan	= `${api_url}competitions/${kode_liga}/matches?status=SCHEDULED`,
	api_detail_pertandingan = `${api_url}matches/`; // id_pertandingan

function url(url){
	return url.replace(/^http:\/\//i, 'https://');
}

function fetchApi(url){
	return fetch(url, {
		headers: {
			'X-Auth-Token': api_token
		}
	})
}

function status(response){
	if (response.status !== 200) {
		console.log('Error : ' + response.status);
		return Promise.reject(new Error(response.responseText));
	} else {
		return Promise.resolve(response);
	}
}

function json(response){
	return response.json();
}

function error(error){
	console.log(error);
}

function getKlasemen(){
	return new Promise((resolve, reject) => {
		if ('caches' in window) {
			caches.match(api_klasemen).then(function(response){
				if (response) {
					response.json().then(function(data){
						var tableKlasemen = '',
							klasemen = data.standings[0].table;
						klasemen.forEach(function(dd){
							// console.log(dd)
							tableKlasemen += `
								<tr>
									<td class="center-align">${dd.position}</td>
									<td>
										<a href="./team.html?id=${dd.team.id}">
											<p>
											<img src="${url(dd.team.crestUrl)}" style="float: left; width: 20px; margin-right: 20px;">
											${dd.team.name}
											</p>
										</a>
									</td>
									<td class="center-align">${dd.playedGames}</td>
									<td class="center-align">${dd.won}</td>
									<td class="center-align">${dd.draw}</td>
									<td class="center-align">${dd.lost}</td>
									<td class="center-align">${dd.goalsFor}</td>
									<td class="center-align">${dd.goalsAgainst}</td>
									<td class="center-align">${dd.goalDifference}</td>
									<td class="center-align">${dd.points}</td>
								</tr>
							`;
						});
						document.getElementById('tabelKlasemen').innerHTML = tableKlasemen;
						document.getElementById('loading').style.display = 'none';
						resolve(data);
					})
				}
			})
		}

		fetchApi(api_klasemen)
		.then(status)
		.then(json)
		.then(function(data){
			var tableKlasemen = '',
				klasemen = data.standings[0].table;
			klasemen.forEach(function(dd){
				// console.log(dd)
				tableKlasemen += `
					<tr>
						<td class="center-align">${dd.position}</td>
						<td>
							<a href="./team.html?id=${dd.team.id}">
								<p>
								<img src="${url(dd.team.crestUrl)}" style="float: left; width: 20px; margin-right: 20px;">
								${dd.team.name}
								</p>
							</a>
						</td>
						<td class="center-align">${dd.playedGames}</td>
						<td class="center-align">${dd.won}</td>
						<td class="center-align">${dd.draw}</td>
						<td class="center-align">${dd.lost}</td>
						<td class="center-align">${dd.goalsFor}</td>
						<td class="center-align">${dd.goalsAgainst}</td>
						<td class="center-align">${dd.goalDifference}</td>
						<td class="center-align">${dd.points}</td>
					</tr>
				`;
			});
			document.getElementById('tabelKlasemen').innerHTML = tableKlasemen;
			document.getElementById('loading').style.display = 'none';
			resolve(data);
		})
		.catch(error);
	});
}

// Klub
function getKlub(){
	return new Promise((resolve, reject) =>  {
		var urlParams = new URLSearchParams(window.location.search),
			idParam	  = urlParams.get('id');

		if ('caches' in window) {
			caches.match(api_detail_tim).then(function(response){
				if (response) {
					response.json().then(function(data){
						detailKlub(data);
						listPemain(data);
						cekDataFav('tim_favorit', data.id)
						resolve(data);
					})
				}
			})
		}

		fetchApi(api_detail_tim + idParam)
			.then(status)
			.then(json)
			.then(function(data){
				// console.log(data);
				detailKlub(data);
				listPemain(data);
				cekDataFav('tim_favorit', data.id)
				resolve(data);
			})
			.catch(error);
	})
}

function detailKlub(data){
	// detail klub
	getId('logo_klub').src = url(data.crestUrl);
	getId('logo_klub').alt = data.name;
	getId('namaKlub').innerHTML = data.name;

	var tabelDetail = `
	<tbody>
		<tr>
			<th>Nama Klub</th>
			<th class="right">:</th>
			<td id="nama_klub">${filterData(data.name)}</td>
		</tr>
		<tr>
			<th>Tahun Berdiri</th>
			<th class="right">:</th>
			<td id="tahun_berdiri">${filterData(data.founded)}</td>
		</tr>
		<tr>
			<th>Stadion</th>
			<th class="right">:</th>
			<td id="stadion">${filterData(data.venue)}</td>
		</tr>
		<tr>
			<th>Website</th>
			<th class="right">:</th>
			<td id="website">${filterData(url(data.website))}</td>
		</tr>
		<tr>
			<th>Email</th>
			<th class="right">:</th>
			<td id="email">${filterData(data.email)}</td>
		</tr>
		<tr>
			<th>Telepon</th>
			<th class="right">:</th>
			<td id="telepon">${filterData(data.phone)}</td>
		</tr>
		<tr>
			<th>Lokasi</th>
			<th class="right">:</th>
			<td id="lokasi">${filterData(data.address)}</td>
		</tr>
		<tr>
			<th>Warna Kostum</th>
			<th class="right">:</th>
			<td id="warna_klub">${filterData(data.clubColors)}</td>
		</tr>
	</tbody>`;
	getId('tabelDetailKlub').innerHTML = tabelDetail;
	getId('loading').style.display = 'none';
}

function listPemain(data){
	// detail pemain
	var daftarPemain = '',
		pemain = data.squad;

	pemain.forEach(function(p){
		// console.log(p);
		daftarPemain += `
		<tr>
			<td class="center-align">
				<a href="./player.html?id=${p.id}">
					<p>${p.name}</p>
				</a>
			</td>
			<td class="center-align">
				<a href="./player.html?id=${p.id}">
					<p>${filterPemain(p.position)}</p>
				</a>
			</td>
		</tr>`;
	});
	getId('tabelPemainKlub').innerHTML = daftarPemain;
}
// End Klub

// Pemain
function getPemain(){
	return new Promise((resolve, reject) => {
		var urlParams = new URLSearchParams(window.location.search),
			idParam = urlParams.get('id');

		if ('caches' in window) {
			caches.match(api_detail_pemain).then(function(response){
				if (response) {
					response.json().then(function(data){
						getId('pemain').innerHTML = `<h4>${data.name}</h4>
													<h6>${filterPemain(data.position)}</h6>`;
						getId('nama').innerHTML = filterData(data.name);
						getId('nama_depan').innerHTML = filterData(data.firstName);
						getId('nama_belakang').innerHTML = filterData(data.lastName);
						getId('tanggal_lahir').innerHTML = data.dateOfBirth;
						getId('tempat_lahir').innerHTML = data.countryOfBirth;
						getId('kebangsaan').innerHTML = data.nationality;
						getId('posisi').innerHTML = filterPemain(data.position);
						cekDataFav('pemain_favorit', data.id);
						resolve(data);
					})
				}
			})
		}

		fetchApi(api_detail_pemain + idParam)
			.then(status)
			.then(json)
			.then(function(data){
				// console.log(data);
				getId('pemain').innerHTML = `<h4>${data.name}</h4>
											<h6>${filterPemain(data.position)}</h6>`;
				getId('nama').innerHTML = filterData(data.name);
				getId('nama_depan').innerHTML = filterData(data.firstName);
				getId('nama_belakang').innerHTML = filterData(data.lastName);
				getId('tanggal_lahir').innerHTML = data.dateOfBirth;
				getId('tempat_lahir').innerHTML = data.countryOfBirth;
				getId('kebangsaan').innerHTML = data.nationality;
				getId('posisi').innerHTML = filterPemain(data.position);
				cekDataFav('pemain_favorit', data.id);
				resolve(data);
			})
			.catch(error);
	});
}

// Pertandingan
function getJadwalPertandingan(){
	return new Promise((resolve, reject) => {
		if ('caches' in window) {
			caches.match(api_jadwal_pertandingan).then(function(response){
				if (response) {
					response.json().then(function(data){
						var pertandingan = '',
							match = data.matches;

						for (var i = 0; i < 20; i++) {
							// console.log(match[i])
							pertandingan += `
							<div class="col s12 l6">
								<div class="card center-align">
									<div class="card-content">
										<h6>Pertandingan ke-${match[i].matchday}</h6>
										<h5>${match[i].homeTeam.name}</h5>
										<h6>VS</h6>
										<h5>${match[i].awayTeam.name}</h5>
									</div>
									<div class="card-action">
										<h6>${konversiTanggal(match[i].utcDate)}</h6>
										<a href="./match.html?id=${match[i].id}" class="deep-purple-text">Detail Pertandingan</a>
									</div>
								</div>
							</div>`;
						}
						getId('listPertandingan').innerHTML = pertandingan;
						resolve(data);
					})
				}
			})
		}

		fetchApi(api_jadwal_pertandingan)
		.then(status)
		.then(json)
		.then(function(data){
			// console.log(data);
			var pertandingan = '',
				match = data.matches;

			for (var i = 0; i < 20; i++) {
				// console.log(match[i])
				pertandingan += `
				<div class="col s12 l6">
					<div class="card center-align">
						<div class="card-content">
							<h6>Pertandingan ke-${match[i].matchday}</h6>
							<h5>${match[i].homeTeam.name}</h5>
							<h6>VS</h6>
							<h5>${match[i].awayTeam.name}</h5>
						</div>
						<div class="card-action">
							<h6>${konversiTanggal(match[i].utcDate)}</h6>
							<a href="./match.html?id=${match[i].id}" class="deep-purple-text">Detail Pertandingan</a>
						</div>
					</div>
				</div>`;
			}
			getId('listPertandingan').innerHTML = pertandingan;
			resolve(data);
		})
		.catch(error);
	});
}

function getDetailPertandingan(){
	return new Promise((resolve, reject) => {	
		var urlParams = new URLSearchParams(window.location.search),
			idParam = urlParams.get('id');

		if ('caches' in window) {
			caches.match(api_detail_pertandingan).then(function(response){
				if (response) {
					response.json().then(function(data){
						var match = data.match;
						getId('matchday').innerHTML = match.matchday
						getId('tanggal').innerHTML = konversiTanggal(match.utcDate);
						getId('homeTeam').innerHTML = match.homeTeam.name;
						getId('awayTeam').innerHTML = match.awayTeam.name;
						getId('venue').innerHTML = match.venue;

						var hh = data.head2head;
						getId('jumlahMatch').innerHTML = hh.numberOfMatches;
						getId('jumlahGoal').innerHTML = hh.totalGoals;
						// home team
						getId('homeMenang').innerHTML = hh.homeTeam.wins;
						getId('homeKalah').innerHTML = hh.homeTeam.losses;
						getId('homeSeri').innerHTML = hh.homeTeam.draws;
						// away team
						getId('awayMenang').innerHTML = hh.awayTeam.wins;
						getId('awayKalah').innerHTML = hh.awayTeam.losses;
						getId('awaySeri').innerHTML = hh.awayTeam.draws;
						cekDataFav('match_favorit', match.id);
						resolve(data)
					})
				}
			})
		}

		fetchApi(api_detail_pertandingan + idParam)
			.then(status)
			.then(json)
			.then(function(data){
				// console.log(data)

				var match = data.match;
				getId('matchday').innerHTML = match.matchday
				getId('tanggal').innerHTML = konversiTanggal(match.utcDate);
				getId('homeTeam').innerHTML = match.homeTeam.name;
				getId('awayTeam').innerHTML = match.awayTeam.name;
				getId('venue').innerHTML = match.venue;

				var hh = data.head2head;
				getId('jumlahMatch').innerHTML = hh.numberOfMatches;
				getId('jumlahGoal').innerHTML = hh.totalGoals;
				// home team
				getId('homeMenang').innerHTML = hh.homeTeam.wins;
				getId('homeKalah').innerHTML = hh.homeTeam.losses;
				getId('homeSeri').innerHTML = hh.homeTeam.draws;
				// away team
				getId('awayMenang').innerHTML = hh.awayTeam.wins;
				getId('awayKalah').innerHTML = hh.awayTeam.losses;
				getId('awaySeri').innerHTML = hh.awayTeam.draws;
				cekDataFav('match_favorit', match.id);
				resolve(data)
			})
			.catch(error);
	});
}