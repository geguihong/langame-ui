const getFullKey = (key) => {
    return `langame.${key}`
}

exports.setLocalStorage = (key, value) => {
    key = getFullKey(key)
    if (value && typeof (value) == 'object') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

exports.getLocalStorage = (key) => {
    key = getFullKey(key)
    let value = localStorage.getItem(key)
    if (value) {
        try {
            value = JSON.parse(value);
        } catch (e) {
        }
    }
    return value
}

exports.removeLocalStorage = (key) => {
    key = getFullKey(key)
    localStorage.removeItem(key)
}