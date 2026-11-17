# NetZeroHub Mobile App

Mobile app for accessing NetZeroHub services, part of a microservices practice project.

- **Backend Repository:** [NetZeroHub Backend](https://github.com/vclong2003/netzerohub-backend)

## Features & Screenshots

### Authentication
| Register | OTP Verification |
| :---: | :---: |
| ![Register](https://github.com/user-attachments/assets/435d6aca-8de4-406f-b156-3e0e8d49850e) | ![OTP Verification](https://github.com/user-attachments/assets/8583edae-39d6-441a-9675-21293b9d9bf9) |

### Green Charging Stations
| Charging Stations Map | Station Info |
| :---: | :---: |
| ![Stations Map](https://github.com/user-attachments/assets/d8696261-7c9a-4cc9-b195-115883ef2318) | ![Station Info Bottom Sheet](https://github.com/user-attachments/assets/4acf86b3-3a3e-424d-9645-37931e8f1fc2) |

### Recycling Centres
| Recycling Centres Map | Centre Info |
| :---: | :---: |
| ![Centres Map](https://github.com/user-attachments/assets/cfc536b2-f7db-4cf7-b6a1-916332332cf7) | ![Centre Info Bottom Sheet](https://github.com/user-attachments/assets/69d62b38-8378-4cf2-b254-7da7538f6128) |

### Pollution Reports
| Pollution Report | Pollution Report History |
| :---: | :---: |
| ![Pollution Report Form](https://github.com/user-attachments/assets/729aad36-861d-4c4f-8492-984697520a89) | ![Pollution Report History](https://github.com/user-attachments/assets/7a296ee2-078e-4acd-8a8e-0c5c2371111c) |

## Project Structure (`src/`)

| Folder           | Description                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `src/app`        | Expo Router routes and navigation layouts.                                                             |
| `src/screens`    | Feature screens (login, maps, recycling centres, charging stations, My Hub).                           |
| `src/components` | Shared reusable UI components (buttons, headers, inputs, loading states, tabs).                        |
| `src/services`   | NetZero backend API clients, React Query hooks, and service types.                                     |
| `src/hooks`      | Custom hooks (location permissions, device location, search).                                          |
| `src/auth`       | Authentication helpers, token handling, and auth types.                                                |
| `src/types`      | Shared TypeScript types across features.                                                               |
| `src/utils`      | Shared helper functions (debounce, text, location, toast).                                             |
| `src/states`     | Shared global application state.                                                                       |

## Getting Started

**Prerequisites:** Node.js, Java 17 (for Android builds)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run on Android:

   ```bash
   npm run android
   ```
