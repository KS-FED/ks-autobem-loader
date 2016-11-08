var url = require('url')
var scss_bem = require('./lib/scss_bem')
var tpl_bem = require('./lib/tpl_bem')



module.exports = function (source,map) {
    var callback = this.async()
    var type = url.parse(this.query,true).query.type
    
    if(/^(css|sass|scss)$/.test(type)){
            callback(null,scss_bem(source))
    }else if(/^(html|tpl)$/.test(type)){
        
        tpl_bem(source).then((result)=>{
            callback(null,result)
        }).catch((error)=>{
            throw error
        })    
    }
    
}
