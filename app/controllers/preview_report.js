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

var args = arguments[0] || {};

function doSendEmail() {
    var EmailUtils = require("EmailUtils");
    EmailUtils.inviaMail(args.title, L("lb_allego_quanto_in_oggetto"), args.file);
}

function doHomeIcon() {
    $.preview_report.close();
}

$.paginaweb.url = args.file.nativePath;
