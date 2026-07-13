# gul-o-rang Admin App

iOS/Android app that wraps the gul-o-rang admin panel in a WebView.

## Build for iOS (IPA)

### Prerequisites
- Node.js 18+
- An Apple ID (free is fine for sideloading)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Steps

```bash
# Install dependencies
npm install

# Install EAS CLI
npm install -g eas-cli

# Login to Expo (creates free account)
eas login

# Configure the build
eas build:configure

# Build for iOS (generates IPA)
eas build --platform ios --profile development
```

The IPA will be available for download from the Expo dashboard. You can then sideload it with 3uTools.

### Development

```bash
# Start the dev server
npx expo start

# Scan the QR code with Expo Go app on your phone
```

### Server Configuration

On first launch, enter your server's local IP address and port (e.g. `192.168.1.100:8000`). The server must be running the admin panel (`python -m http.server 8000`) on the same network.

### Changing the Server URL

Tap the gear icon (⚙) in the bottom toolbar to change the server IP/port.
