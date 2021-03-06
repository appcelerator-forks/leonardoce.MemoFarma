// This file is part of MemoFarma.
//
// MemoFarma is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// MemoFarma is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with MemoFarma.  If not, see <http://www.gnu.org/licenses/>.

var StringUtils = require("StringUtils");
var Alloy = require("alloy");
var moment = require("moment-with-locales");
var leoModule = require('it.interfree.leonardoce.bootreceiver');

/**
 * Carica tutte le somministrazioni di oggi in formato JSON
 */
function dammiSomministrazioniDiOggi() {
	var dataOggi = StringUtils.timestampToSql(new Date());
	var somministrazioni = Alloy.createCollection("somministrazione");

	somministrazioni.fetch({
		query : {
			statement : "select * from somministrazione where quando like ? order by quando",
			params : [dataOggi.substring(0, 8) + '%']
		}
	});

	somministrazioni = somministrazioni.toJSON();
	return somministrazioni;
}

/**
 * Attiva la gestione degli allarmi
 */
function attivaGestioneAllarmi() {
	// Vediamo quello che e' stato preso oggi
	var somministrazioni = dammiSomministrazioniDiOggi();

	// Schedulo gli allarmi
	Ti.API.info("Gestione degli allarmi in corso...");
	var terapie = Alloy.createCollection("terapie");
	terapie.fetch();
	terapie = terapie.toJSON();

	for (var i = 0; i < terapie.length; i++) {
		var ora = terapie[i].ora.split(":").map(function(x) {
			return parseInt(x, 10);
		});

        if (moment(StringUtils.sqlToTimestamp(terapie[i].data_inizio)).hours(0).minutes(0).isAfter(moment())) {
            Ti.API.info("La terapia con ID " + StringUtils.box(terapie[i].terapia_id) + " non e' ancora iniziata.");
            leoModule.clearAlarm(terapie[i].terapia_id);
        } else if (0 !== terapie[i].considera_data_fine && moment(StringUtils.sqlToTimestamp(terapie[i].data_fine)).hours(23).minutes(59).isBefore(moment())) {
			Ti.API.info("La terapia con ID " + StringUtils.box(terapie[i].terapia_id) + " e' finita");
			leoModule.clearAlarm(terapie[i].terapia_id);
		} else if (controllaSeSomministrata(terapie[i], somministrazioni)) {
			Ti.API.info("La terapia con ID " + StringUtils.box(terapie[i].terapia_id) + " e' gia' stata somministrata. Inizio da domani.");
			leoModule.addAlarmDomani(ora[0], ora[1], terapie[i].terapia_id);
		} else {
			Ti.API.info("La terapia con ID " + StringUtils.box(terapie[i].terapia_id) + " NON e' gia' stata somministrata. Inizio da oggi.");
			leoModule.addAlarmOggi(ora[0], ora[1], terapie[i].terapia_id);
		}
	}
}

/**
 * Cancella un allarme per una certa terapia
 */
function cancellaAllarmePerTerapia(terapia) {
	leoModule.clearAlarm(terapia.get("terapia_id"));
}

/**
 * Controlla se oggi ci sono delle terapie che
 * non sono state prese
 */
function controllaTerapieDiOggi() {
	var oraCorrente = StringUtils.dateToOra(new Date());
	return controllaTerapieDiOggiPerOra(oraCorrente);
}

/**
 * Controlla se oggi ci sono delle terapie che
 * non sono state prese
 */
function controllaTerapieDiOggiPerOra(oraCorrente) {
	var terapie = Alloy.createCollection("terapie");

	var dataIeri = StringUtils.timestampToSql(moment().subtract(1, 'day').toDate());

	terapie.fetch();

	terapie = terapie.toJSON();
	somministrazioni = dammiSomministrazioniDiOggi();

	var terapieNonPrese = [];
	for (var i = 0; i < terapie.length; i++) {
		if (terapie[i].ora > oraCorrente) {
			// nop()
		} else if (moment(StringUtils.sqlToTimestamp(terapie[i].data_inizio)).hours(0).minutes(0).isAfter(moment())) {
			// nop()
		} else if (terapie[i].considera_data_fine !== 0 && moment(StringUtils.sqlToTimestamp(terapie[i].data_fine)).hours(23).minutes(59).isBefore(moment())) {
			// nop()
		} else if (!controllaSeSomministrata(terapie[i], somministrazioni)) {
			terapieNonPrese.push(terapie[i]);
		}
	}

	Ti.API.info("Ci sono " + terapieNonPrese.length + " terapie non prese");

	return terapieNonPrese;
}

/**
 * Controlla se e' stata presa una certa terapia
 */
function controllaSeSomministrata(terapia, somministrazioni) {
	for (var i = 0; i < somministrazioni.length; i++) {
		if (somministrazioni[i].ora_richiesta == terapia.ora && somministrazioni[i].nome == terapia.nome) {
			return true;
		}
	}

	return false;
}

exports.attivaGestioneAllarmi = attivaGestioneAllarmi;
exports.cancellaAllarmePerTerapia = cancellaAllarmePerTerapia;
exports.controllaTerapieDiOggi = controllaTerapieDiOggi;
exports.controllaTerapieDiOggiPerOra = controllaTerapieDiOggiPerOra;
