create or replace function public.student_timetable(_faculty_id text)
returns table(lecture_id uuid, course_id uuid, course_name text, title text, description text,
              duration_minutes integer, class_number integer, scheduled_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare
  start_day date;
begin
  -- Students see only their own timetable; staff and the server can see anyone's
  if auth.role() <> 'service_role'
     and not public.is_staff(auth.uid())
     and not exists (select 1 from profiles p where p.id = auth.uid() and p.faculty_id = _faculty_id) then
    raise exception 'not allowed';
  end if;

  select (min(ce.enrollment_date) at time zone 'Africa/Lagos')::date + 1 into start_day
    from course_enrollments ce where ce.faculty_id = _faculty_id and ce.status = 'active';
  if start_day is null then return; end if;

  return query
  with lecs as (
    select l.id, l.course_id, c.name cname, l.title, l.description, l.duration_minutes,
           row_number() over (order by c.sort_order, c.name, l.title) - 1 as k,
           row_number() over (partition by l.course_id order by l.title) as cn
      from lectures l
      join courses c on c.id = l.course_id
      join course_enrollments ce on ce.course_id = l.course_id
                                and ce.faculty_id = _faculty_id and ce.status = 'active'
  ),
  slots as (
    -- Tuesdays and Thursdays at 18:00 Lagos, from the day after the student started
    select ((d::date + time '18:00') at time zone 'Africa/Lagos') as at,
           row_number() over (order by d) - 1 as k
      from generate_series(start_day, start_day + 400, interval '1 day') d
     where extract(isodow from d) in (2, 4)
  )
  select lecs.id, lecs.course_id, lecs.cname, lecs.title, lecs.description,
         lecs.duration_minutes, lecs.cn::integer, slots.at
    from lecs join slots on slots.k = lecs.k
   order by slots.at;
end $$;

revoke all on function public.student_timetable(text) from public, anon;
grant execute on function public.student_timetable(text) to authenticated, service_role;

-- Shared timetable is no longer used; each student has their own
do $$ begin
  if exists (select 1 from cron.job where jobname = 'refresh-class-schedule') then
    perform cron.unschedule('refresh-class-schedule');
  end if;
end $$;
comment on function public.refresh_class_schedule() is 'DEPRECATED: replaced by per-student student_timetable()';
comment on column public.lectures.scheduled_at is 'DEPRECATED for students: per-student dates come from student_timetable()';