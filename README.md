#ks-autobem-loader
    自动化css(BEM)命名填充方式
    
```sass

    .module {
        _head {
            font-size:16px;
        }
    }

    输出
    .module-head {
        font-size:16px;
    }
```

```html

    
    <div class="module">
        <div class="_head"></div>
    </div>

    输出
    <div class="module" cid="module">
        <div class="module_head"></div>
    </div>

```

## sass 配置
    webpack
    loaders
    ...
    'css-loader!ks-autobem-loader?type=css!sass-loader'

## (html|vue|tpl) 配置
    ...
    vue: {
        loaders: {
          html: 'vue-html-loader!ks-autobem-loader?type=html'
        }
    }
 