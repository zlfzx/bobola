var getId = (id) => document.getElementById(id);
var getParam = (param) => {
	var urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

var filterData = (data) => {
	if (data == null || data == '') {
		data = '-';
	}
	return data;
}

var filterPemain = (posisi)  => {
	if (posisi == null || posisi == '') {
		posisi = 'COACH';
	}
	return posisi;
}

function konversiTanggal(date){
	var date = new Date(date);
	var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'],
		bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

	return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()} - ${konversiJam(date)}`;
}

function konversiJam(date){
	var jam = date.getHours(),
		menit = date.getMinutes(),
		menit = menit < 10 ? '0'+menit : menit;
	return jam+':'+menit;
}

function back(){
	window.history.back();
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}