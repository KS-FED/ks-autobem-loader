/**
 * @description 转换
 * @author zdzDesigner pkeros
 * @data 2016/11/8
 * @email 1696498456@qq.com pkeros@vip.qq.com
 */
var fs = require('fs')
var path = require('path')
var htmlparser = require('htmlparser2')


module.exports = compile
function compile(source) {
    return new Promise((resolve, reject) => {
        var data = source

        source = '<div>' + source + '</div>'

        var parser = new htmlparser.Parser(new htmlparser.DefaultHandler((error, dom) => {
            if (error) {
                reject(error)
            } else {
                // callback(null,processFunc(dom,source))
                resolve(processFunc(dom, data))
            }

        }), {
            verbose: true,
            ignoreWhitespace: true
        })
        parser.parseComplete(source)
    })


}

/**
 * @description .
 * @param dom {Object} dom.
 */
function construction(dom, prevPath, classMapper) {

    var targetClass = null
    var attribute = dom.attribs
    var tempArr = prevPath


    var children = dom.children ? dom.children : []
    var cidAttr = attribute ? (attribute.cid ? attribute.cid : '') : ''
    var className = attribute ? (attribute.class ? attribute.class : '') : ''
    var classArr = className ? className.split(' ') : []

    classMapper = classMapper || {}

    // 检查是否包含作用域控制符
    if (cidAttr) {
        tempArr = []
        tempArr.push(cidAttr)
    }

    // 解析 class 查看是否含有 `_` 前缀
    classArr.forEach(o => {
        var prefix = o.substr(0, 2)

        if (~prefix.indexOf('_') && prefix !== '__') {
            targetClass = o
        }
    })

    // 如果含有指定 class 压入栈, 并创建当前 class 的路径映射
    if (targetClass) {
        tempArr = prevPath.concat((targetClass.substr(1)))
        if(classMapper[targetClass]){
            // classMapper[targetClass] = [classMapper[targetClass]]
            // console.log(classMapper[targetClass])
            classMapper[targetClass].push(tempArr)
        }else{
            classMapper[targetClass] = [tempArr]
        }
        
            // console.log(classMapper)
    }

    // 处理子元素
    if (!children.length || children.every(o => o.type === 'text')) {
        // 到达 DOM 末尾节点

        // return classMapper  
    } else {
        // 继续解析其子元素
        children.forEach(o => {
            if (o.type !== 'text') {
                return construction(o, tempArr, classMapper)
            }
        })
        // console.log('classMapper',classMapper)
        return classMapper

    }

}

function processFunc(dom, data) {
    if(!data.match(/class="(.*\s)?_/g)) return data
    var classMapper = construction(dom[0], [], {})
    for (var k in classMapper) {
        var v = classMapper[k]
        data = replace(data,k,v)
    }
    return data
}

function replace(str,reg,arr){
    var arr_temp = [].concat(arr)
    arr.forEach(item=>{
        // console.log(reg,arr_temp[0])
        str = str.replace(new RegExp('\\b'+reg+'\\b'),arr_temp[0].join('-'))
        arr_temp.shift()
    })
    
    return str
}