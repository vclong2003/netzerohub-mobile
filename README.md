<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ceb4e666-2315-4b6c-b284-0432de2abb46" /></td>
    <td><img src="https://github.com/user-attachments/assets/612b8b1f-2b18-48de-95ec-930a54bc3f35" /></td>
    <td><img src="https://github.com/user-attachments/assets/01a0e79e-7a8e-4414-8f45-c399a30fba0e" /></td>
  </tr>
</table>

## `src` folder structure

The main rule is to keep navigation, feature UI, reusable UI, and backend communication separate:

| Folder           | Description                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `src/app`        | Screen routes and navigation layouts. These files connect a URL/route to a screen.                     |
| `src/screens`    | Screen codes, such as login, maps, recycling centres, charging stations, and My Hub.                   |
| `src/components` | Reusable UI used by more than one screen, such as buttons, headers, inputs, loading screens, and tabs. |
| `src/services`   | NetZero backend API calls, React Query hooks, API configuration, storage, and service-related types.   |
| `src/hooks`      | Reusable React hooks for behaviour such as location permissions, device location, and searching.       |
| `src/auth`       | Authentication helpers, token handling, and authentication specific types.                             |
| `src/types`      | Shared TypeScript types used across multiple features, including API and map types.                    |
| `src/utils`      | Small shared helper functions, such as debounce, text, location, and toast helpers.                    |
| `src/states`     | Shared application state when a feature needs state outside its screen.                                |

For a new feature, add its route in `src/app`, its screen code in `src/screens`, reusable UI in `src/components`, and its backend requests in `src/services`. Screens should use the service layer for NetZero API requests.

## Get started

- NodeJS, Java17 required

Install dependencies

```bash
npm install
```

Run the project on android

```bash
npm run android
```

Install additional packages

```bash
npx expo install <package-name>
```

Remove a package

```bash
npm remove <package-name>
```
