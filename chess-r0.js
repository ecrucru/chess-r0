
//==================================================
// Chess R0
// Copyright (C) 2019, ecrucru
// https://github.com/ecrucru/chess-r0/
// License AGPL v3
//==================================================

// https://www.fide.com/fide/handbook.html?id=197&view=article

"use strict";

function chess0_fide(pEloOpponent, pScore)
{
	var rc, w0, w, tab;

	//-- Average opponent
	rc = 0;
	pEloOpponent.forEach(function(e) { rc += parseInt(e); });
	rc = Math.round(rc / pEloOpponent.length);

	//-- Points
	w0 = 0.0;
	pScore.forEach(function(e) { w0 += parseFloat(e); });
	w = Math.round(100 * (w0 / pScore.length));

	//-- Result
	if (w == 50)
		return rc;
	tab = [-800, -677, -589, -538, -501, -470, -444, -422, -401, -383, -366, -351, -336, -322, -309, -296, -284, -273, -262, -251, -240, -230, -220, -211, -202, -193, -184, -175, -166, -158, -149, -141, -133, -125, -117, -110, -102, -95, -87, -80, -72, -65, -57, -50, -43, -36, -29, -21, -14, -7, 0, 7, 14, 21, 29, 36, 43, 50, 57, 65, 72, 80, 87, 95, 102, 110, 117, 125, 133, 141, 149, 158, 166, 175, 184, 193, 202, 211, 220, 230, 240, 251, 262, 273, 284, 296, 309, 322, 336, 351, 366, 383, 401, 422, 444, 470, 501, 538, 589, 677, 800];
	if (w > 50)
		return rc + 20 * Math.round((w0 - pScore.length / 2.0) / 0.5);
	else
		return rc + tab[w];		// Swiss [+]
}

function chess0_var(pEloPlayer, pEloOpponent, pScore)
{
	var k, d, tab, p;
	k = 20;
	d = Math.min(400, Math.max(-400, pEloPlayer - pEloOpponent));
	tab = [50, 50, 50, 50, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 55, 55, 55, 55, 55, 55, 56, 56, 56, 56, 56, 56, 56, 57, 57, 57, 57, 57, 57, 57, 58, 58, 58, 58, 58, 58, 58, 58, 59, 59, 59, 59, 59, 59, 59, 60, 60, 60, 60, 60, 60, 60, 60, 61, 61, 61, 61, 61, 61, 61, 62, 62, 62, 62, 62, 62, 62, 62, 63, 63, 63, 63, 63, 63, 63, 64, 64, 64, 64, 64, 64, 64, 64, 65, 65, 65, 65, 65, 65, 65, 66, 66, 66, 66, 66, 66, 66, 66, 67, 67, 67, 67, 67, 67, 67, 67, 68, 68, 68, 68, 68, 68, 68, 68, 69, 69, 69, 69, 69, 69, 69, 69, 70, 70, 70, 70, 70, 70, 70, 70, 71, 71, 71, 71, 71, 71, 71, 71, 71, 72, 72, 72, 72, 72, 72, 72, 72, 73, 73, 73, 73, 73, 73, 73, 73, 73, 74, 74, 74, 74, 74, 74, 74, 74, 74, 75, 75, 75, 75, 75, 75, 75, 75, 75, 76, 76, 76, 76, 76, 76, 76, 76, 76, 77, 77, 77, 77, 77, 77, 77, 77, 77, 78, 78, 78, 78, 78, 78, 78, 78, 78, 78, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 81, 81, 81, 81, 81, 81, 81, 81, 81, 81, 81, 82, 82, 82, 82, 82, 82, 82, 82, 82, 82, 82, 83, 83, 83, 83, 83, 83, 83, 83, 83, 83, 83, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 89, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 92, 92, 92, 92, 92, 92, 92, 92, 92];
	p = tab[Math.abs(d)] / 100.0;
	p = (pEloPlayer >= pEloOpponent ? p : 1.0 - p);
	return parseFloat((k * (pScore - p)).toPrecision(1));
}

function chess0_estimate(pEloOpponent, pScore, pIncremental)
{
	var i, eloIterator, elo, eloCandidate, eloFide0, vari, diff, diffMin;

	//-- Calculates
	eloCandidate = 0;
	diffMin = Infinity;
	for (eloIterator=1 ; eloIterator<=3500 ; eloIterator++)
	{
		elo = eloIterator;
		diff = 0;
		for (i=0 ; i<pEloOpponent.length ; i++)
		{
			vari = chess0_var(elo, parseInt(pEloOpponent[i]), parseFloat(pScore[i]));
			diff += vari;
			if (pIncremental)
				elo = Math.round(elo + vari);
		}
		diff = Math.abs(diff);
		if (diff < diffMin)
		{
			diffMin = diff;
			eloCandidate = elo;
		}
	}
	return eloCandidate;
}

function chess0_readList(pList)
{
	var rrp = function(pString, pFrom, pTo) {
		var len0;
		do {
			len0 = pString.length;
			pString = pString.split(pFrom).join(pTo);
		} while (pString.length != len0);
		return pString;
	};
	return rrp(rrp(rrp(rrp(rrp(pList, "\r", ''), "\t", ' '), "\n", ' '), '  ', ' '), ',', '.').trim().split(' ');
}

function chess0_ui()
{
	var elo, score, incremental;

	//-- Inputs
	elo = chess0_readList(document.getElementById('chess0_opponents').value);
	score = chess0_readList(document.getElementById('chess0_scores').value);
	if ((elo.length != score.length) || (score.length == 0))
	{
		alert('Wrong input... :-(');
		return false;
	}
	incremental = document.getElementById('chess0_incremental').checked;

	//-- Result
	alert('Your initial ELO rating is estimated at ' + chess0_estimate(elo, score, incremental) + ', instead of ' + chess0_fide(elo, score) + ' according to FIDE.');
	return true;
}
