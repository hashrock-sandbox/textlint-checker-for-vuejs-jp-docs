module.exports = function (context) {
    var exports = {};
    
    /*
     * https://github.com/vuejs-jp/vuejs.org/blob/lang-ja/CONTRIBUTING.md#半角スペースでアルファベット両端を入れて読みやすく
     */
    var halfSpace = function(node){
		var text = context.getSource(node);
        var matches_01 = /[a-zA-Z][^\x20-\x7E、。（）]/.exec(text);
        var matches_02 = /[a-zA-Z][^\x20-\x7E、。（）]/.exec(text);
        if(matches_01 || matches_02){
            var report = matches_01 ? matches_01 : matches_02;
            context.report(node, new context.RuleError("半角と全角の間は一文字あける : " + " [" + report[0] + "] ... " + text ));
        }
    }
    
    /*
     * https://github.com/vuejs-jp/vuejs.org/blob/lang-ja/CONTRIBUTING.md#単語の統一-特に技術用語
     */
    var term = function(node){
        var text = context.getSource(node);
        
        //すべてASCIIなら、おそらくコード例もしくは未翻訳なのでチェック対象にしない
        if(/^[\x20-\x7E]+$/.test(text)){
            return;
        }

        //言い換え辞書
        var terms = [
            ["expression", "式(または表現)"],
            ["filter", "フィルタ"]
        ]
        
        terms.forEach(function(term){
            if(text.match(term[0])){
                context.report(node, new context.RuleError("言い換えの推奨 : "+ term[0] +" > " + term[1] + " ... " +text ));
            }
        })
    }
    
    exports[context.Syntax.Str] = function (node) {
        halfSpace(node);
        term(node);
    };
    return exports;
};
