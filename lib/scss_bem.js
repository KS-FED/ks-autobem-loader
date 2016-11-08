module.exports = function (source,map) {
    return source.replace(/\s_/g,'-')
}
