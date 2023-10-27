import moment from 'moment'

export const currentAlarm = 'select count(1) as total from ap_alert where to_char(start_time, \'YYYY-MM-dd\') = to_char(current_date, \'YYYY-MM-dd\')'
export const currentMainAlarm = 'select\n' +
  'sum(table1.total) as total\n' +
  'from\n' +
  '(\n' +
  '    select count(1) as total\n' +
  '    from ap_alert\n' +
  '    where to_char(start_time, \'YYYY-MM-dd\') = to_char(current_date, \'YYYY-MM-dd\')\n' +
  '    union all\n' +
  '    select count(1) as total\n' +
  '    from ap_alert_sub\n' +
  '    where to_char(start_time, \'YYYY-MM-dd\') = to_char(current_date, \'YYYY-MM-dd\')\n' +
  ') as table1;'
export const pastSevenDayAlarm = 'select\n' +
  'count(1) as total\n' +
  'from ap_alert\n' +
  'where start_time > now() - interval \'6 day\';'
export const pastAllSevenDayAlarm = 'select\n' +
  'sum(table2.total) as total\n' +
  'from\n' +
  '(\n' +
  '    select count(1) as total\n' +
  '    from ap_alert\n' +
  '    where start_time > now() - interval \'6 day\'\n' +
  '    union all\n' +
  '    select count(1) as total\n' +
  '    from ap_alert_sub\n' +
  '    where start_time > now() - interval \'6 day\'\n' +
  ') as table2;'
export const past7DaysMainAlarm = 'select\n' +
  'table1.collect,\n' +
  'COALESCE(table2.total,0) total\n' +
  'from\n' +
  '(\n' +
  '    SELECT\n' +
  '    to_char(dt,\'yyyy-MM-dd\') as collect\n' +
  '\tfrom generate_series(now() - interval \'6 day\',now(),interval \'1 day\') as dt\n' +
  ') as table1\n' +
  'left join\n' +
  '(\n' +
  '    select\n' +
  '    to_char(start_time, \'YYYY-MM-DD\') as bucket,\n' +
  '    count(1) as total\n' +
  '    from ap_alert\n' +
  '    where start_time > now() - interval \'6 day\'\n' +
  '    group by bucket\n' +
  ') as table2 on table1.collect = table2.bucket\n' +
  'order by table1.collect asc;'
export const past7DaysAllAlarm = `select
table1.collect,
COALESCE(table3.total,0) total
from
(
SELECT
    to_char(dt,'yyyy-MM-dd') as collect
\tfrom generate_series(now() - interval '6 day',now(),interval '1 day') as dt
) as table1
left join
(
    select
    table2.bucket,
    count(1) as total
    from
    (
        select to_char(start_time, 'YYYY-MM-DD') as bucket
        from ap_alert
        where start_time > now() - interval '6 day'
        union all
        select to_char(start_time, 'YYYY-MM-DD') as bucket
        from ap_alert_sub
        where start_time > now() - interval '6 day'
    ) as table2
    group by table2.bucket
) as table3 on table1.collect = table3.bucket
order by table1.collect desc;`

// 告警处置统计 处置率
export const handlingAlarm = (timeList = []) => {
  return `select
table1.id,
table1.name,
COALESCE(table1.total,0) alert_count,
COALESCE(table2.total,0) process_count,
COALESCE(round((table2.total/table1.total::numeric)*100,2),0) as avg_process_rate
from
(
    select apg.id,
    apg.name,
    count(1) total
    from ap_group apg
    left join ap_group_source ags on apg.id = ags.group_id
    left join ap_alert aa on ags.source_id = aa.source_id
    where 1 = 1
    and start_time between '${timeList[0]}' and '${timeList[1]}'
    group by apg.id, apg.name
) as table1
left join
(
    select apg.id,
    apg.name,
    count(1) total
    from ap_group apg
    left join ap_group_source ags on apg.id = ags.group_id
    left join ap_alert aa on ags.source_id = aa.source_id
    where 1 = 1
    and process_status = '1'
    and start_time between '${timeList[0]}' and '${timeList[1]}'
    group by apg.id, apg.name
) as table2 on table1.id = table2.id;`
}

// 平均认领时间 平均认领时间
export const handlingAvgClaimTime = (timeList = []) => {
  return `select
table1.groupid as id,
table1.groupname as name,
round(avg(trunc(extract(epoch from (table2.claim_time - table2.start_time))::numeric)/3600),2) as avg_claim_time
from
(
    select groupid,
    groupname,
    sourceid,
    claimlevel::numeric
    from v_ap_platform_group vappg
    where vappg.claim = true
) as table1
left join
(
    select 
    source_id,
    start_time,
    claim_time,
    level::numeric
    from ap_alert
    where claim_status = '1'
    and start_time between '${timeList[0]}' and '${timeList[1]}'
) as table2 on (table1.sourceid = table2.source_id and table2.level <= table1.claimlevel)
group by table1.groupid,table1.groupname;`
}

// 告警处置统计 平均处置时间
export const handlingAvgTime = (timeList = []) => {
  return `select
apg.id,
apg.name,
round(avg(trunc(extract(epoch from (aa.process_time - aa.start_time))::numeric)/3600),2) as avg_process_time
from ap_group apg
left join ap_group_source ags on apg.id = ags.group_id
left join ap_alert aa on ags.source_id = aa.source_id
where 1 = 1
and process_status = '1'
and start_time between '${timeList[0]}' and '${timeList[1]}'
group by  apg.id,apg.name;`
}

// 告警分级统计
export const gradedStatistics = (timeList = []) => {
  return `select
table1.collect,
COALESCE(table3.level1,0) as level1,
COALESCE(table3.level2,0) as level2,
COALESCE(table3.level3,0) as level3,
COALESCE(table3.level4,0) as level4,
COALESCE(table3.level5,0) as level5
from
(
    SELECT
    to_char(dt,'yyyy-MM-dd') as collect
    from generate_series(${timeList[0]},${timeList[1]},interval '1 day') as dt
) as table1
left join(
    select
    table2.bucket,
    sum(case level when '1' then table2.total end) as level1,
    sum(case level when '2' then table2.total end) as level2,
    sum(case level when '3' then table2.total end) as level3,
    sum(case level when '4' then table2.total end) as level4,
    sum(case level when '5' then table2.total end) as level5
    from (
            select
            to_char(${timeList[0]}, 'YYYY-MM-DD') as bucket,
            level,
            count(1)                          as total
            from ap_alert
            where start_time between ${timeList[0]} and ${timeList[1]}
            and level is not null
            group by bucket, level
            union all
            select
            to_char(start_time, 'YYYY-MM-DD') as bucket,
            level,
            count(1)                          as total
            from ap_alert_sub
            where start_time between ${timeList[0]} and ${timeList[1]}
            group by bucket, level
         ) as table2
    group by table2.bucket
) as table3 on table1.collect = table3.bucket
order by table1.collect asc;`
}

// 数据源
export const alarmTotalType = `select id,name from ap_source where enabled = true;`

// 饼图查询
export const pieDataSql = (id, timeList = []) => {
  return `select 
original_json ->> 'coType' as name,
count(1) as value 
from ap_alert 
where 1 = 1
and original_json ->> 'coType' is not null
and source_id = '${id}'
${timeList.length === 2
    ? `and receive_time between ${timeList[0]} and ${timeList[1]}`
    : ''}
group by original_json ->> 'coType'`
}
