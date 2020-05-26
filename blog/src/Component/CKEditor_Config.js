import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import hljs from 'highlight.js'
var _code_languages = ["plain", "c", "cs", "cpp", "html", "xml", "css", "javascript", "python", "sql", "php", "perl", "ruby", "markdown", "auto"];

ClassicEditor
    .create(document.querySelector('#editor'), {

        preCodeBlock: {

            languages: _code_languages.map(_language => {
                return {
                    language: _language,
                    title: _language == "cs" ? "c#" : _language
                };
            }),
            toolbar: ['EditLanguage', '|', 'SelectLanguage', '|', 'HighlightCodeBlock', '|', 'CloseCodeBlock'],
            noOfSpaceForTabKey: 4,
            highlightConfig: {
                // this function is called whenever syntax highlighting is requested.
                // the highlighting pre element and language will be the arguments for this function
                // this function should return syntax highlighted block.
                // below example uses highlightjs as syntax highlighter
                highlighter: (pre_block, language) => {

                    // to undo highlighting simply uncomment below two lines and return pre_block as is
                    // or you can select plain/text/nohighlight option from language if highlighter supports
                    pre_block.innerHTML = pre_block.innerHTML.replace(/<br[ \/]*>/gi, '\n');
                    hljs.highlightBlock(pre_block); // refer https://github.com/highlightjs/highlight.js
                    return pre_block; // return highlighted pre block to plugin
                }
            }
        }

    })
    .then(editor => {
        window.editor = editor;
    })
    .catch(err => {
        console.error(err.stack);
    });

export default ClassicEditor;