var chars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
];

exports.chars = chars;

exports.getChars = function (index) {
    if (index < 0) {
        return '';
    }
    var a = [];
    while (index >= 36) {
        var r = index % 36;
        a.push(r);
        index = (index - r) / 36;
    }
    a.push(index);

    var r = [];
    for (var i in a) {
        r.push(chars[a[i]]);
    }
    return r.reverse().join('');
};

exports.getIndex = function (chars) {
    return parseInt(chars, 36);
};
