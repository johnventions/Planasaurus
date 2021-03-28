CREATE OR ALTER VIEW View_Field_Output AS

SELECT
	f.project_id as 'project_id',
    d.id as 'field_id',
    f.id as 'value_id',
    d.name as 'key',
    f.value as 'value'
FROM
    field_data f
INNER JOIN
    field_defs d ON f.field_id = d.id
UNION ALL
SELECT
	f2.project_id as 'project_id',
    d.id as 'field_id',
    f2.id as 'value_id',
    d.name as 'key',
    convert(varchar, f2.value, 23) as 'value'
FROM
    field_dates f2
INNER JOIN
    field_defs d ON f2.field_id = d.id

UNION ALL
SELECT
	f3.project_id as 'project_id',
    d.id as 'field_id',
    f3.id as 'value_id',
    d.name as 'key',
    CAST(f3.value as varchar) as 'value'
FROM
    field_related f3
INNER JOIN
    field_defs d ON f3.field_id = d.id

UNION ALL
SELECT
	f4.project_id as 'project_id',
    d.id as 'field_id',
    f4.id as 'value_id',
    d.name as 'key',
    CASE WHEN f4.value = 1 THEN '1' 
        ELSE '0' END 'value'
FROM
    field_bools f4
INNER JOIN
    field_defs d ON f4.field_id = d.id