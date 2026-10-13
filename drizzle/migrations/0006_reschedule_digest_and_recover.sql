SELECT cron.alter_job(10, schedule := '0 6 * * 1');
SELECT cron.alter_job(11, schedule := '30 5 * * 1,4');