```bash
export JAVA_HOME=`/usr/libexec/java_home -v 17`
```

| Syntax      | Name              | Example File             | Resolves to URL               |
| :---------- | :---------------- | :----------------------- | :---------------------------- |
| `name`      | **Standard**      | `app/settings.tsx`       | `/settings`                   |
| `(group)`   | **Route Group**   | `app/(auth)/login.tsx`   | `/login`                      |
| `[param]`   | **Dynamic Param** | `app/product/[id].tsx`   | `/product/99`                 |
| `[...rest]` | **Catch-all**     | `app/docs/[...slug].tsx` | `/docs/intro/getting-started` |

### Build

```bash
npx expo prebuild --clean

# go to android folder
cd android

# build apk
./gradlew assembleRelease

```

Or EAS build

```bash
eas build --platform android --profile preview --local
```

### scrcpy

```bash
scrcpy --video-codec=h265 --max-size=1920 --max-fps=60 --video-buffer=25 --turn-screen-off
```
