# Complete Step-by-Step Guide to Build the Admin iPhone App

## What you'll need
- A Windows PC (you're on it)
- An iPhone
- A lightning/USB-C cable
- Internet connection

---

## Step 1: Open the folder

1. Open **File Explorer**
2. Go to `C:\Users\tayya\pipe-cleaner-flowers\admin-app`

---

## Step 2: Install Node.js (if you don't have it)

1. Open your browser, go to https://nodejs.org
2. Download the **LTS** version (left button)
3. Run the installer — click **Next** through everything, don't change anything
4. Restart your computer

---

## Step 3: Install npm packages

1. Press **Windows Key**, type `cmd`, right-click **Command Prompt**, click **Run as administrator**
2. In the black window, type this and press **Enter**:
```
cd C:\Users\tayya\pipe-cleaner-flowers\admin-app
```
3. Then type this and press **Enter**:
```
npm install
```
4. Wait for it to finish (may take 2-3 minutes). It will show 0 vulnerabilities at the end.

---

## Step 4: Install Expo CLI

In the same command prompt, type:
```
npm install -g eas-cli
```
Press **Enter** and wait for it to finish.

---

## Step 5: Create a free Expo account

1. Open your browser, go to https://expo.dev/signup
2. Sign up with your email (it's free)
3. Verify your email

---

## Step 6: Login to Expo from command prompt

Back in the command prompt, type:
```
eas login
```
Press **Enter**. Type your email, press **Enter**. Type your password, press **Enter**. It will say "Logged in".

---

## Step 7: Configure the build

In the command prompt, type:
```
eas build:configure
```
Press **Enter**. When it asks "Which platform?", press the down arrow key to select **All**, then press **Enter**. When it asks about @expo/vector-icons, type `n` and press **Enter**.

---

## Step 8: Build the IPA (iPhone app file)

In the command prompt, type:
```
eas build --platform ios --profile development
```
Press **Enter**.

**Important:** It will ask you several questions:
- "Do you want to use an Apple account to generate the credentials?" → Type `y` and press **Enter**
- "Apple ID" → Type your Apple ID email and press **Enter**
- "Apple ID password" → Type your Apple ID password (used only for this build) and press **Enter**
- "Select a team" → If you have one, select it. If not, your name should appear. Press **Enter**

The build will be sent to Expo's cloud servers. It takes **5-10 minutes**.

---

## Step 9: Download the IPA

1. When the build finishes, the command prompt will show a URL like `https://expo.dev/accounts/yourname/projects/gul-o-rang-admin/builds/...`
2. Open that URL in your browser
3. Click **Download** to get the `.ipa` file

---

## Step 10: Install on iPhone with 3uTools

1. Connect your iPhone to the computer with the cable
2. Open **3uTools**
3. Click **Toolbox** (top menu)
4. Click **Install IPA**
5. Click **Select File** and find the `.ipa` file you downloaded
6. Click **Install**

The app will appear on your iPhone. Tap the **gul-o-rang Admin** icon to open it.

---

## Step 11: Use the app

1. Make sure your computer is running the server (the `python -m http.server 8000` command)
2. Open the app on your iPhone
3. It will ask for a **Server Address** — type your computer's local IP followed by `:8000`
   - **How to find your computer's IP:** Open Command Prompt and type `ipconfig`. Look for `IPv4 Address` under your Wi-Fi adapter (e.g. `192.168.1.100`)
4. Tap **Connect**
5. You'll see the admin panel on your phone!

---

## Need to rebuild?

If you make changes to the admin panel and want a new IPA, repeat Step 8 only:
```
eas build --platform ios --profile development
```

## Troubleshooting

- **"Cannot connect to server"** — Make sure the computer and iPhone are on the same Wi-Fi network. Make sure the Python server is running (`python -m http.server 8000`).
- **Build fails** — You might need to join Apple's free developer program. Go to https://developer.apple.com/register and sign in with your Apple ID. No payment needed for testing.
- **npm install fails** — Run as Administrator. Try turning off antivirus temporarily.
- **eas login says "Invalid credentials"** — Make sure you verified your email with Expo.
