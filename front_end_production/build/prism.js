/* PrismJS 1.20.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+aspnet+c+csharp+cpp+java+python+qml+ruby */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = function (u) {
        var c = /\blang(?:uage)?-([\w-]+)\b/i, n = 0, C = {
            manual: u.Prism && u.Prism.manual,
            disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
            util: {
                encode: function e(n) {
                    return n instanceof _ ? new _(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                }, type: function (e) {
                    return Object.prototype.toString.call(e).slice(8, -1)
                }, objId: function (e) {
                    return e.__id || Object.defineProperty(e, "__id", {value: ++n}), e.__id
                }, clone: function t(e, r) {
                    var a, n, l = C.util.type(e);
                    switch (r = r || {}, l) {
                        case"Object":
                            if (n = C.util.objId(e), r[n]) return r[n];
                            for (var i in a = {}, r[n] = a, e) e.hasOwnProperty(i) && (a[i] = t(e[i], r));
                            return a;
                        case"Array":
                            return n = C.util.objId(e), r[n] ? r[n] : (a = [], r[n] = a, e.forEach(function (e, n) {
                                a[n] = t(e, r)
                            }), a);
                        default:
                            return e
                    }
                }, getLanguage: function (e) {
                    for (; e && !c.test(e.className);) e = e.parentElement;
                    return e ? (e.className.match(c) || [, "none"])[1].toLowerCase() : "none"
                }, currentScript: function () {
                    if ("undefined" == typeof document) return null;
                    if ("currentScript" in document) return document.currentScript;
                    try {
                        throw new Error
                    } catch (e) {
                        var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1];
                        if (n) {
                            var t = document.getElementsByTagName("script");
                            for (var r in t) if (t[r].src == n) return t[r]
                        }
                        return null
                    }
                }
            },
            languages: {
                extend: function (e, n) {
                    var t = C.util.clone(C.languages[e]);
                    for (var r in n) t[r] = n[r];
                    return t
                }, insertBefore: function (t, e, n, r) {
                    var a = (r = r || C.languages)[t], l = {};
                    for (var i in a) if (a.hasOwnProperty(i)) {
                        if (i == e) for (var o in n) n.hasOwnProperty(o) && (l[o] = n[o]);
                        n.hasOwnProperty(i) || (l[i] = a[i])
                    }
                    var s = r[t];
                    return r[t] = l, C.languages.DFS(C.languages, function (e, n) {
                        n === s && e != t && (this[e] = l)
                    }), l
                }, DFS: function e(n, t, r, a) {
                    a = a || {};
                    var l = C.util.objId;
                    for (var i in n) if (n.hasOwnProperty(i)) {
                        t.call(n, i, n[i], r || i);
                        var o = n[i], s = C.util.type(o);
                        "Object" !== s || a[l(o)] ? "Array" !== s || a[l(o)] || (a[l(o)] = !0, e(o, t, i, a)) : (a[l(o)] = !0, e(o, t, null, a))
                    }
                }
            },
            plugins: {},
            highlightAll: function (e, n) {
                C.highlightAllUnder(document, e, n)
            },
            highlightAllUnder: function (e, n, t) {
                var r = {
                    callback: t,
                    container: e,
                    selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                };
                C.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), C.hooks.run("before-all-elements-highlight", r);
                for (var a, l = 0; a = r.elements[l++];) C.highlightElement(a, !0 === n, r.callback)
            },
            highlightElement: function (e, n, t) {
                var r = C.util.getLanguage(e), a = C.languages[r];
                e.className = e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r;
                var l = e.parentNode;
                l && "pre" === l.nodeName.toLowerCase() && (l.className = l.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r);
                var i = {element: e, language: r, grammar: a, code: e.textContent};

                function o(e) {
                    i.highlightedCode = e, C.hooks.run("before-insert", i), i.element.innerHTML = i.highlightedCode, C.hooks.run("after-highlight", i), C.hooks.run("complete", i), t && t.call(i.element)
                }

                if (C.hooks.run("before-sanity-check", i), !i.code) return C.hooks.run("complete", i), void (t && t.call(i.element));
                if (C.hooks.run("before-highlight", i), i.grammar) if (n && u.Worker) {
                    var s = new Worker(C.filename);
                    s.onmessage = function (e) {
                        o(e.data)
                    }, s.postMessage(JSON.stringify({language: i.language, code: i.code, immediateClose: !0}))
                } else o(C.highlight(i.code, i.grammar, i.language)); else o(C.util.encode(i.code))
            },
            highlight: function (e, n, t) {
                var r = {code: e, grammar: n, language: t};
                return C.hooks.run("before-tokenize", r), r.tokens = C.tokenize(r.code, r.grammar), C.hooks.run("after-tokenize", r), _.stringify(C.util.encode(r.tokens), r.language)
            },
            tokenize: function (e, n) {
                var t = n.rest;
                if (t) {
                    for (var r in t) n[r] = t[r];
                    delete n.rest
                }
                var a = new l;
                return M(a, a.head, e), function e(n, t, r, a, l, i, o) {
                    for (var s in r) if (r.hasOwnProperty(s) && r[s]) {
                        var u = r[s];
                        u = Array.isArray(u) ? u : [u];
                        for (var c = 0; c < u.length; ++c) {
                            if (o && o == s + "," + c) return;
                            var g = u[c], f = g.inside, h = !!g.lookbehind, d = !!g.greedy, v = 0, p = g.alias;
                            if (d && !g.pattern.global) {
                                var m = g.pattern.toString().match(/[imsuy]*$/)[0];
                                g.pattern = RegExp(g.pattern.source, m + "g")
                            }
                            g = g.pattern || g;
                            for (var y = a.next, k = l; y !== t.tail; k += y.value.length, y = y.next) {
                                var b = y.value;
                                if (t.length > n.length) return;
                                if (!(b instanceof _)) {
                                    var x = 1;
                                    if (d && y != t.tail.prev) {
                                        g.lastIndex = k;
                                        var w = g.exec(n);
                                        if (!w) break;
                                        var A = w.index + (h && w[1] ? w[1].length : 0), P = w.index + w[0].length,
                                            S = k;
                                        for (S += y.value.length; S <= A;) y = y.next, S += y.value.length;
                                        if (S -= y.value.length, k = S, y.value instanceof _) continue;
                                        for (var O = y; O !== t.tail && (S < P || "string" == typeof O.value && !O.prev.value.greedy); O = O.next) x++, S += O.value.length;
                                        x--, b = n.slice(k, S), w.index -= k
                                    } else {
                                        g.lastIndex = 0;
                                        var w = g.exec(b)
                                    }
                                    if (w) {
                                        h && (v = w[1] ? w[1].length : 0);
                                        var A = w.index + v, w = w[0].slice(v), P = A + w.length, E = b.slice(0, A),
                                            N = b.slice(P), j = y.prev;
                                        E && (j = M(t, j, E), k += E.length), W(t, j, x);
                                        var L = new _(s, f ? C.tokenize(w, f) : w, p, w, d);
                                        if (y = M(t, j, L), N && M(t, y, N), 1 < x && e(n, t, r, y.prev, k, !0, s + "," + c), i) break
                                    } else if (i) break
                                }
                            }
                        }
                    }
                }(e, a, n, a.head, 0), function (e) {
                    var n = [], t = e.head.next;
                    for (; t !== e.tail;) n.push(t.value), t = t.next;
                    return n
                }(a)
            },
            hooks: {
                all: {}, add: function (e, n) {
                    var t = C.hooks.all;
                    t[e] = t[e] || [], t[e].push(n)
                }, run: function (e, n) {
                    var t = C.hooks.all[e];
                    if (t && t.length) for (var r, a = 0; r = t[a++];) r(n)
                }
            },
            Token: _
        };

        function _(e, n, t, r, a) {
            this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length, this.greedy = !!a
        }

        function l() {
            var e = {value: null, prev: null, next: null}, n = {value: null, prev: e, next: null};
            e.next = n, this.head = e, this.tail = n, this.length = 0
        }

        function M(e, n, t) {
            var r = n.next, a = {value: t, prev: n, next: r};
            return n.next = a, r.prev = a, e.length++, a
        }

        function W(e, n, t) {
            for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
            (n.next = r).prev = n, e.length -= a
        }

        if (u.Prism = C, _.stringify = function n(e, t) {
            if ("string" == typeof e) return e;
            if (Array.isArray(e)) {
                var r = "";
                return e.forEach(function (e) {
                    r += n(e, t)
                }), r
            }
            var a = {
                type: e.type,
                content: n(e.content, t),
                tag: "span",
                classes: ["token", e.type],
                attributes: {},
                language: t
            }, l = e.alias;
            l && (Array.isArray(l) ? Array.prototype.push.apply(a.classes, l) : a.classes.push(l)), C.hooks.run("wrap", a);
            var i = "";
            for (var o in a.attributes) i += " " + o + '="' + (a.attributes[o] || "").replace(/"/g, "&quot;") + '"';
            return "<" + a.tag + ' class="' + a.classes.join(" ") + '"' + i + ">" + a.content + "</" + a.tag + ">"
        }, !u.document) return u.addEventListener && (C.disableWorkerMessageHandler || u.addEventListener("message", function (e) {
            var n = JSON.parse(e.data), t = n.language, r = n.code, a = n.immediateClose;
            u.postMessage(C.highlight(r, C.languages[t], t)), a && u.close()
        }, !1)), C;
        var e = C.util.currentScript();

        function t() {
            C.manual || C.highlightAll()
        }

        if (e && (C.filename = e.src, e.hasAttribute("data-manual") && (C.manual = !0)), !C.manual) {
            var r = document.readyState;
            "loading" === r || "interactive" === r && e && e.defer ? document.addEventListener("DOMContentLoaded", t) : window.requestAnimationFrame ? window.requestAnimationFrame(t) : window.setTimeout(t, 16)
        }
        return C
    }(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
            "internal-subset": {pattern: /(\[)[\s\S]+(?=\]>$)/, lookbehind: !0, greedy: !0, inside: null},
            string: {pattern: /"[^"]*"|'[^']*'/, greedy: !0},
            punctuation: /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/,
            name: /[^\s<>'"]+/
        }
    },
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
            tag: {pattern: /^<\/?[^\s>\/]+/, inside: {punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/}},
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {punctuation: [{pattern: /^=/, alias: "attr-equals"}, /"|'/]}
            },
            punctuation: /\/?>/,
            "attr-name": {pattern: /[^\s>\/]+/, inside: {namespace: /^[^\s>\/:]+:/}}
        }
    },
    entity: [{pattern: /&[\da-z]{1,8};/i, alias: "named-entity"}, /&#x?[\da-f]{1,8};/i]
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup, Prism.hooks.add("wrap", function (a) {
    "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
}), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (a, e) {
        var s = {};
        s["language-" + e] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Prism.languages[e]
        }, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var n = {"included-cdata": {pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s}};
        n["language-" + e] = {pattern: /[\s\S]+/, inside: Prism.languages[e]};
        var t = {};
        t[a] = {
            pattern: RegExp("(<__[^]*?>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g, function () {
                return a
            }), "i"), lookbehind: !0, greedy: !0, inside: n
        }, Prism.languages.insertBefore("markup", "cdata", t)
    }
}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.ssml = Prism.languages.xml, Prism.languages.atom = Prism.languages.xml, Prism.languages.rss = Prism.languages.xml;
!function (s) {
    var e = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    s.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
            pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
            inside: {
                rule: /^@[\w-]+/,
                "selector-function-argument": {
                    pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                    lookbehind: !0,
                    alias: "selector"
                }
            }
        },
        url: {
            pattern: RegExp("url\\((?:" + e.source + "|[^\n\r()]*)\\)", "i"),
            greedy: !0,
            inside: {function: /^url/i, punctuation: /^\(|\)$/}
        },
        selector: RegExp("[^{}\\s](?:[^{};\"']|" + e.source + ")*?(?=\\s*\\{)"),
        string: {pattern: e, greedy: !0},
        property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
        important: /!important\b/i,
        function: /[-a-z0-9]+(?=\()/i,
        punctuation: /[(){};:,]/
    }, s.languages.css.atrule.inside.rest = s.languages.css;
    var t = s.languages.markup;
    t && (t.tag.addInlined("style", "css"), s.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
            inside: {
                "attr-name": {pattern: /^\s*style/i, inside: t.tag.inside},
                punctuation: /^\s*=\s*['"]|['"]\s*$/,
                "attr-value": {pattern: /.+/i, inside: s.languages.css}
            },
            alias: "language-css"
        }
    }, t.tag))
}(Prism);
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0}],
    string: {pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0},
    "class-name": {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {punctuation: /[.\\]/}
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    }],
    keyword: [{
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
    }],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
        lookbehind: !0,
        greedy: !0
    },
    "function-variable": {
        pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: "function"
    },
    parameter: [{
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript
    }, {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
        greedy: !0,
        inside: {
            "template-punctuation": {pattern: /^`|`$/, alias: "string"},
            interpolation: {
                pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                lookbehind: !0,
                inside: {
                    "interpolation-punctuation": {pattern: /^\${|}$/, alias: "punctuation"},
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.js = Prism.languages.javascript;
!function (s) {
    function a(e, s) {
        return e.replace(/<<(\d+)>>/g, function (e, n) {
            return "(?:" + s[+n] + ")"
        })
    }

    function t(e, n, s) {
        return RegExp(a(e, n), s || "")
    }

    function e(e, n) {
        for (var s = 0; s < n; s++) e = e.replace(/<<self>>/g, function () {
            return "(?:" + e + ")"
        });
        return e.replace(/<<self>>/g, "[^\\s\\S]")
    }

    var n = "bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void",
        i = "class enum interface struct",
        r = "add alias ascending async await by descending from get global group into join let nameof notnull on orderby partial remove select set unmanaged value when where where",
        o = "abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield";

    function l(e) {
        return "\\b(?:" + e.trim().replace(/ /g, "|") + ")\\b"
    }

    var d = l(i), p = RegExp(l(n + " " + i + " " + r + " " + o)), c = l(i + " " + r + " " + o),
        u = l(n + " " + i + " " + o), g = e("<(?:[^<>;=+\\-*/%&|^]|<<self>>)*>", 2),
        b = e("\\((?:[^()]|<<self>>)*\\)", 2), h = "@?\\b[A-Za-z_]\\w*\\b", f = a("<<0>>(?:\\s*<<1>>)?", [h, g]),
        m = a("(?!<<0>>)<<1>>(?:\\s*\\.\\s*<<1>>)*", [c, f]), k = "\\[\\s*(?:,\\s*)*\\]",
        y = a("(?:<<0>>|<<1>>)(?:\\s*(?:\\?\\s*)?<<2>>)*(?:\\s*\\?)?", [a("\\(<<0>>+(?:,<<0>>+)+\\)", [a("[^,()<>[\\];=+\\-*/%&|^]|<<0>>|<<1>>|<<2>>", [g, b, k])]), m, k]),
        w = {keyword: p, punctuation: /[<>()?,.:[\]]/}, v = "'(?:[^\r\n'\\\\]|\\\\.|\\\\[Uux][\\da-fA-F]{1,8})'",
        x = '"(?:\\\\.|[^\\\\"\r\n])*"';
    s.languages.csharp = s.languages.extend("clike", {
        string: [{
            pattern: t("(^|[^$\\\\])<<0>>", ['@"(?:""|\\\\[^]|[^\\\\"])*"(?!")']),
            lookbehind: !0,
            greedy: !0
        }, {pattern: t("(^|[^@$\\\\])<<0>>", [x]), lookbehind: !0, greedy: !0}, {
            pattern: RegExp(v),
            greedy: !0,
            alias: "character"
        }],
        "class-name": [{
            pattern: t("(\\busing\\s+static\\s+)<<0>>(?=\\s*;)", [m]),
            lookbehind: !0,
            inside: w
        }, {
            pattern: t("(\\busing\\s+<<0>>\\s*=\\s*)<<1>>(?=\\s*;)", [h, y]),
            lookbehind: !0,
            inside: w
        }, {
            pattern: t("(\\busing\\s+)<<0>>(?=\\s*=)", [h]),
            lookbehind: !0
        }, {
            pattern: t("(\\b<<0>>\\s+)<<1>>", [d, f]),
            lookbehind: !0,
            inside: w
        }, {
            pattern: t("(\\bcatch\\s*\\(\\s*)<<0>>", [m]),
            lookbehind: !0,
            inside: w
        }, {pattern: t("(\\bwhere\\s+)<<0>>", [h]), lookbehind: !0}, {
            pattern: t("(\\b(?:is|as)\\s+)<<0>>", [y]),
            lookbehind: !0,
            inside: w
        }, {pattern: t("\\b<<0>>(?=\\s+(?!<<1>>)<<2>>(?:\\s*[=,;:{)\\]]|\\s+in))", [y, u, h]), inside: w}],
        keyword: p,
        number: /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:ul|lu|[dflmu])?\b/i,
        operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
        punctuation: /\?\.?|::|[{}[\];(),.:]/
    }), s.languages.insertBefore("csharp", "number", {
        range: {
            pattern: /\.\./,
            alias: "operator"
        }
    }), s.languages.insertBefore("csharp", "punctuation", {
        "named-parameter": {
            pattern: t("([(,]\\s*)<<0>>(?=\\s*:)", [h]),
            lookbehind: !0,
            alias: "punctuation"
        }
    }), s.languages.insertBefore("csharp", "class-name", {
        namespace: {
            pattern: t("(\\b(?:namespace|using)\\s+)<<0>>(?:\\s*\\.\\s*<<0>>)*(?=\\s*[;{])", [h]),
            lookbehind: !0,
            inside: {punctuation: /\./}
        },
        "type-expression": {
            pattern: t("(\\b(?:default|typeof|sizeof)\\s*\\(\\s*)(?:[^()\\s]|\\s(?!\\s*\\))|<<0>>)*(?=\\s*\\))", [b]),
            lookbehind: !0,
            alias: "class-name",
            inside: w
        },
        "return-type": {
            pattern: t("<<0>>(?=\\s+(?:<<1>>\\s*(?:=>|[({]|\\.\\s*this\\s*\\[)|this\\s*\\[))", [y, m]),
            inside: w,
            alias: "class-name"
        },
        "constructor-invocation": {
            pattern: t("(\\bnew\\s+)<<0>>(?=\\s*[[({])", [y]),
            lookbehind: !0,
            inside: w,
            alias: "class-name"
        },
        "generic-method": {
            pattern: t("<<0>>\\s*<<1>>(?=\\s*\\()", [h, g]),
            inside: {function: t("^<<0>>", [h]), generic: {pattern: RegExp(g), alias: "class-name", inside: w}}
        },
        "type-list": {
            pattern: t("\\b((?:<<0>>\\s+<<1>>|where\\s+<<2>>)\\s*:\\s*)(?:<<3>>|<<4>>)(?:\\s*,\\s*(?:<<3>>|<<4>>))*(?=\\s*(?:where|[{;]|=>|$))", [d, f, h, y, p.source]),
            lookbehind: !0,
            inside: {keyword: p, "class-name": {pattern: RegExp(y), greedy: !0, inside: w}, punctuation: /,/}
        },
        preprocessor: {
            pattern: /(^\s*)#.*/m,
            lookbehind: !0,
            alias: "property",
            inside: {
                directive: {
                    pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
                    lookbehind: !0,
                    alias: "keyword"
                }
            }
        }
    });
    var $ = x + "|" + v, _ = a("/(?![*/])|//[^\r\n]*[\r\n]|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>", [$]),
        B = e(a("[^\"'/()]|<<0>>|\\(<<self>>*\\)", [_]), 2),
        E = "\\b(?:assembly|event|field|method|module|param|property|return|type)\\b",
        R = a("<<0>>(?:\\s*\\(<<1>>*\\))?", [m, B]);
    s.languages.insertBefore("csharp", "class-name", {
        attribute: {
            pattern: t("((?:^|[^\\s\\w>)?])\\s*\\[\\s*)(?:<<0>>\\s*:\\s*)?<<1>>(?:\\s*,\\s*<<1>>)*(?=\\s*\\])", [E, R]),
            lookbehind: !0,
            greedy: !0,
            inside: {
                target: {pattern: t("^<<0>>(?=\\s*:)", [E]), alias: "keyword"},
                "attribute-arguments": {pattern: t("\\(<<0>>*\\)", [B]), inside: s.languages.csharp},
                "class-name": {pattern: RegExp(m), inside: {punctuation: /\./}},
                punctuation: /[:,]/
            }
        }
    });
    var P = ":[^}\r\n]+", z = e(a("[^\"'/()]|<<0>>|\\(<<self>>*\\)", [_]), 2),
        S = a("\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}", [z, P]),
        j = e(a("[^\"'/()]|/(?!\\*)|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>|\\(<<self>>*\\)", [$]), 2),
        A = a("\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}", [j, P]);

    function F(e, n) {
        return {
            interpolation: {
                pattern: t("([^{](?:\\{\\{)*)<<0>>", [e]),
                lookbehind: !0,
                inside: {
                    "format-string": {
                        pattern: t("(^\\{(?:(?![}:])<<0>>)*)<<1>>(?=\\}$)", [n, P]),
                        lookbehind: !0,
                        inside: {punctuation: /^:/}
                    },
                    punctuation: /^\{|\}$/,
                    expression: {pattern: /[\s\S]+/, alias: "language-csharp", inside: s.languages.csharp}
                }
            }, string: /[\s\S]+/
        }
    }

    s.languages.insertBefore("csharp", "string", {
        "interpolation-string": [{
            pattern: t('(^|[^\\\\])(?:\\$@|@\\$)"(?:""|\\\\[^]|\\{\\{|<<0>>|[^\\\\{"])*"', [S]),
            lookbehind: !0,
            greedy: !0,
            inside: F(S, z)
        }, {
            pattern: t('(^|[^@\\\\])\\$"(?:\\\\.|\\{\\{|<<0>>|[^\\\\"{])*"', [A]),
            lookbehind: !0,
            greedy: !0,
            inside: F(A, j)
        }]
    })
}(Prism), Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;
Prism.languages.aspnet = Prism.languages.extend("markup", {
    "page-directive": {
        pattern: /<%\s*@.*%>/i,
        alias: "tag",
        inside: {
            "page-directive": {
                pattern: /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
                alias: "tag"
            }, rest: Prism.languages.markup.tag.inside
        }
    },
    directive: {
        pattern: /<%.*%>/i,
        alias: "tag",
        inside: {directive: {pattern: /<%\s*?[$=%#:]{0,2}|%>/i, alias: "tag"}, rest: Prism.languages.csharp}
    }
}), Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i, Prism.languages.insertBefore("inside", "punctuation", {directive: Prism.languages.aspnet.directive}, Prism.languages.aspnet.tag.inside["attr-value"]), Prism.languages.insertBefore("aspnet", "comment", {
    "asp-comment": {
        pattern: /<%--[\s\S]*?--%>/,
        alias: ["asp", "comment"]
    }
}), Prism.languages.insertBefore("aspnet", Prism.languages.javascript ? "script" : "tag", {
    "asp-script": {
        pattern: /(<script(?=.*runat=['"]?server['"]?)[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: !0,
        alias: ["asp", "script"],
        inside: Prism.languages.csharp || {}
    }
});
Prism.languages.c = Prism.languages.extend("clike", {
    comment: {
        pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0
    },
    "class-name": {pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+/, lookbehind: !0},
    keyword: /\b(?:__attribute__|_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
    function: /[a-z_]\w*(?=\s*\()/i,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
    number: /(?:\b0x(?:[\da-f]+\.?[\da-f]*|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
}), Prism.languages.insertBefore("c", "string", {
    macro: {
        pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: !0,
        greedy: !0,
        alias: "property",
        inside: {
            string: [{pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0}, Prism.languages.c.string],
            comment: Prism.languages.c.comment,
            directive: {pattern: /^(#\s*)[a-z]+/, lookbehind: !0, alias: "keyword"}
        }
    },
    constant: /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
}), delete Prism.languages.c.boolean;
!function (e) {
    var t = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
    e.languages.cpp = e.languages.extend("c", {
        "class-name": [{
            pattern: RegExp("(\\b(?:class|enum|struct|typename)\\s+)(?!<keyword>)\\w+".replace(/<keyword>/g, function () {
                return t.source
            })), lookbehind: !0
        }, /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/, /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i, {
            pattern: /\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/,
            inside: null
        }],
        keyword: t,
        number: {
            pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+\.?[\da-f']*|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+\.?[\d']*|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]*/i,
            greedy: !0
        },
        operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
        boolean: /\b(?:true|false)\b/
    }), e.languages.insertBefore("cpp", "string", {
        "raw-string": {
            pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
            alias: "string",
            greedy: !0
        }
    }), e.languages.insertBefore("cpp", "class-name", {
        "base-clause": {
            pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)(?:[^;{}"'])+?(?=\s*[;{])/,
            lookbehind: !0,
            greedy: !0,
            inside: e.languages.extend("cpp", {})
        }
    }), e.languages.insertBefore("inside", "operator", {"class-name": /\b[a-z_]\w*\b(?!\s*::)/i}, e.languages.cpp["base-clause"])
}(Prism);
!function (e) {
    var t = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|null|open|opens|package|private|protected|provides|public|record|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
        a = /\b[A-Z](?:\w*[a-z]\w*)?\b/;
    e.languages.java = e.languages.extend("clike", {
        "class-name": [a, /\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/],
        keyword: t,
        function: [e.languages.clike.function, {pattern: /(\:\:)[a-z_]\w*/, lookbehind: !0}],
        number: /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
        operator: {pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m, lookbehind: !0}
    }), e.languages.insertBefore("java", "string", {
        "triple-quoted-string": {
            pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
            greedy: !0,
            alias: "string"
        }
    }), e.languages.insertBefore("java", "class-name", {
        annotation: {
            alias: "punctuation",
            pattern: /(^|[^.])@\w+/,
            lookbehind: !0
        },
        namespace: {
            pattern: RegExp("(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?".replace(/<keyword>/g, function () {
                return t.source
            })), lookbehind: !0, inside: {punctuation: /\./}
        },
        generics: {
            pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
            inside: {"class-name": a, keyword: t, punctuation: /[<>(),.:]/, operator: /[?&|]/}
        }
    })
}(Prism);
Prism.languages.python = {
    comment: {pattern: /(^|[^\\])#.*/, lookbehind: !0},
    "string-interpolation": {
        pattern: /(?:f|rf|fr)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
                lookbehind: !0,
                inside: {
                    "format-spec": {pattern: /(:)[^:(){}]+(?=}$)/, lookbehind: !0},
                    "conversion-option": {pattern: /![sra](?=[:}]$)/, alias: "punctuation"},
                    rest: null
                }
            }, string: /[\s\S]+/
        }
    },
    "triple-quoted-string": {pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]*?\1/i, greedy: !0, alias: "string"},
    string: {pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i, greedy: !0},
    function: {pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g, lookbehind: !0},
    "class-name": {pattern: /(\bclass\s+)\w+/i, lookbehind: !0},
    decorator: {
        pattern: /(^\s*)@\w+(?:\.\w+)*/im,
        lookbehind: !0,
        alias: ["annotation", "punctuation"],
        inside: {punctuation: /\./}
    },
    keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:True|False|None)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/
}, Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python, Prism.languages.py = Prism.languages.python;
!function (e) {
    for (var r = "(?:[^\\\\()[\\]{}\"'/]|<string>|/(?![*/])|<comment>|\\(<expr>*\\)|\\[<expr>*\\]|\\{<expr>*\\}|\\\\[^])".replace(/<string>/g, function () {
        return "\"(?:\\\\.|[^\\\\\"\r\n])*\"|'(?:\\\\.|[^\\\\'\r\n])*'"
    }).replace(/<comment>/g, function () {
        return "//.*(?!.)|/\\*(?:[^*]|\\*(?!/))*\\*/"
    }), n = 0; n < 2; n++) r = r.replace(/<expr>/g, function () {
        return r
    });
    r = r.replace(/<expr>/g, "[^\\s\\S]"), e.languages.qml = {
        comment: {pattern: /\/\/.*|\/\*[\s\S]*?\*\//, greedy: !0},
        "javascript-function": {
            pattern: RegExp("((?:^|;)[ \t]*)function\\s+[_$a-zA-Z\\xA0-\\uFFFF][$\\w\\xA0-\\uFFFF]*\\s*\\(<js>*\\)\\s*\\{<js>*\\}".replace(/<js>/g, function () {
                return r
            }), "m"), lookbehind: !0, greedy: !0, alias: "language-javascript", inside: e.languages.javascript
        },
        "class-name": {pattern: /((?:^|[:;])[ \t]*)(?!\d)\w+(?=[ \t]*\{|[ \t]+on\b)/m, lookbehind: !0},
        property: [{
            pattern: /((?:^|[;{])[ \t]*)(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
            lookbehind: !0
        }, {
            pattern: /((?:^|[;{])[ \t]*)property[ \t]+(?!\d)\w+(?:\.\w+)*[ \t]+(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
            lookbehind: !0,
            inside: {keyword: /^property/, property: /\w+(?:\.\w+)*/}
        }],
        "javascript-expression": {
            pattern: RegExp("(:[ \t]*)(?![\\s;}[])(?:(?!$|[;}])<js>)+".replace(/<js>/g, function () {
                return r
            }), "m"), lookbehind: !0, greedy: !0, alias: "language-javascript", inside: e.languages.javascript
        },
        string: /"(?:\\.|[^\\"\r\n])*"/,
        keyword: /\b(?:as|import|on)\b/,
        punctuation: /[{}[\]:;,]/
    }
}(Prism);
!function (e) {
    e.languages.ruby = e.languages.extend("clike", {
        comment: [/#.*/, {pattern: /^=begin\s[\s\S]*?^=end/m, greedy: !0}],
        "class-name": {
            pattern: /(\b(?:class)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: !0,
            inside: {punctuation: /[.\\]/}
        },
        keyword: /\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/
    });
    var n = {pattern: /#\{[^}]+\}/, inside: {delimiter: {pattern: /^#\{|\}$/, alias: "tag"}, rest: e.languages.ruby}};
    delete e.languages.ruby.function, e.languages.insertBefore("ruby", "keyword", {
        regex: [{
            pattern: RegExp("%r(?:" + ["([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\1)[^\\\\]|\\\\[^])*\\1[gim]{0,3}", "\\((?:[^()\\\\]|\\\\[^])*\\)[gim]{0,3}", "\\{(?:[^#{}\\\\]|#(?:\\{[^}]+\\})?|\\\\[^])*\\}[gim]{0,3}", "\\[(?:[^\\[\\]\\\\]|\\\\[^])*\\][gim]{0,3}", "<(?:[^<>\\\\]|\\\\[^])*>[gim]{0,3}"].join("|") + ")"),
            greedy: !0,
            inside: {interpolation: n}
        }, {
            pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[gim]{0,3}(?=\s*(?:$|[\r\n,.;})]))/,
            lookbehind: !0,
            greedy: !0
        }],
        variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
        symbol: {pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/, lookbehind: !0},
        "method-definition": {
            pattern: /(\bdef\s+)[\w.]+/,
            lookbehind: !0,
            inside: {function: /\w+$/, rest: e.languages.ruby}
        }
    }), e.languages.insertBefore("ruby", "number", {
        builtin: /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
        constant: /\b[A-Z]\w*(?:[?!]|\b)/
    }), e.languages.ruby.string = [{
        pattern: RegExp("%[qQiIwWxs]?(?:" + ["([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\1)[^\\\\]|\\\\[^])*\\1", "\\((?:[^()\\\\]|\\\\[^])*\\)", "\\{(?:[^#{}\\\\]|#(?:\\{[^}]+\\})?|\\\\[^])*\\}", "\\[(?:[^\\[\\]\\\\]|\\\\[^])*\\]", "<(?:[^<>\\\\]|\\\\[^])*>"].join("|") + ")"),
        greedy: !0,
        inside: {interpolation: n}
    }, {
        pattern: /("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0,
        inside: {interpolation: n}
    }], e.languages.rb = e.languages.ruby
}(Prism);
