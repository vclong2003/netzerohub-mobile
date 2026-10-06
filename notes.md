```bash
export JAVA_HOME=`/usr/libexec/java_home -v 17`
```

| Syntax      | Name              | Example File             | Resolves to URL               |
| :---------- | :---------------- | :----------------------- | :---------------------------- |
| `name`      | **Standard**      | `app/settings.tsx`       | `/settings`                   |
| `(group)`   | **Route Group**   | `app/(auth)/login.tsx`   | `/login` _(group is ignored)_ |
| `[param]`   | **Dynamic Param** | `app/product/[id].tsx`   | `/product/99`                 |
| `[...rest]` | **Catch-all**     | `app/docs/[...slug].tsx` | `/docs/intro/getting-started` |
