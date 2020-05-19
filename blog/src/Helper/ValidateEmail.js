export function validateEmail(e) {
    var mediumRegex = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");
    if (e.match(mediumRegex)) return true
    return false
}