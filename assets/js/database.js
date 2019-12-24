var dbPromise = idb.open('bobola', 1, function(upgradeDb){
	if (!upgradeDb.objectStoreNames.contains('tim_favorit')) {
		var tim_favorit = upgradeDb.createObjectStore('tim_favorit', {keyPath: 'id'});
		tim_favorit.createIndex('nama_tim', 'name', {unique: true});
	}

	if (!upgradeDb.objectStoreNames.contains('pemain_favorit')) {
		var pemain_favorit = upgradeDb.createObjectStore('pemain_favorit', {keyPath: 'id'});
		pemain_favorit.createIndex('nama_pemain', 'name', {unique: true});
	}

	if (!upgradeDb.objectStoreNames.contains('match_favorit')) {
		var match_favorit = upgradeDb.createObjectStore('match_favorit', {keyPath: 'id'});
		match_favorit.createIndex('tim_kandang', 'match.homeTeam.name', {unique: true});
		match_favorit.createIndex('tim_tandang', 'match.awayTeam.name', {unique: true});
	}
})

function cekObjek(obj){
	if (obj == 'tim_favorit') hasil = 'Tim';
	if (obj == 'pemain_favorit') hasil = 'Pemain';
	if (obj == 'match_favorit') hasil = 'Pertandingan';
	return hasil;
}

function cekDataFav(obj, id){
	return new Promise((resolve, reject) => {
		favorit(obj, id).then(function(data){
			if (data != undefined) {
				getId('icon_fav').innerHTML = 'favorite';
				resolve(true);
			} else {
				getId('icon_fav').innerHTML = 'favorite_border';
				resolve(false);
			}
		})
	})
}

function favorit(obj, id){
	return new Promise((resolve, reject) => {
		dbPromise.then(function(db){
			var tx = db.transaction(obj, 'readonly'),
				store = tx.objectStore(obj);
			resolve(store.get(id));
		})
	});
}

// Favorit
function addFav(obj, data){
	var jenis = cekObjek(obj);
	dbPromise.then(function(db){
		var tx = db.transaction(obj, 'readwrite'),
			store = tx.objectStore(obj);
		store.put(data);
		return tx.complete;
	}).then(function(){
		cekDataFav(obj, data.id);
		M.toast({
			html: `${jenis} berhasil difavoritkan`
		})
	}).then(cekDataFav(obj, data.id))
}

function delFav(obj, id){
	var jenis = cekObjek(obj);
	dbPromise.then(function(db){
		var tx = db.transaction(obj, 'readwrite'),
			store = tx.objectStore(obj);
		store.delete(id);
		return tx.complete;
	}).then(function(){
		M.toast({
			html: `${jenis} berhasil dihapus dari daftar favorit`
		})
	}).then(cekDataFav(obj, id))
}

// get Favorit
function getFav(favorit){
	var obj = favorit+'_favorit',
		text = cekObjek(obj) + ' Favorit';
	getId('text-fav').innerHTML = text;

	return new Promise((resolve, reject) => {
		dbPromise.then(function(db){
			var tx = db.transaction(obj, 'readonly'),
				store = tx.objectStore(obj);
			return store.getAll();
		}).then((data) => {
			console.log(data.length)
			var list ='';
			if (data.length > 0) {
				if (favorit == 'tim') {
					data.forEach(function(d){
						list +=	`<div class="col s12 l4">
									<div class="card horizontal">
							      		<div class="card-image" style="display: flex; align-items: center; justify-content: center; padding: 10px">
							        		<img src="${url(d.crestUrl)}" style="width: 75px;">
								    	</div>
								      	<div class="card-stacked">
								      		<div class="card-content">
												<span class="card-title center-align">${d.name}</span>
								      		</div>
								        	<div class="card-action center-align">
								          		<a href="team.html?id=${d.id}"class="btn waves-effect red">Detail</a>
								        	</div>
								      	</div>
								    </div>
								</div>`;
					});
				} else if (favorit == 'pemain') {
					data.forEach((d) => {
						list += `<div class="col s12 l4">
									<div class="card horizontal">
							      		<div class="card-image" style="display: flex; align-items: center; justify-content: center; padding: 10px">
							        		<img src="assets/img/pemain-fav.svg" style="width: 75px;">
								    	</div>
								      	<div class="card-stacked">
								      		<div class="card-content">
												<span class="card-title center-align">${d.name}</span>
								      		</div>
								        	<div class="card-action center-align">
								          		<a href="player.html?id=${d.id}"class="btn waves-effect blue darken-1">Detail</a>
								        	</div>
								      	</div>
								    </div>
								</div>`;
					})
				} else if(favorit == 'match') {
					data.forEach((d) => {
						list += `<div class="col s12 l4">
									<div class="card horizontal">
							      		<div class="card-image" style="display: flex; align-items: center; justify-content: center; padding: 10px">
							        		<img src="assets/img/match-fav.svg" style="width: 75px;">
								    	</div>
								      	<div class="card-stacked">
								      		<div class="card-content">
												<h6 class="center-align">${d.match.homeTeam.name}</h6>
												<p class="center-align">VS</p>
												<h6 class="center-align">${d.match.awayTeam.name}</h6>
								      		</div>
								        	<div class="card-action center-align">
								          		<a href="match.html?id=${d.match.id}"class="btn waves-effect orange lighten-1">Detail</a>
								        	</div>
								      	</div>
								    </div>
								</div>`;
					})
				}
			} else {
				list = `<p class="flow-text center-align red-text lighten-1">Belum Ada Data</p>`
			}

			getId('isi-fav').innerHTML = list;
		})
	})
}