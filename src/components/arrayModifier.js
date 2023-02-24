function arrayModifier(arr, data = 0, pos, insert) {
    if (pos > arr.length + 1) {
        return arr;
    }
    if (insert == true) {
        arr.splice(pos - 1, 0, data);
    }
    else {
        arr.splice(pos - 1, 1);
    }
    return arr;
}

export default arrayModifier;