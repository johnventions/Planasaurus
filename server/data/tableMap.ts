const tableMap = function (fieldType?: Number) {
    if (fieldType && fieldType == 3) return "field_dates";
    return "field_data";
}

export default tableMap;