# Stacks Client
Run the stacks app on iOS, Android, and Web.

## Development

### Setup
Install deps.
```npm install```

Start the dev server.
```npx expo start```

### deploy to Web
change config.ts to point to the right api, then:
```./deploy.sh```

Run bundle locally.
```npx serve dist -l 8081```

Upload bundle to google cloud storage bucket: `www.getstacks.io`


### deploy to Apple App Store
Build with the EAS service.
```eas build --platform ios --profile production```

Submit to App Store.
```eas submit -p ios```


### install development build onto physical device
```eas build --platform ios --profile development```
Then copy the QR code to download the build onto your device.

### build locally
The prebuild may not be necessary, but this generates the native code for the target OS,
a base layer of sorts.
```npx expo prebuild -p ios```

```eas build -p ios --local --profile development```
This may fail on several accounts. I had the following errors:
```fastlane not found```
So i did
```sudo gem install fastlane -NV```
then I got some error like
```some dep is too old, or ruby version too old```
so I had to install a newer version of ruby
```
brew install rbenv\nbrew install ruby-build
rbenv init
eval "$(rbenv init - zsh)"
rbenv install 3.3.3
rbenv global 3.3.3
```
Then I could finally install fastlane.
```sudo gem install fastlane -NV```
Then I could finally run the build
```eas build -p ios --local --profile development```
The build errored
```Distribution certificate with fingerprint xxxxxxxxxxx hasn't been imported successfully```
So I downloaded my Apple Cert and added it to my keychain
https://developer.apple.com/account/resources/certificates/list

But I still got the same error, so I installed this other universal cert and got past that error.
https://github.com/expo/eas-cli/issues/1331#issuecomment-1235603312

