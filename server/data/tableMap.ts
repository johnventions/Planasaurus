const tableMap = function (fieldType?: Number) {
    if (fieldType && fieldType == 3) return "field_dates";
    if (fieldType && fieldType == 6) return "field_related";
    if (fieldType && fieldType == 7) return "field_related";
    if (fieldType && fieldType == 8) return "field_uploads";
    return "field_data";
}

export default tableMap;