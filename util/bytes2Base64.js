let base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
module.exports = function(bytes) {
    var base64 = [], overflow;
    for (var i = 0; i < bytes.length; i++) {
        switch (i % 3) {
            case 0:
                base64.push(base64map.charAt(bytes[i] >>> 2));
                overflow = (bytes[i] & 0x3) << 4;
                break;
            case 1:
                base64.push(base64map.charAt(overflow | (bytes[i] >>> 4)));
                overflow = (bytes[i] & 0xF) << 2;
                break;
            case 2:
                base64.push(base64map.charAt(overflow | (bytes[i] >>> 6)));
                base64.push(base64map.charAt(bytes[i] & 0x3F));
                overflow = -1;
        }
    }

    // Encode overflow bits, if there are any
    if (overflow != undefined && overflow != -1)
        base64.push(base64map.charAt(overflow));

    // Add padding
    while (base64.length % 4 != 0) base64.push("=");

    return base64.join("");
};