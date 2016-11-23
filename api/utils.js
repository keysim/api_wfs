function cloneObject(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)){
            if(typeof obj[attr] == "object")
                copy[attr] = cloneObject(obj[attr]);
            else
                copy[attr] = obj[attr];
        }
    }
    return copy;
}

function merge(obj_dest, obj_src) {
    for (var key in obj_src)
        obj_dest[key] = obj_src[key];
    return obj_dest;
}

function mask(obj, paramsToBind) {
    var res = {};
    for (var i = 0; i < paramsToBind.length; i++)
        res[paramsToBind[i]] = obj[paramsToBind[i]];
    return res;
}

function mask_obj(obj, tab) {
    var res = {};
    for (var key in tab)
        if(obj[key])
            res[key] = obj[key];
    return res;
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function set(obj1, obj2, paramsToSet) {
    for (var i = 0; i < paramsToSet.length; i++)
        obj1[paramsToSet[i]] = obj2[paramsToSet[i]];
}

function check(req, res, tab) {
	for (var key in tab)
		if(!req.body[tab[key]]) {
			res.json({success:false, message: "Field '" + tab[key] + "' is missing.", needed: tab});
			return false;
		}
	return true;
}

module.exports = {
    cloneObject : cloneObject,
    isEmptyObject: isEmptyObject,
    mask_obj    : mask_obj,
    merge       : merge,
    mask        : mask,
    set         : set
};