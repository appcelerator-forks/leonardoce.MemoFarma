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

/**
 * Primo giorno (0<x<7) del mese
 */
function primoGiornoDelMese(annoCorrente, meseCorrente)
{
	var d = new Date();
	d.setMonth(meseCorrente);
	d.setDate(1);
	d.setFullYear(annoCorrente);
	return d.getDay();
}

/**
 * Quanti giorni ha questo mese?
 */
function quantiGiorniHaQuestoMese(annoCorrente, meseCorrente)
{
	if (meseCorrente==0)
	{
		return 31;
	}
	else if (meseCorrente==11)
	{
		return 31;
	}
	else
	{
		var d = new Date();
		d.setDate(1);
		d.setMonth(meseCorrente+1);
		d.setTime(d.getTime()- (24*60*60*1000));
		return d.getDate();
	}
}

/**
 * Confronta due oggetti Date del javascript escludendo
 * dal confronto le ore ed i minuti
 */
function confrontaData(d1, d2)
{
	return (d1.getDate()==d2.getDate()) &&
		(d1.getMonth()==d2.getMonth()) &&
		(d1.getFullYear()==d2.getFullYear());
}

exports.primoGiornoDelMese = primoGiornoDelMese;
exports.quantiGiorniHaQuestoMese = quantiGiorniHaQuestoMese;
exports.confrontaData = confrontaData;
