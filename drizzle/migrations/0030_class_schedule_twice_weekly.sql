create or replace function public.refresh_class_schedule()
returns void language plpgsql security definer set search_path = public as $$
declare
  grp record;
  lec record;
  k integer;
  start_ts timestamptz;
begin
  -- Classes that have already happened are no longer "next"
  update lectures set status = 'completed'
   where status = 'scheduled' and scheduled_at < now();

  for grp in select distinct plan_required from courses loop
    -- Only start a new cycle once every class in this programme is in the past
    if exists (select 1 from lectures l join courses c on c.id = l.course_id
               where c.plan_required = grp.plan_required and l.scheduled_at >= now()) then
      continue;
    end if;
    -- Next Tuesday, 18:00 Lagos (17:00 UTC)
    start_ts := (date_trunc('week', now() at time zone 'UTC') + interval '1 day' + interval '17 hours') at time zone 'UTC';
    while start_ts <= now() + interval '1 day' loop
      start_ts := start_ts + interval '7 days';
    end loop;
    k := 0;
    for lec in
      select l.id from lectures l join courses c on c.id = l.course_id
       where c.plan_required = grp.plan_required
       order by c.sort_order, c.name, l.scheduled_at, l.title
    loop
      -- Two classes a week: Tuesday and Thursday, courses taken one after another
      update lectures set
        scheduled_at = start_ts + ((k / 2) * interval '7 days') + ((k % 2) * interval '2 days'),
        status = 'scheduled', updated_at = now()
       where id = lec.id;
      k := k + 1;
    end loop;
  end loop;
end $$;

revoke all on function public.refresh_class_schedule() from public, anon, authenticated;

select public.refresh_class_schedule();

do $$ begin
  if exists (select 1 from cron.job where jobname = 'refresh-class-schedule') then
    perform cron.unschedule('refresh-class-schedule');
  end if;
  perform cron.schedule('refresh-class-schedule', '10 6 * * *', 'select public.refresh_class_schedule()');
end $$;