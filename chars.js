var cs = [
'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 
'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 
'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 
'Y', 'Z'
];

var csi = {};
for(var i in cs){
    csi[cs[i]] = i;
}

exports.getChars = function (index) {
    if (index < 0) {
        return '';
    }
    var a = [];
    while (index >= cs.length) {
        var r = index % cs.length;
        a.push(r);
        index = (index - r) / cs.length;
    }
    a.push(index);

    var r = [];
    for (var i in a) {
        r.push(cs[a[i]]);
    }
    return r.reverse().join('');
};

exports.getIndex = function (chars) {
    if(!chars || chars.trim().length === 0){
        return -1;
    }
    var ret = 0;
    for(var i=0; i<chars.length; ++i){
        var c = chars[chars.length-i-1];
        ret += csi[c] * Math.pow(cs.length, i);
    }
    return ret;
};