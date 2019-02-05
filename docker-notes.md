build image

```
docker image build --tag tec-lc-server .
```

run image

```
docker container run -p 3001:80 --detach --env LC_BASE='http://whatever.com' tec-lc-server
```

see logs 

```
docker container logs -f container_name
```
