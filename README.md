## Telegram Message Receiver

### You need to define these ENV Variables:

```
- PG_HOST=<Postgresql Host>
- PG_USER=<Postgresql Username
- PG_PORT=<Postgresql Port>
- PG_PASS=<Postgrsql Password>
- PG_DB=<Postgresql Database>
- RECEIVER_URL=<Url the current receiver will listen on>
- MIDDLEWARE_PORT=<Port the middlewware is listening on>
```

### APIs Exposed:

* GET `/groups/:id/messages` Querys all messages by group id
* GET `/groups/:id/messages?page=1` Querys all messages by group id passing a page number
